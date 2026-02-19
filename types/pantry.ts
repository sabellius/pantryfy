/**
 * TypeScript type definitions for the Pantry Tracker application
 */

// Predefined categories for pantry items
export const CATEGORIES = [
  'Dairy',
  'Produce',
  'Meat & Seafood',
  'Bakery',
  'Grains & Pasta',
  'Canned Goods',
  'Frozen Foods',
  'Beverages',
  'Condiments & Sauces',
  'Snacks',
  'Spices & Herbs',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

// Common units for measuring quantities
export const UNITS = [
  'pieces',
  'cups',
  'lbs',
  'oz',
  'kg',
  'g',
  'ml',
  'liters',
  'gallons',
  'quarts',
  'pints',
  'tablespoons',
  'teaspoons',
  'packages',
  'bottles',
  'cans',
  'boxes',
  'bags',
] as const;

export type Unit = (typeof UNITS)[number];

// Expiration status for visual indicators
export type ExpirationStatus = 'expired' | 'expiring' | 'fresh';

// Core pantry item interface
export interface PantryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  expirationDate: string; // ISO date format (YYYY-MM-DD)
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
}

// Shopping list item interface
export interface ShoppingItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  checked: boolean;
  source: 'manual' | 'low-stock' | 'expired';
  createdAt: string;
}

// Form data for adding/editing items
export interface PantryItemFormData {
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  expirationDate: string;
}

// Helper function to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Helper function to get today's date in ISO format
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// Default values for new items
export const DEFAULT_PANTRY_ITEM_FORM: PantryItemFormData = {
  name: '',
  category: 'Other',
  quantity: 1,
  unit: 'pieces',
  expirationDate: getTodayISO(),
};
