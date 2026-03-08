// Utility functions for endpoints

export function getEndpointUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/w/${slug}`;
}
