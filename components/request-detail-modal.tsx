'use client';

import { WebhookRequest } from '@/lib/actions/requests';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CopyButton } from './copy-button';

interface RequestDetailModalProps {
  request: WebhookRequest;
  onClose: () => void;
}

export function RequestDetailModal({ request, onClose }: RequestDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Request Details
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {new Date(request.created_at).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Method & Path */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Request
            </label>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={`rounded px-2 py-1 text-sm font-medium ${
                  request.method === 'POST'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                    : request.method === 'GET'
                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                    : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                }`}
              >
                {request.method}
              </span>
              <code className="flex-1 font-mono text-sm text-zinc-900 dark:text-white">
                {request.path}
              </code>
            </div>
          </div>

          {/* Headers */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Headers
              </label>
              <CopyButton text={JSON.stringify(request.headers, null, 2)} />
            </div>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {JSON.stringify(request.headers, null, 2)}
            </pre>
          </div>

          {/* Query Parameters */}
          {request.query_params && Object.keys(request.query_params).length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Query Parameters
                </label>
                <CopyButton text={JSON.stringify(request.query_params, null, 2)} />
              </div>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {JSON.stringify(request.query_params, null, 2)}
              </pre>
            </div>
          )}

          {/* Body */}
          {request.body && (
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Body
                </label>
                <CopyButton text={request.body} />
              </div>
              <pre className="mt-2 max-h-96 overflow-auto rounded-lg bg-zinc-100 p-4 text-xs font-mono text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                {request.body}
              </pre>
            </div>
          )}

          {/* Metadata */}
          <div className="grid gap-4 sm:grid-cols-2">
            {request.ip_address && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  IP Address
                </label>
                <p className="mt-1 text-sm text-zinc-900 dark:text-white">
                  {request.ip_address}
                </p>
              </div>
            )}
            {request.content_type && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Content Type
                </label>
                <p className="mt-1 text-sm text-zinc-900 dark:text-white">
                  {request.content_type}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Size
              </label>
              <p className="mt-1 text-sm text-zinc-900 dark:text-white">
                {(request.size_bytes / 1024).toFixed(2)} KB
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Forwarded
              </label>
              <p className="mt-1 text-sm text-zinc-900 dark:text-white">
                {request.forwarded ? 'Yes' : 'No'}
                {request.forwarded_at && (
                  <span className="ml-2 text-zinc-500">
                    {new Date(request.forwarded_at).toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
