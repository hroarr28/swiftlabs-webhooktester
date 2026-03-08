/**
 * PDF Export Example using @react-pdf/renderer
 * 
 * This example shows how to generate PDFs from React components.
 * Common use cases: invoices, contracts, reports, receipts, certificates.
 * 
 * Install: npm install @react-pdf/renderer
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from '@react-pdf/renderer'

// Register custom fonts (optional)
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: '/fonts/Inter-Regular.ttf' },
//     { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
//   ],
// })

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #000',
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottom: '1 solid #eee',
  },
  tableCol: {
    flex: 1,
  },
  tableColNarrow: {
    width: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTop: '1 solid #eee',
    paddingTop: 10,
  },
  link: {
    color: '#0066cc',
    textDecoration: 'underline',
  },
})

// Example data types
export type ExamplePDFData = {
  documentNumber: string
  date: string
  companyName: string
  companyLogo?: string
  recipientName: string
  recipientEmail: string
  items: Array<{
    description: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  notes?: string
}

// PDF Document Component
export function ExamplePDF({ data }: { data: ExamplePDFData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {data.companyLogo && <Image src={data.companyLogo} style={styles.logo} />}
          <Text style={styles.title}>Invoice</Text>
          <View style={styles.row}>
            <Text style={styles.text}>Invoice #: {data.documentNumber}</Text>
            <Text style={styles.text}>Date: {data.date}</Text>
          </View>
        </View>

        {/* Recipient Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.text}>{data.recipientName}</Text>
          <Text style={styles.text}>{data.recipientEmail}</Text>
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>From:</Text>
          <Text style={styles.text}>{data.companyName}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol}>Description</Text>
            <Text style={styles.tableColNarrow}>Qty</Text>
            <Text style={styles.tableColNarrow}>Price</Text>
            <Text style={styles.tableColNarrow}>Total</Text>
          </View>

          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.text]}>{item.description}</Text>
              <Text style={[styles.tableColNarrow, styles.text]}>{item.quantity}</Text>
              <Text style={[styles.tableColNarrow, styles.text]}>
                £{item.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableColNarrow, styles.text]}>
                £{item.total.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={{ marginLeft: 'auto', width: 200 }}>
          <View style={styles.row}>
            <Text style={styles.text}>Subtotal:</Text>
            <Text style={styles.text}>£{data.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Tax (20%):</Text>
            <Text style={styles.text}>£{data.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, { borderTop: '1 solid #000', paddingTop: 5 }]}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>
              £{data.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={[styles.section, { marginTop: 30 }]}>
            <Text style={styles.sectionTitle}>Notes:</Text>
            <Text style={styles.text}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Link src="https://example.com" style={styles.link}>
            www.example.com
          </Link>
        </View>
      </Page>
    </Document>
  )
}

// Example usage in an API route:
// 
// import { renderToStream } from '@react-pdf/renderer'
// import { ExamplePDF } from '@/lib/pdf/example-pdf'
// 
// export async function GET() {
//   const data: ExamplePDFData = {
//     documentNumber: 'INV-001',
//     date: new Date().toLocaleDateString(),
//     companyName: 'Your Company Ltd',
//     recipientName: 'John Doe',
//     recipientEmail: 'john@example.com',
//     items: [
//       { description: 'Web Development', quantity: 10, price: 100, total: 1000 },
//       { description: 'Design Work', quantity: 5, price: 80, total: 400 },
//     ],
//     subtotal: 1400,
//     tax: 280,
//     total: 1680,
//     notes: 'Payment due within 30 days.',
//   }
//
//   const stream = await renderToStream(<ExamplePDF data={data} />)
//   
//   return new Response(stream as unknown as ReadableStream, {
//     headers: {
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename="invoice.pdf"',
//     },
//   })
// }
