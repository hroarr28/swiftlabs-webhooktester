'use client';

import { WebhookRequest } from '@/lib/actions/requests';
import { useState } from 'react';
import { RequestDetailModal } from './request-detail-modal';

interface RequestsListProps {
  requests: WebhookRequest[];
  endpointId: string;
}

export function RequestsList({ requests, endpointId }: RequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);

  if (requests.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">
          No requests received yet. Send a webhook to your endpoint URL to see it here.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Test with: <code className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">curl -X POST [your-endpoint-url]</code>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {requests.map((request) => (
          <button
            key={request.id}
            onClick={() => setSelectedRequest(request)}
            className="w-full px-4 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      request.method === 'POST'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                        : request.method === 'GET'
                        ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                        : request.method === 'PUT' || request.method === 'PATCH'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                        : request.method === 'DELETE'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                        : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    {request.method}
                  </span>
                  <span className="font-mono text-sm text-zinc-900 dark:text-white">
                    {request.path}
                  </span>
                  {request.forwarded && (
                    <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-950 dark:text-purple-200">
                      Forwarded
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                  <span>
                    {new Date(request.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  {request.ip_address && <span>IP: {request.ip_address}</span>}
                  {request.content_type && <span>{request.content_type}</span>}
                  <span>{(request.size_bytes / 1024).toFixed(2)} KB</span>
                </div>
              </div>
              <svg
                className="h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
}
