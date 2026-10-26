'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { RegulatoryAlert, AlertCategory } from '@/types';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCheck, 
  Send, 
  FileQuestion, 
  ShieldAlert, 
  Layers, 
  HelpCircle,
  ExternalLink,
  X
} from 'lucide-react';

const CATEGORY_META: Record<AlertCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  missing_information: { label: 'Missing Info', icon: FileQuestion, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  expired_documents: { label: 'Expired Docs', icon: AlertTriangle, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  pending_source_verification: { label: 'Pending Source', icon: Clock, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  suspected_anomalies: { label: 'Suspected Anomaly', icon: ShieldAlert, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  unresolved_items: { label: 'Unresolved', icon: Layers, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  clarification_requests: { label: 'Clarifications', icon: HelpCircle, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
};

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      if (data.success) {
        setAlerts(data.alerts || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.error('Error fetching alerts:', e);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: id })
      });
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
      setAlerts(prev => prev.map(a => ({ ...a, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAlerts = selectedCategory === 'all'
    ? alerts
    : alerts.filter(a => a.category === selectedCategory);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-white/15 focus:bg-white/20 focus:outline-hidden transition-colors"
      >
        <Bell className="w-[22px] h-[22px] text-white shrink-0" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 min-w-[18px] h-[18px] text-[10px] font-black rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 sm:w-[440px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-sm tracking-wide">Regulation Bureau Notification Center</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Statutory regulatory alerts dispatched via in-app center & email transport
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Bar & Category Filters */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                {unreadCount > 0 ? `${unreadCount} unread regulatory alerts` : 'All alerts caught up'}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isLoading}
                  className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px]"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-semibold scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All ({alerts.length})
              </button>
              {Object.entries(CATEGORY_META).map(([key, meta]) => {
                const count = alerts.filter(a => a.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap flex items-center gap-1 ${
                      selectedCategory === key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{meta.label}</span>
                    <span className="font-mono text-[9px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert List */}
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No alerts found in this category.
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const meta = CATEGORY_META[alert.category] || {
                  label: alert.category,
                  icon: AlertTriangle,
                  color: 'text-slate-700 bg-slate-50 border-slate-200'
                };
                const IconComponent = meta.icon;
                const isCritical = alert.severity === 'Critical';
                const isHigh = alert.severity === 'High';

                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 transition-colors space-y-1.5 ${
                      alert.read ? 'bg-white opacity-85 hover:bg-slate-50/60' : 'bg-blue-50/40 hover:bg-blue-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${meta.color}`}>
                          <IconComponent className="w-3 h-3" />
                          <span>{meta.label}</span>
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          isCritical ? 'bg-rose-100 text-rose-800' : isHigh ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {alert.severity}
                        </span>
                        {!alert.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {new Date(alert.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 leading-snug">
                      {alert.title}
                    </h5>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px]">
                      <span className="font-mono text-slate-500 truncate max-w-[200px]">
                        {alert.institutionName} ({alert.applicationNumber})
                      </span>

                      <div className="flex items-center gap-2">
                        {alert.emailDispatched && (
                          <span className="text-emerald-700 flex items-center gap-1 text-[9px] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <Send className="w-2.5 h-2.5" />
                            <span>Email Sent</span>
                          </span>
                        )}

                        <Link
                          href={alert.actionUrl}
                          onClick={() => {
                            handleMarkAsRead(alert.id);
                            setIsOpen(false);
                          }}
                          className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-0.5"
                        >
                          <span>Review</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Timeliness Benchmark */}
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-600 flex items-center justify-around font-mono">
            <div>
              <span>Median Dispatch: </span>
              <strong className="text-slate-900">4s (Console/SMTP)</strong>
            </div>
            <div className="w-px h-3 bg-slate-300" />
            <div>
              <span>Median Resolution: </span>
              <strong className="text-slate-900">23.2h</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
