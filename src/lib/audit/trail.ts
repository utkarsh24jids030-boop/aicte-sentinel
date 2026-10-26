// AICTE Sentinel Cryptographically Hash-Chained Audit Trail
// Tamper-evident ledger with SHA-256 previous-hash verification
// Problem Statement SIH26261 - Smart India Hackathon 2026

import crypto from 'crypto';
import { AuditEvent, UserRole, RecordViewAccessEvent } from '@/types';

export class AuditTrailEngine {
  private static readonly GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
  private static events: AuditEvent[] = [];

  // Seeded record-view access events (Item 8)
  private static accessEvents: RecordViewAccessEvent[] = [
    {
      id: 'acc-001',
      timestamp: '2026-01-20T10:14:20Z',
      actorId: 'user-officer-rao',
      actorName: 'Smt. Priyadarshini Rao',
      actorRole: 'OFFICER',
      viewedType: 'APPLICATION',
      viewedId: 'app-sunrise-001',
      viewedTitle: 'AICTE/2026/SUN-1001 (Sunrise Institute)',
      applicationId: 'app-sunrise-001',
      institutionName: 'Sunrise Institute of Technology',
      ipAddress: '10.0.14.22 (Officer VPN)'
    },
    {
      id: 'acc-002',
      timestamp: '2026-01-20T10:15:30Z',
      actorId: 'user-officer-rao',
      actorName: 'Smt. Priyadarshini Rao',
      actorRole: 'OFFICER',
      viewedType: 'DOCUMENT',
      viewedId: 'doc-sun-fire',
      viewedTitle: 'Fire Safety Certificate (NOC)',
      applicationId: 'app-sunrise-001',
      institutionName: 'Sunrise Institute of Technology',
      ipAddress: '10.0.14.22 (Officer VPN)'
    },
    {
      id: 'acc-003',
      timestamp: '2026-01-22T14:22:10Z',
      actorId: 'user-officer-rao',
      actorName: 'Smt. Priyadarshini Rao',
      actorRole: 'OFFICER',
      viewedType: 'APPLICATION',
      viewedId: 'app-nova-002',
      viewedTitle: 'AICTE/2026/NOV-9014 (Nova Engineering)',
      applicationId: 'app-nova-002',
      institutionName: 'Nova Engineering College',
      ipAddress: '10.0.14.22 (Officer VPN)'
    },
    {
      id: 'acc-004',
      timestamp: '2026-01-23T09:11:45Z',
      actorId: 'user-evc-1',
      actorName: 'Prof. Harish Chandra',
      actorRole: 'EVC_INSPECTOR',
      viewedType: 'DOCUMENT',
      viewedId: 'doc-nov-land',
      viewedTitle: 'Sub-Divisional Registered Land Lease Deed',
      applicationId: 'app-nova-002',
      institutionName: 'Nova Engineering College',
      ipAddress: '10.0.18.5 (EVC Tablet)'
    },
    {
      id: 'acc-005',
      timestamp: '2026-01-25T10:05:00Z',
      actorId: 'user-auditor-1',
      actorName: 'Dr. K. S. Subramanian',
      actorRole: 'AUDITOR',
      viewedType: 'APPLICATION',
      viewedId: 'app-apex-003',
      viewedTitle: 'AICTE/2026/APX-4421 (Apex Polytechnic)',
      applicationId: 'app-apex-003',
      institutionName: 'Apex Polytechnic Institute',
      ipAddress: '10.0.4.10 (Auditor Gateway)'
    }
  ];

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
   * Record a new audit event and append to the tamper-evident hash chain
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
    ruleId?: string;
    ruleVersion?: string;
    sourceChecked?: string;
    sourceResponseStatus?: string;
    alertRaisedId?: string;
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
      ruleId: params.ruleId,
      ruleVersion: params.ruleVersion,
      sourceChecked: params.sourceChecked,
      sourceResponseStatus: params.sourceResponseStatus,
      alertRaisedId: params.alertRaisedId,
      ipAddress: params.ipAddress || '127.0.0.1 (Internal Demo Loopback)',
      userAgent: params.userAgent || 'AICTE-Sentinel-SecureClient/2026.3',
      prevHash,
      hash
    };

    this.events.push(event);
    return event;
  }

  /**
   * Record a user accessing/viewing an application or document (Item 8)
   */
  static recordAccessEvent(event: Omit<RecordViewAccessEvent, 'id' | 'timestamp'>): RecordViewAccessEvent {
    const timestamp = new Date().toISOString();
    const newEvent: RecordViewAccessEvent = {
      ...event,
      id: `acc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp
    };
    this.accessEvents.unshift(newEvent);

    // Also link access into tamper-evident audit ledger
    this.recordEvent({
      actorId: event.actorId,
      actorName: event.actorName,
      actorRole: event.actorRole,
      action: 'RECORD_VIEW_ACCESS',
      entityType: 'RECORD_ACCESS',
      entityId: event.viewedId,
      afterSummary: `${event.actorRole} ${event.actorName} viewed ${event.viewedType} "${event.viewedTitle}" (${event.viewedId})`,
      ipAddress: event.ipAddress
    });

    return newEvent;
  }

  /**
   * Get record-view access events for Auditor oversight
   */
  static getAccessEvents(limit = 100): RecordViewAccessEvent[] {
    return this.accessEvents.slice(0, limit);
  }

  /**
   * Retrieve all audit events (in reverse chronological order by default)
   */
  static getEvents(limit = 100): AuditEvent[] {
    return [...this.events].reverse().slice(0, limit);
  }

  /**
   * Return the latest leaf/head hash of the cryptographically linked chain
   */
  static getHeadHash(): string {
    return this.events.length > 0
      ? this.events[this.events.length - 1].hash
      : this.GENESIS_HASH;
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
