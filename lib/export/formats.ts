/**
 * Export Format Utilities
 * 
 * Convert data to CSV, JSON, XML for user downloads.
 * 
 * @see EXPORT_FORMAT_PATTERN.md for usage examples
 */

/**
 * Convert array of objects to CSV string
 * 
 * @example
 * ```ts
 * const data = [
 *   { name: 'Alice', age: 30, email: 'alice@example.com' },
 *   { name: 'Bob', age: 25, email: 'bob@example.com' }
 * ];
 * 
 * const csv = arrayToCSV(data);
 * // Output:
 * // name,age,email
 * // Alice,30,alice@example.com
 * // Bob,25,bob@example.com
 * ```
 */
export function arrayToCSV<T extends Record<string, unknown>>(
  data: T[],
  options: {
    /**
     * Custom column headers (defaults to object keys)
     */
    headers?: string[];
    
    /**
     * Columns to include (defaults to all)
     */
    columns?: (keyof T)[];
    
    /**
     * CSV delimiter (defaults to comma)
     */
    delimiter?: string;
    
    /**
     * Include BOM for Excel compatibility
     */
    includeBOM?: boolean;
  } = {}
): string {
  if (!data || data.length === 0) {
    return '';
  }
  
  const {
    headers,
    columns = Object.keys(data[0]) as (keyof T)[],
    delimiter = ',',
    includeBOM = true,
  } = options;
  
  // Build header row
  const headerRow = headers || columns.map(String);
  
  // Build data rows
  const rows = data.map(item => {
    return columns.map(column => {
      const value = item[column];
      return escapeCSVValue(value, delimiter);
    });
  });
  
  // Combine header + rows
  const csvLines = [
    headerRow.join(delimiter),
    ...rows.map(row => row.join(delimiter)),
  ];
  
  const csv = csvLines.join('\n');
  
  // Add BOM for Excel UTF-8 compatibility
  return includeBOM ? '\uFEFF' + csv : csv;
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Convert to string
  let str = String(value);
  
  // Check if value needs quoting
  const needsQuotes = 
    str.includes(delimiter) ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r');
  
  if (needsQuotes) {
    // Escape quotes by doubling them
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  
  return str;
}

/**
 * Convert data to formatted JSON string
 * 
 * @example
 * ```ts
 * const data = { users: [{ name: 'Alice' }, { name: 'Bob' }] };
 * const json = toJSON(data, { pretty: true });
 * ```
 */
export function toJSON(
  data: unknown,
  options: {
    /**
     * Pretty-print with indentation
     */
    pretty?: boolean;
    
    /**
     * Indentation spaces (default 2)
     */
    indent?: number;
  } = {}
): string {
  const { pretty = false, indent = 2 } = options;
  
  return JSON.stringify(data, null, pretty ? indent : 0);
}

/**
 * Convert object/array to XML string
 * 
 * @example
 * ```ts
 * const data = {
 *   users: {
 *     user: [
 *       { name: 'Alice', age: 30 },
 *       { name: 'Bob', age: 25 }
 *     ]
 *   }
 * };
 * 
 * const xml = toXML(data, { rootTag: 'response' });
 * // Output:
 * // <?xml version="1.0" encoding="UTF-8"?>
 * // <response>
 * //   <users>
 * //     <user>
 * //       <name>Alice</name>
 * //       <age>30</age>
 * //     </user>
 * //     <user>
 * //       <name>Bob</name>
 * //       <age>25</age>
 * //     </user>
 * //   </users>
 * // </response>
 * ```
 */
export function toXML(
  data: unknown,
  options: {
    /**
     * Root XML tag name
     */
    rootTag?: string;
    
    /**
     * Include XML declaration
     */
    declaration?: boolean;
    
    /**
     * Pretty-print with indentation
     */
    pretty?: boolean;
    
    /**
     * Indentation spaces
     */
    indent?: number;
  } = {}
): string {
  const {
    rootTag = 'data',
    declaration = true,
    pretty = true,
    indent = 2,
  } = options;
  
  const xmlDeclaration = declaration
    ? '<?xml version="1.0" encoding="UTF-8"?>\n'
    : '';
  
  const body = objectToXML(data, rootTag, pretty ? 0 : -1, indent);
  
  return xmlDeclaration + body;
}

/**
 * Convert object to XML (recursive)
 */
function objectToXML(
  obj: unknown,
  tagName: string,
  depth: number,
  indent: number
): string {
  const indentStr = depth >= 0 ? ' '.repeat(depth * indent) : '';
  const newline = depth >= 0 ? '\n' : '';
  
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return `${indentStr}<${tagName} />${newline}`;
  }
  
  // Handle primitives
  if (typeof obj !== 'object') {
    const escaped = escapeXML(String(obj));
    return `${indentStr}<${tagName}>${escaped}</${tagName}>${newline}`;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .map(item => objectToXML(item, tagName, depth, indent))
      .join('');
  }
  
  // Handle objects
  const entries = Object.entries(obj);
  
  if (entries.length === 0) {
    return `${indentStr}<${tagName} />${newline}`;
  }
  
  const children = entries
    .map(([key, value]) => {
      return objectToXML(value, key, depth >= 0 ? depth + 1 : -1, indent);
    })
    .join('');
  
  return `${indentStr}<${tagName}>${newline}${children}${indentStr}</${tagName}>${newline}`;
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate download response headers for file export
 * 
 * @example
 * ```ts
 * return new Response(csvData, {
 *   headers: getDownloadHeaders('users.csv', 'text/csv'),
 * });
 * ```
 */
export function getDownloadHeaders(
  filename: string,
  contentType: string
): Record<string, string> {
  return {
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-cache',
  };
}

/**
 * Content type constants
 */
export const ContentType = {
  CSV: 'text/csv; charset=utf-8',
  JSON: 'application/json; charset=utf-8',
  XML: 'application/xml; charset=utf-8',
  TEXT: 'text/plain; charset=utf-8',
} as const;

/**
 * Export data in multiple formats
 * 
 * @example
 * ```ts
 * const exporter = new DataExporter(users);
 * 
 * // Get CSV
 * const csv = exporter.toCSV();
 * 
 * // Get JSON
 * const json = exporter.toJSON({ pretty: true });
 * 
 * // Get XML
 * const xml = exporter.toXML({ rootTag: 'users' });
 * ```
 */
export class DataExporter<T extends Record<string, unknown>> {
  constructor(private data: T[]) {}
  
  /**
   * Export as CSV
   */
  toCSV(options?: Parameters<typeof arrayToCSV>[1]): string {
    return arrayToCSV(this.data, options);
  }
  
  /**
   * Export as JSON
   */
  toJSON(options?: Parameters<typeof toJSON>[1]): string {
    return toJSON(this.data, options);
  }
  
  /**
   * Export as XML
   */
  toXML(options?: Parameters<typeof toXML>[1]): string {
    return toXML({ items: this.data }, options);
  }
  
  /**
   * Get Response for download
   */
  download(
    format: 'csv' | 'json' | 'xml',
    filename: string,
    options?: {
      csvOptions?: Parameters<typeof arrayToCSV>[1];
      jsonOptions?: Parameters<typeof toJSON>[1];
      xmlOptions?: Parameters<typeof toXML>[1];
    }
  ): Response {
    let content: string;
    let contentType: string;
    
    switch (format) {
      case 'csv':
        content = this.toCSV(options?.csvOptions);
        contentType = ContentType.CSV;
        break;
      case 'json':
        content = this.toJSON(options?.jsonOptions);
        contentType = ContentType.JSON;
        break;
      case 'xml':
        content = this.toXML(options?.xmlOptions);
        contentType = ContentType.XML;
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    return new Response(content, {
      headers: getDownloadHeaders(filename, contentType),
    });
  }
}

/**
 * Quick export helpers
 */
export const exportData = {
  /**
   * Export as CSV download
   */
  csv: <T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    options?: Parameters<typeof arrayToCSV>[1]
  ): Response => {
    const csv = arrayToCSV(data, options);
    return new Response(csv, {
      headers: getDownloadHeaders(filename, ContentType.CSV),
    });
  },
  
  /**
   * Export as JSON download
   */
  json: (
    data: unknown,
    filename: string,
    options?: Parameters<typeof toJSON>[1]
  ): Response => {
    const json = toJSON(data, options);
    return new Response(json, {
      headers: getDownloadHeaders(filename, ContentType.JSON),
    });
  },
  
  /**
   * Export as XML download
   */
  xml: (
    data: unknown,
    filename: string,
    options?: Parameters<typeof toXML>[1]
  ): Response => {
    const xml = toXML(data, options);
    return new Response(xml, {
      headers: getDownloadHeaders(filename, ContentType.XML),
    });
  },
};
