/**
 * Zustand store for Pantry Tracker with AsyncStorage persistence
 */

import {
  Category,
  generateId,
  PantryItem,
  PantryItemFormData,
  ShoppingItem,
} from '@/types/pantry';
import { getExpirationStatus, isLowStock } from '@/utils/expiration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Store state interface
interface PantryStore {
  // State
  items: PantryItem[];
  shoppingList: ShoppingItem[];

  // Pantry Item Actions
  addItem: (data: PantryItemFormData) => void;
  updateItem: (id: string, data: Partial<PantryItemFormData>) => void;
  removeItem: (id: string) => void;
  getItemById: (id: string) => PantryItem | undefined;

  // Shopping List Actions
  addToShoppingList: (
    name: string,
    category: Category,
    quantity: number,
    unit: ShoppingItem['unit'],
    source: ShoppingItem['source']
  ) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  clearCheckedItems: () => void;
  clearShoppingList: () => void;

  // Auto-populate Actions
  autoAddLowStockToShoppingList: () => number; // Returns count of items added
  autoAddExpiredToShoppingList: () => number; // Returns count of items added

  // Utility
  getItemsByCategory: (category: Category) => PantryItem[];
  getSortedByExpiration: () => PantryItem[];
}

export const usePantryStore = create<PantryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      shoppingList: [],

      // Add a new pantry item
      addItem: (data) => {
        const now = new Date().toISOString();
        const newItem: PantryItem = {
          id: generateId(),
          ...data,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      // Update an existing pantry item
      updateItem: (id, data) => {
        const now = new Date().toISOString();
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...data, updatedAt: now }
              : item
          ),
        }));
      },

      // Remove a pantry item
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // Get a single item by ID
      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },

      // Add item to shopping list
      addToShoppingList: (name, category, quantity, unit, source) => {
        // Check if item already exists in shopping list
        const existing = get().shoppingList.find(
          (item) => item.name.toLowerCase() === name.toLowerCase()
        );

        if (existing) {
          // Update quantity if exists
          set((state) => ({
            shoppingList: state.shoppingList.map((item) =>
              item.id === existing.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          // Add new item
          const newItem: ShoppingItem = {
            id: generateId(),
            name,
            category,
            quantity,
            unit,
            checked: false,
            source,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            shoppingList: [...state.shoppingList, newItem],
          }));
        }
      },

      // Toggle shopping item checked status
      toggleShoppingItem: (id) => {
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }));
      },

      // Remove item from shopping list
      removeShoppingItem: (id) => {
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        }));
      },

      // Clear all checked items from shopping list
      clearCheckedItems: () => {
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => !item.checked),
        }));
      },

      // Clear entire shopping list
      clearShoppingList: () => {
        set({ shoppingList: [] });
      },

      // Auto-add low stock items to shopping list
      autoAddLowStockToShoppingList: () => {
        const { items, addToShoppingList } = get();
        const lowStockItems = items.filter(
          (item) => isLowStock(item.quantity) && getExpirationStatus(item.expirationDate) !== 'expired'
        );

        lowStockItems.forEach((item) => {
          addToShoppingList(
            item.name,
            item.category,
            2, // Default quantity to add
            item.unit,
            'low-stock'
          );
        });

        return lowStockItems.length;
      },

      // Auto-add expired items to shopping list (for replacement)
      autoAddExpiredToShoppingList: () => {
        const { items, addToShoppingList } = get();
        const expiredItems = items.filter(
          (item) => getExpirationStatus(item.expirationDate) === 'expired'
        );

        expiredItems.forEach((item) => {
          addToShoppingList(
            item.name,
            item.category,
            1, // Default quantity to replace
            item.unit,
            'expired'
          );
        });

        return expiredItems.length;
      },

      // Get items filtered by category
      getItemsByCategory: (category) => {
        return get().items.filter((item) => item.category === category);
      },

      // Get items sorted by expiration date (earliest first)
      getSortedByExpiration: () => {
        return [...get().items].sort((a, b) => {
          const dateA = new Date(a.expirationDate).getTime();
          const dateB = new Date(b.expirationDate).getTime();
          return dateA - dateB;
        });
      },
    }),
    {
      name: 'pantry-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        shoppingList: state.shoppingList,
      }),
    }
  )
);

// Selector hooks for optimized re-renders
export const usePantryItems = () => usePantryStore((state) => state.items);
export const useShoppingList = () => usePantryStore((state) => state.shoppingList);
export const usePantryActions = () =>
  usePantryStore((state) => ({
    addItem: state.addItem,
    updateItem: state.updateItem,
    removeItem: state.removeItem,
    getItemById: state.getItemById,
  }));
export const useShoppingActions = () =>
  usePantryStore((state) => ({
    addToShoppingList: state.addToShoppingList,
    toggleShoppingItem: state.toggleShoppingItem,
    removeShoppingItem: state.removeShoppingItem,
    clearCheckedItems: state.clearCheckedItems,
    clearShoppingList: state.clearShoppingList,
  }));
