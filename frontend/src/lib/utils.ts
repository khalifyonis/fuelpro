import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format as formatDateFn, parseISO } from 'date-fns';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge
 * to intelligently resolve conflicting utility classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency.
 *
 * @param amount - The numeric amount to format.
 * @param currency - ISO 4217 currency code (default: 'KES').
 * @param locale - BCP 47 locale string (default: 'en-KE').
 * @returns Formatted currency string, e.g. "KES 1,234.56"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'KES',
  locale: string = 'en-KE'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with comma separators.
 *
 * @param num - The number to format.
 * @param locale - BCP 47 locale string (default: 'en-US').
 * @returns Formatted number string, e.g. "1,234,567"
 */
export function formatNumber(
  num: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format a date using date-fns.
 *
 * @param date - Date object, ISO string, or timestamp.
 * @param formatStr - date-fns format string (default: 'PPP' → "April 29, 2024").
 * @returns Formatted date string.
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = 'PPP'
): string {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return formatDateFn(d, formatStr);
}

/**
 * Format a fuel quantity in litres.
 *
 * @param quantity - The numeric quantity in litres.
 * @param decimals - Number of decimal places (default: 2).
 * @returns Formatted string, e.g. "1,234.56 L"
 */
export function formatLitres(
  quantity: number,
  decimals: number = 2
): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(quantity)} L`;
}

/**
 * Extract initials from a full name.
 *
 * @param name - Full name string.
 * @returns Uppercase initials (up to 2 characters), e.g. "JD"
 */
export function getInitials(name: string): string {
  if (!name || !name.trim()) return '';

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate a v4 UUID.
 *
 * Uses the Web Crypto API when available, with a Math.random fallback.
 * @returns A UUID string, e.g. "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    }
  );
}

/**
 * Truncate a string to a maximum length with an ellipsis.
 *
 * @param str - The input string.
 * @param length - Maximum length before truncation (default: 50).
 * @returns Truncated string with '…' appended if it exceeds `length`.
 */
export function truncate(str: string, length: number = 50): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '…';
}

/**
 * Promise-based delay.
 *
 * @param ms - Milliseconds to sleep.
 * @returns A promise that resolves after `ms` milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a debounced version of a function.
 *
 * @param fn - The function to debounce.
 * @param ms - Debounce delay in milliseconds (default: 300).
 * @returns A debounced function with a `cancel()` method.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  ms: number = 300
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, ms);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced as T & { cancel: () => void };
}
