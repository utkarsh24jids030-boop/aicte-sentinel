import { NextRequest, NextResponse } from 'next/server';
import { AlertService } from '@/lib/alerts/alertService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const includeMetrics = searchParams.get('metrics') === 'true';

    const alerts = AlertService.getAlerts(applicationId || undefined);
    const unreadCount = AlertService.getUnreadCount(applicationId || undefined);

    const response: {
      success: boolean;
      unreadCount: number;
      alerts: typeof alerts;
      metrics?: ReturnType<typeof AlertService.getTimelinessMetrics>;
    } = {
      success: true,
      unreadCount,
      alerts
    };

    if (includeMetrics) {
      response.metrics = AlertService.getTimelinessMetrics();
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId, markAll, applicationId } = body;

    if (markAll) {
      AlertService.markAllAsRead(applicationId);
      return NextResponse.json({ success: true, message: 'All alerts marked as read.' });
    }

    if (alertId) {
      const ok = AlertService.markAsRead(alertId);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ success: false, error: 'alertId or markAll required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
