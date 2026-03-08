# Export Format Pattern

Let users download their data in CSV, JSON, or XML formats.

## Quick Start

### Basic CSV Export

```typescript
// app/api/export/users/route.ts
import { NextRequest } from 'next/server';
import { exportData } from '@/lib/export/formats';

export async function GET(req: NextRequest) {
  const users = await db.users.findMany();
  
  // One-liner CSV export
  return exportData.csv(users, 'users.csv');
}
```

### Basic JSON Export

```typescript
// app/api/export/data/route.ts
import { exportData } from '@/lib/export/formats';

export async function GET() {
  const data = await db.orders.findMany();
  
  return exportData.json(data, 'orders.json', { pretty: true });
}
```

### Basic XML Export

```typescript
// app/api/export/feed/route.ts
import { exportData } from '@/lib/export/formats';

export async function GET() {
  const posts = await db.posts.findMany();
  
  return exportData.xml({ posts }, 'feed.xml', {
    rootTag: 'feed',
    declaration: true,
  });
}
```

## Format-Specific Functions

### CSV Conversion

```typescript
import { arrayToCSV } from '@/lib/export/formats';

const users = [
  { name: 'Alice', age: 30, email: 'alice@example.com' },
  { name: 'Bob', age: 25, email: 'bob@example.com' },
];

// Basic CSV
const csv = arrayToCSV(users);
// Output:
// name,age,email
// Alice,30,alice@example.com
// Bob,25,bob@example.com

// Custom headers
const csvWithHeaders = arrayToCSV(users, {
  headers: ['Full Name', 'Age', 'Email Address'],
});

// Select specific columns
const csvPartial = arrayToCSV(users, {
  columns: ['name', 'email'], // Exclude 'age'
});

// Custom delimiter (TSV)
const tsv = arrayToCSV(users, {
  delimiter: '\t',
});

// Without BOM (for non-Excel use)
const csvNoBOM = arrayToCSV(users, {
  includeBOM: false,
});
```

### JSON Conversion

```typescript
import { toJSON } from '@/lib/export/formats';

const data = { users, total: 2 };

// Compact JSON
const compact = toJSON(data);

// Pretty-printed JSON
const pretty = toJSON(data, { pretty: true });

// Custom indentation
const customIndent = toJSON(data, {
  pretty: true,
  indent: 4,
});
```

### XML Conversion

```typescript
import { toXML } from '@/lib/export/formats';

const data = {
  users: [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ],
};

// Basic XML
const xml = toXML(data, { rootTag: 'response' });
// Output:
// <?xml version="1.0" encoding="UTF-8"?>
// <response>
//   <users>
//     <name>Alice</name>
//     <age>30</age>
//   </users>
//   <users>
//     <name>Bob</name>
//     <age>25</age>
//   </users>
// </response>

// Compact XML (no formatting)
const compactXML = toXML(data, {
  rootTag: 'data',
  pretty: false,
});

// No XML declaration
const noDeclaration = toXML(data, {
  declaration: false,
});
```

## Real-World Examples

### Export Users Table

```typescript
// app/api/admin/export/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DataExporter } from '@/lib/export/formats';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get format from query params
  const format = req.nextUrl.searchParams.get('format') || 'csv';
  
  // Fetch users
  const { data: users } = await supabase
    .from('users')
    .select('id, email, created_at, plan')
    .order('created_at', { ascending: false });
  
  if (!users) {
    return NextResponse.json({ error: 'No data' }, { status: 404 });
  }
  
  // Export in requested format
  const exporter = new DataExporter(users);
  const filename = `users-${new Date().toISOString().split('T')[0]}`;
  
  switch (format) {
    case 'json':
      return exporter.download('json', `${filename}.json`, {
        jsonOptions: { pretty: true },
      });
    case 'xml':
      return exporter.download('xml', `${filename}.xml`, {
        xmlOptions: { rootTag: 'users' },
      });
    case 'csv':
    default:
      return exporter.download('csv', `${filename}.csv`, {
        csvOptions: {
          headers: ['User ID', 'Email', 'Created At', 'Plan'],
        },
      });
  }
}
```

### Export with Date Formatting

```typescript
// Format dates before export
const orders = await db.orders.findMany();

const formattedOrders = orders.map(order => ({
  id: order.id,
  customer: order.customerName,
  total: `$${order.total.toFixed(2)}`,
  date: new Date(order.createdAt).toLocaleDateString('en-GB'),
  status: order.status.toUpperCase(),
}));

return exportData.csv(formattedOrders, 'orders.csv');
```

### Export with Nested Data (Flattening)

```typescript
// Flatten nested objects for CSV
const invoices = await db.invoices.findMany({
  include: { customer: true, items: true },
});

const flatInvoices = invoices.map(invoice => ({
  invoice_id: invoice.id,
  invoice_number: invoice.number,
  customer_name: invoice.customer.name,
  customer_email: invoice.customer.email,
  total_amount: invoice.total,
  item_count: invoice.items.length,
  created_at: invoice.createdAt,
}));

return exportData.csv(flatInvoices, 'invoices.csv');
```

### Multi-Format Export API

```typescript
// app/api/export/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exportData, ContentType } from '@/lib/export/formats';

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get('format') || 'csv';
  const startDate = req.nextUrl.searchParams.get('start');
  const endDate = req.nextUrl.searchParams.get('end');
  
  // Fetch transactions
  const transactions = await db.transactions.findMany({
    where: {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
  });
  
  if (transactions.length === 0) {
    return NextResponse.json(
      { error: 'No transactions found' },
      { status: 404 }
    );
  }
  
  const filename = `transactions-${Date.now()}`;
  
  // Format-specific exports
  switch (format.toLowerCase()) {
    case 'json':
      return exportData.json(transactions, `${filename}.json`, {
        pretty: true,
      });
      
    case 'xml':
      return exportData.xml(
        { transactions },
        `${filename}.xml`,
        { rootTag: 'export' }
      );
      
    case 'csv':
      return exportData.csv(transactions, `${filename}.csv`, {
        columns: ['id', 'amount', 'currency', 'status', 'createdAt'],
        headers: ['ID', 'Amount', 'Currency', 'Status', 'Date'],
      });
      
    default:
      return NextResponse.json(
        { error: 'Invalid format. Use: csv, json, or xml' },
        { status: 400 }
      );
  }
}
```

### Client-Side Export Button

```typescript
// components/export-button.tsx
'use client';

import { useState } from 'react';

export function ExportButton({ endpoint }: { endpoint: string }) {
  const [loading, setLoading] = useState(false);
  
  async function handleExport(format: 'csv' | 'json' | 'xml') {
    setLoading(true);
    
    try {
      const response = await fetch(`${endpoint}?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      // Get filename from Content-Disposition header
      const disposition = response.headers.get('Content-Disposition');
      const filename = disposition?.match(/filename="(.+)"/)?.[1] || 
                      `export-${Date.now()}.${format}`;
      
      // Download file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('csv')}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Exporting...' : 'Export CSV'}
      </button>
      <button
        onClick={() => handleExport('json')}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        Export JSON
      </button>
      <button
        onClick={() => handleExport('xml')}
        disabled={loading}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
      >
        Export XML
      </button>
    </div>
  );
}
```

### Usage in Dashboard

```typescript
// app/dashboard/users/page.tsx
import { ExportButton } from '@/components/export-button';

export default function UsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <ExportButton endpoint="/api/admin/export/users" />
      </div>
      
      {/* User table... */}
    </div>
  );
}
```

## Advanced Patterns

### Large Dataset Streaming

```typescript
// For very large exports, stream data instead of loading all at once
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send CSV header
      controller.enqueue(encoder.encode('id,name,email\n'));
      
      // Stream data in batches
      let offset = 0;
      const batchSize = 1000;
      
      while (true) {
        const users = await db.users.findMany({
          skip: offset,
          take: batchSize,
        });
        
        if (users.length === 0) break;
        
        // Send batch
        for (const user of users) {
          const line = `${user.id},"${user.name}","${user.email}"\n`;
          controller.enqueue(encoder.encode(line));
        }
        
        offset += batchSize;
      }
      
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="users.csv"',
    },
  });
}
```

### Export with Filters

```typescript
// app/api/export/sales/route.ts
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  
  // Build filters from query params
  const filters = {
    status: searchParams.get('status'),
    minAmount: searchParams.get('min_amount'),
    maxAmount: searchParams.get('max_amount'),
    startDate: searchParams.get('start_date'),
    endDate: searchParams.get('end_date'),
  };
  
  const sales = await db.sales.findMany({
    where: {
      status: filters.status || undefined,
      amount: {
        gte: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
        lte: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined,
      },
      createdAt: {
        gte: filters.startDate ? new Date(filters.startDate) : undefined,
        lte: filters.endDate ? new Date(filters.endDate) : undefined,
      },
    },
  });
  
  return exportData.csv(sales, 'sales-filtered.csv');
}
```

### Multi-Sheet Excel Alternative

For true Excel (.xlsx) files with multiple sheets, use a library:

```bash
npm install xlsx
```

```typescript
import * as XLSX from 'xlsx';

export async function GET() {
  const users = await db.users.findMany();
  const orders = await db.orders.findMany();
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add sheets
  const usersSheet = XLSX.utils.json_to_sheet(users);
  const ordersSheet = XLSX.utils.json_to_sheet(orders);
  
  XLSX.utils.book_append_sheet(wb, usersSheet, 'Users');
  XLSX.utils.book_append_sheet(wb, ordersSheet, 'Orders');
  
  // Generate buffer
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="report.xlsx"',
    },
  });
}
```

## CSV Edge Cases

### Handling Special Characters

```typescript
const data = [
  { name: 'Company, Inc.', description: 'A company with "quotes"' },
  { name: 'Multi\nLine\nName', description: 'Has\nNewlines' },
];

// Automatically escapes commas, quotes, and newlines
const csv = arrayToCSV(data);
// Output:
// name,description
// "Company, Inc.","A company with ""quotes"""
// "Multi
// Line
// Name","Has
// Newlines"
```

### Excel UTF-8 Compatibility

```typescript
// Include BOM for Excel to recognize UTF-8
const csv = arrayToCSV(users, {
  includeBOM: true, // Default: true
});

// Excel will correctly display characters like: £, €, ñ, 中文
```

## Testing

### Test CSV Generation

```typescript
// __tests__/export.test.ts
import { arrayToCSV } from '@/lib/export/formats';

describe('CSV Export', () => {
  it('generates valid CSV', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ];
    
    const csv = arrayToCSV(data, { includeBOM: false });
    
    expect(csv).toBe('name,age\nAlice,30\nBob,25');
  });
  
  it('escapes commas and quotes', () => {
    const data = [{ name: 'Company, Inc.', motto: 'We "care"' }];
    
    const csv = arrayToCSV(data, { includeBOM: false });
    
    expect(csv).toContain('"Company, Inc."');
    expect(csv).toContain('"We ""care"""');
  });
});
```

### Test API Endpoint

```bash
# Test CSV export
curl http://localhost:3000/api/export/users?format=csv > users.csv

# Test JSON export
curl http://localhost:3000/api/export/users?format=json | jq

# Test XML export
curl http://localhost:3000/api/export/users?format=xml
```

## Security Considerations

### 1. Authentication Required

```typescript
export async function GET(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Only export user's own data
  const data = await db.items.findMany({
    where: { userId: session.user.id },
  });
  
  return exportData.csv(data, 'my-data.csv');
}
```

### 2. Rate Limiting

```typescript
import { rateLimiters } from '@/lib/middleware/rate-limit';

export async function GET(req: NextRequest) {
  // Limit exports to prevent abuse
  const rateLimitResult = rateLimiters.strict(req);
  if (rateLimitResult) return rateLimitResult;
  
  // Export logic...
}
```

### 3. Data Sanitization

```typescript
// Remove sensitive fields before export
const users = await db.users.findMany();

const sanitized = users.map(({ password, apiKey, ...safe }) => safe);

return exportData.csv(sanitized, 'users.csv');
```

## Summary

- ✅ Use `exportData.csv()` / `.json()` / `.xml()` for quick exports
- ✅ Use `DataExporter` class for multi-format support
- ✅ CSV includes BOM by default for Excel UTF-8 compatibility
- ✅ Always authenticate export endpoints
- ✅ Rate limit to prevent abuse
- ✅ Sanitize sensitive data before export
- ✅ For large datasets (&gt;10k rows), use streaming

**Common Patterns:**
- Admin dashboard: Export all users → CSV with custom headers
- User data export (GDPR): Export user's own data → JSON (complete)
- Analytics reports: Export filtered data → CSV or Excel
- API integrations: Export for external systems → JSON or XML
- Backup functionality: Export entire database → JSON (structured)

**Next Steps:**
1. Add export endpoints to your API routes
2. Add export buttons to admin/dashboard pages
3. Test with large datasets to ensure performance
4. Consider caching for frequently requested exports
