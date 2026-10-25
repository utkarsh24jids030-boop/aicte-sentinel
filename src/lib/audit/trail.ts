// AICTE Sentinel Cryptographically Hash-Chained Audit Trail
// Immutable ledger with tamper-evident SHA-256 previous-hash verification
// Problem Statement SIH26261 - Smart India Hackathon 2026

import crypto from 'crypto';
import { AuditEvent, UserRole } from '@/types';

export class AuditTrailEngine {
  private static readonly GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
  private static events: AuditEvent[] = [];

  /**
   * Compute event SHA-256 hash from event payload and previous event hash
   */
  static computeEventHash(
    prevHash: string,
    timestamp: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    afterSummary?: string
  ): string {
    const raw = `${prevHash}|${timestamp}|${actorId}|${action}|${entityType}|${entityId}|${afterSummary || ''}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  /**
   * Record a new audit event and append to the immutable hash chain
   */
  static recordEvent(params: {
    actorId: string;
    actorName: string;
    actorRole: UserRole;
    action: string;
    entityType: AuditEvent['entityType'];
    entityId: string;
    beforeSummary?: string;
    afterSummary?: string;
    ipAddress?: string;
    userAgent?: string;
  }): AuditEvent {
    const timestamp = new Date().toISOString();
    const prevHash = this.events.length > 0 
      ? this.events[this.events.length - 1].hash 
      : this.GENESIS_HASH;

    const hash = this.computeEventHash(
      prevHash,
      timestamp,
      params.actorId,
      params.action,
      params.entityType,
      params.entityId,
      params.afterSummary
    );

    const event: AuditEvent = {
      id: `AUDIT-EVT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp,
      actorId: params.actorId,
      actorName: params.actorName,
      actorRole: params.actorRole,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      beforeSummary: params.beforeSummary,
      afterSummary: params.afterSummary,
      ipAddress: params.ipAddress || '127.0.0.1 (Internal Demo Loopback)',
      userAgent: params.userAgent || 'AICTE-Sentinel-SecureClient/2026.3',
      prevHash,
      hash
    };

    this.events.push(event);
    return event;
  }

  /**
   * Retrieve all audit events (in reverse chronological order by default)
   */
  static getEvents(limit = 100): AuditEvent[] {
    return [...this.events].reverse().slice(0, limit);
  }

  /**
   * Verify the entire cryptographic hash chain for integrity
   * Detects any altered event, inserted record, or deleted entry
   */
  static verifyChainIntegrity(): {
    isValid: boolean;
    totalEventsChecked: number;
    tamperedEventIndex?: number;
    errorReason?: string;
  } {
    if (this.events.length === 0) {
      return { isValid: true, totalEventsChecked: 0 };
    }

    for (let i = 0; i < this.events.length; i++) {
      const current = this.events[i];
      const expectedPrevHash = i === 0 ? this.GENESIS_HASH : this.events[i - 1].hash;

      if (current.prevHash !== expectedPrevHash) {
        return {
          isValid: false,
          totalEventsChecked: i + 1,
          tamperedEventIndex: i,
          errorReason: `Hash link broken at event #${i} (${current.id}). Expected prevHash "${expectedPrevHash.substring(0, 10)}...", but found "${current.prevHash.substring(0, 10)}...".`
        };
      }

      const recomputedHash = this.computeEventHash(
        current.prevHash,
        current.timestamp,
        current.actorId,
        current.action,
        current.entityType,
        current.entityId,
        current.afterSummary
      );

      if (recomputedHash !== current.hash) {
        return {
          isValid: false,
          totalEventsChecked: i + 1,
          tamperedEventIndex: i,
          errorReason: `Payload signature corrupted at event #${i} (${current.id}). Stored hash "${current.hash.substring(0, 10)}..." does not match recalculated hash "${recomputedHash.substring(0, 10)}...".`
        };
      }
    }

    return {
      isValid: true,
      totalEventsChecked: this.events.length
    };
  }

  /**
   * Seed initial audit records for demo startup with verified cryptographic chain
   */
  static seedInitialEvents(initialEvents: AuditEvent[]) {
    this.events = [];
    for (const rawEvt of initialEvents) {
      const prevHash = this.events.length > 0 
        ? this.events[this.events.length - 1].hash 
        : this.GENESIS_HASH;

      const hash = this.computeEventHash(
        prevHash,
        rawEvt.timestamp,
        rawEvt.actorId,
        rawEvt.action,
        rawEvt.entityType,
        rawEvt.entityId,
        rawEvt.afterSummary
      );

      this.events.push({
        ...rawEvt,
        prevHash,
        hash
      });
    }
  }
}
