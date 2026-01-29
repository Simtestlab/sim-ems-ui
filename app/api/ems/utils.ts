/**
 * Utility functions for EMS API routes
 */

import { cookies } from 'next/headers';

/**
 * Get authorization headers from cookies
 * Reads the access_token cookie and creates Authorization header
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  return headers;
}
