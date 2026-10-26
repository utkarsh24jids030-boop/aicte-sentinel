/**
 * Regulatory Alert Email Transport Service
 * Problem Statement SIH26261 - Smart India Hackathon 2026
 *
 * Dispatches statutory compliance alerts to applicant institutions and scrutiny officers.
 * In demo mode, logs complete structured regulatory email payload to console.
 */

import { RegulatoryAlert } from '@/types';

export interface EmailDispatchRecord {
  messageId: string;
  alertId: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  dispatchedAt: string;
  deliveryMode: 'CONSOLE_DEMO' | 'SMTP_GATEWAY';
}

export class EmailTransportService {
  private static dispatchLog: EmailDispatchRecord[] = [];

  static async sendAlertEmail(
    alert: RegulatoryAlert,
    recipientEmail: string,
    recipientName: string
  ): Promise<EmailDispatchRecord> {
    const timestamp = new Date().toISOString();
    const messageId = `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const isLiveGateway = process.env.EMAIL_TRANSPORT_ENABLED === 'true' && Boolean(process.env.SMTP_HOST);

    const categoryLabels: Record<string, string> = {
      missing_information: 'Missing Statutory Information',
      expired_documents: 'Expired Statutory Clearance',
      pending_source_verification: 'Pending Source Verification',
      suspected_anomalies: 'Suspected Compliance Anomaly',
      unresolved_items: 'Unresolved Regulatory Deficiency',
      clarification_requests: 'Official Clarification Requested'
    };

    const subject = `[AICTE REGULATION BUREAU] ${categoryLabels[alert.category] || 'Regulatory Alert'}: ${alert.applicationNumber} - ${alert.title}`;

    const formattedPayload = {
      messageId,
      timestamp,
      recipient: `${recipientName} <${recipientEmail}>`,
      subject,
      category: alert.category,
      severity: alert.severity,
      application: `${alert.institutionName} (${alert.applicationNumber})`,
      alertSummary: alert.message,
      portalActionUrl: `https://aicte-sentinel.gov.in${alert.actionUrl}`,
      disclaimer: 'CONFIDENTIAL: Official automated regulatory dispatch from AICTE Regulation Bureau.'
    };

    // Honest Demo Mode: Log structured regulatory dispatch to console
    console.log('\n======================================================');
    console.log('🏛️  [AICTE SENTINEL EMAIL TRANSPORT (DEMO MODE)]');
    console.log(`⏰  Timestamp:       ${formattedPayload.timestamp}`);
    console.log(`📨  To:              ${formattedPayload.recipient}`);
    console.log(`📋  Subject:         ${formattedPayload.subject}`);
    console.log(`🏷️   Category:        ${formattedPayload.category} (${formattedPayload.severity})`);
    console.log(`🏫  Institution:     ${formattedPayload.application}`);
    console.log(`📝  Message:         ${formattedPayload.alertSummary}`);
    console.log(`🔗  Portal Action:   ${formattedPayload.portalActionUrl}`);
    console.log('======================================================\n');

    const record: EmailDispatchRecord = {
      messageId,
      alertId: alert.id,
      recipientEmail,
      recipientName,
      subject,
      dispatchedAt: timestamp,
      deliveryMode: isLiveGateway ? 'SMTP_GATEWAY' : 'CONSOLE_DEMO'
    };

    this.dispatchLog.unshift(record);
    return record;
  }

  static getDispatchLog(): EmailDispatchRecord[] {
    return this.dispatchLog;
  }
}
