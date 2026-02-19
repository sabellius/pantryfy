/**
 * Utility functions for handling expiration dates and status
 */

import { ExpirationStatus } from '@/types/pantry';

/**
 * Calculate the number of days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / oneDay);
}

/**
 * Get the expiration status of an item based on its expiration date
 * @param expirationDate - ISO date string (YYYY-MM-DD)
 * @returns 'expired' if past expiration, 'expiring' if within 3 days, 'fresh' otherwise
 */
export function getExpirationStatus(expirationDate: string): ExpirationStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);

  const daysUntilExpiration = daysBetween(today, expDate);

  if (daysUntilExpiration < 0) {
    return 'expired';
  }
  if (daysUntilExpiration <= 3) {
    return 'expiring';
  }
  return 'fresh';
}

/**
 * Get a human-readable description of the expiration status
 */
export function getExpirationDescription(expirationDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);

  const daysUntil = daysBetween(today, expDate);

  if (daysUntil < 0) {
    const daysPast = Math.abs(daysUntil);
    return daysPast === 1 ? 'Expired 1 day ago' : `Expired ${daysPast} days ago`;
  }
  if (daysUntil === 0) {
    return 'Expires today';
  }
  if (daysUntil === 1) {
    return 'Expires tomorrow';
  }
  if (daysUntil <= 3) {
    return `Expires in ${daysUntil} days`;
  }
  return `Expires ${formatDate(expirationDate)}`;
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Get the color for an expiration status
 */
export function getExpirationColor(status: ExpirationStatus): string {
  switch (status) {
    case 'expired':
      return '#EF4444'; // Red
    case 'expiring':
      return '#F59E0B'; // Amber/Yellow
    case 'fresh':
      return '#22C55E'; // Green
    default:
      return '#6B7280'; // Gray
  }
}

/**
 * Get the background color for an expiration status (lighter version)
 */
export function getExpirationBackgroundColor(status: ExpirationStatus): string {
  switch (status) {
    case 'expired':
      return '#FEE2E2'; // Light red
    case 'expiring':
      return '#FEF3C7'; // Light amber
    case 'fresh':
      return '#DCFCE7'; // Light green
    default:
      return '#F3F4F6'; // Light gray
  }
}

/**
 * Sort items by expiration date (earliest first)
 */
export function sortByExpirationDate<T extends { expirationDate: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.expirationDate).getTime();
    const dateB = new Date(b.expirationDate).getTime();
    return dateA - dateB;
  });
}

/**
 * Check if an item is considered low stock
 */
export function isLowStock(quantity: number, threshold = 2): boolean {
  return quantity < threshold;
}

/**
 * Get items that are expired
 */
export function getExpiredItems<T extends { expirationDate: string }>(
  items: T[]
): T[] {
  return items.filter((item) => getExpirationStatus(item.expirationDate) === 'expired');
}

/**
 * Get items that are expiring soon (within 3 days but not expired)
 */
export function getExpiringItems<T extends { expirationDate: string }>(
  items: T[]
): T[] {
  return items.filter((item) => getExpirationStatus(item.expirationDate) === 'expiring');
}
