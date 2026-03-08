# PDF Export Pattern

Generate beautiful PDFs from React components using `@react-pdf/renderer`.

## Installation

```bash
npm install @react-pdf/renderer
```

## What's Included

### 1. Example PDF Component
`lib/pdf/example-pdf.tsx`

Production-ready invoice/document template with:
- Company logo and branding
- Recipient information
- Itemized table
- Totals with tax calculation
- Notes section
- Professional styling

### 2. API Route
`app/api/pdf/example/route.ts`

Two endpoints:
- `GET /api/pdf/example` - Generate sample PDF
- `POST /api/pdf/example` - Generate PDF from request data

## Quick Start

### 1. Create Your PDF Component

```tsx
// lib/pdf/my-document.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 24, marginBottom: 20 },
  text: { fontSize: 12, lineHeight: 1.6 },
})

export function MyDocument({ title, content }: { title: string; content: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{content}</Text>
      </Page>
    </Document>
  )
}
```

### 2. Create API Route

```tsx
// app/api/my-pdf/route.ts
import { renderToStream } from '@react-pdf/renderer'
import { MyDocument } from '@/lib/pdf/my-document'

export async function GET() {
  const stream = await renderToStream(
    <MyDocument title="Hello" content="This is a PDF!" />
  )

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
    },
  })
}
```

### 3. Use in Your App

```tsx
// components/download-pdf-button.tsx
'use client'

export function DownloadPDFButton() {
  const handleDownload = async () => {
    const response = await fetch('/api/my-pdf')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return <button onClick={handleDownload}>Download PDF</button>
}
```

## Common Use Cases

### Invoice

```tsx
export function Invoice({ invoice }: { invoice: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice #{invoice.number}</Text>
          <Text>Date: {invoice.date}</Text>
        </View>

        <View style={styles.table}>
          {invoice.items.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.col}>{item.description}</Text>
              <Text style={styles.col}>£{item.total}</Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <Text>Total: £{invoice.total}</Text>
        </View>
      </Page>
    </Document>
  )
}
```

### Contract

```tsx
export function Contract({ contract }: { contract: ContractData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{contract.title}</Text>
        
        {contract.sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.text}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.signatures}>
          <Text>Client: _________________</Text>
          <Text>Date: {contract.date}</Text>
        </View>
      </Page>
    </Document>
  )
}
```

### Report

```tsx
export function Report({ data }: { data: ReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Monthly Report</Text>
        <Text style={styles.subtitle}>{data.month}</Text>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Revenue</Text>
            <Text style={styles.metricValue}>£{data.revenue}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Users</Text>
            <Text style={styles.metricValue}>{data.users}</Text>
          </View>
        </View>

        <View style={styles.chart}>
          {/* Add chart using react-pdf-charts or static image */}
        </View>
      </Page>
    </Document>
  )
}
```

### Certificate

```tsx
export function Certificate({ recipient, course }: { recipient: string; course: string }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.certificateTitle}>Certificate of Completion</Text>
          <Text style={styles.presentedTo}>Presented to</Text>
          <Text style={styles.recipientName}>{recipient}</Text>
          <Text style={styles.courseText}>
            for successfully completing {course}
          </Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  )
}
```

## Advanced Features

### Multi-Page Documents

```tsx
<Document>
  <Page size="A4">
    <Text>Page 1</Text>
  </Page>
  <Page size="A4">
    <Text>Page 2</Text>
  </Page>
</Document>
```

### Custom Fonts

```tsx
import { Font } from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Inter-Italic.ttf', fontStyle: 'italic' },
  ],
})

const styles = StyleSheet.create({
  text: { fontFamily: 'Inter' },
})
```

### Images

```tsx
import { Image } from '@react-pdf/renderer'

<Image 
  src="/logo.png"  // or data URL or external URL
  style={{ width: 100, height: 40 }}
/>
```

### Dynamic Content

```tsx
export function Invoice({ items }: { items: Item[] }) {
  return (
    <Document>
      <Page>
        {items.map((item, i) => (
          <View key={i}>
            <Text>{item.name}</Text>
            <Text>£{item.price}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
```

### Conditional Rendering

```tsx
<View>
  <Text>{data.title}</Text>
  {data.subtitle && <Text>{data.subtitle}</Text>}
  {data.urgent && (
    <View style={styles.urgentBanner}>
      <Text>URGENT</Text>
    </View>
  )}
</View>
```

### Page Headers/Footers

```tsx
const styles = StyleSheet.create({
  page: { padding: 40 },
  header: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
  },
})

<Page style={styles.page}>
  <View style={styles.header} fixed>
    <Text>Company Name</Text>
  </View>

  {/* Page content */}

  <View style={styles.footer} fixed>
    <Text>Page 1 of 1</Text>
  </View>
</Page>
```

### Page Numbers

```tsx
<Text render={({ pageNumber, totalPages }) => 
  `Page ${pageNumber} of ${totalPages}`
} fixed />
```

## Styling Tips

### Flexbox Layout

```tsx
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
})
```

### Colors

```tsx
const styles = StyleSheet.create({
  text: {
    color: '#333333',
    backgroundColor: '#f5f5f5',
  },
})
```

### Borders

```tsx
const styles = StyleSheet.create({
  box: {
    border: '1px solid #000',
    borderRadius: 4,
    padding: 10,
  },
})
```

### Spacing

```tsx
const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 20,
    marginBottom: 30,
  },
})
```

## Best Practices

1. **Keep styles in StyleSheet** - More performant than inline styles
2. **Use View for layout** - Don't nest Text inside Text
3. **Images should be optimized** - Large images slow PDF generation
4. **Test page breaks** - Long content may break unexpectedly
5. **Use fixed for headers/footers** - Keeps them on every page
6. **Fonts must be registered** - Default fonts: Helvetica, Times-Roman, Courier
7. **Base64 embed small images** - Avoids external requests
8. **Cache generated PDFs** - Don't regenerate unchanged documents

## Performance

### Server-Side Generation (Recommended)

```tsx
// API route - generates on server
export async function GET() {
  const stream = await renderToStream(<MyPDF />)
  return new Response(stream as unknown as ReadableStream)
}
```

### Client-Side Generation

```tsx
// Client component - generates in browser
import { PDFDownloadLink } from '@react-pdf/renderer'

<PDFDownloadLink document={<MyPDF />} fileName="doc.pdf">
  {({ loading }) => loading ? 'Generating...' : 'Download PDF'}
</PDFDownloadLink>
```

### Render to Blob

```tsx
import { pdf } from '@react-pdf/renderer'

const blob = await pdf(<MyPDF />).toBlob()
// Upload to storage, send via email, etc.
```

## Error Handling

```tsx
export async function GET() {
  try {
    const stream = await renderToStream(<MyPDF />)
    return new Response(stream as unknown as ReadableStream, {
      headers: { 'Content-Type': 'application/pdf' },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
```

## Testing

```tsx
import { render } from '@react-pdf/renderer'
import { MyPDF } from './my-pdf'

describe('MyPDF', () => {
  it('renders without errors', async () => {
    await expect(render(<MyPDF />)).resolves.toBeTruthy()
  })
})
```

## Deployment

- ✅ Works on Vercel, Netlify, AWS Lambda
- ✅ No external dependencies (unlike Puppeteer)
- ✅ Fast cold starts (~100ms)
- ⚠️ Large documents (100+ pages) may timeout on serverless
- 💡 For large PDFs, use background job queue

## Real-World Examples

- **Invoice Pilot** - Generate invoices with line items and totals
- **Contract Kit** - Legal contracts with signatures
- **DocForge** - API documentation export
- **BriefBuilder** - Client project briefs

## Resources

- [react-pdf/renderer docs](https://react-pdf.org/)
- [PDF styling guide](https://react-pdf.org/styling)
- [Components reference](https://react-pdf.org/components)
- [Examples gallery](https://react-pdf.org/repl)
