# Pantryfy - AI Agent Configuration

> This document defines the AI agent configuration, coding standards, and development workflow for the Pantryfy React Native/Expo application.

## Project Overview

**Pantryfy** is a mobile application for tracking pantry inventory and managing shopping lists. Built with Expo (React Native), TypeScript, and Zustand for state management.

### Core Features

- **Pantry Inventory Management**: Add, edit, delete, and view pantry items
- **Expiration Tracking**: Visual indicators (red/yellow/green) for item freshness
- **Shopping List Integration**: Manual and auto-populated shopping lists
- **Persistent Storage**: AsyncStorage with Zustand persistence middleware

---

## Tech Stack

| Layer            | Technology         | Version  |
| ---------------- | ------------------ | -------- |
| Framework        | Expo               | ~54.0.33 |
| Language         | TypeScript         | ~5.9.2   |
| UI Library       | React Native Paper | ^5.15.0  |
| State Management | Zustand            | ^5.0.11  |
| Storage          | AsyncStorage       | 2.2.0    |
| Navigation       | Expo Router        | ~6.0.23  |
| React            | React 19           | 19.1.0   |

---

## Project Structure

```
pantryfy/
├── app/                      # Expo Router file-based navigation
│   ├── _layout.tsx          # Root layout with PaperProvider
│   ├── add-item.tsx         # Modal: Add/Edit pantry items
│   ├── modal.tsx            # Generic modal (template)
│   └── (tabs)/              # Tab-based navigation group
│       ├── _layout.tsx      # Tab navigator configuration
│       ├── index.tsx        # Tab: Pantry Inventory
│       ├── shopping.tsx     # Tab: Shopping List
│       └── explore.tsx      # Tab: Explore (template)
│
├── components/              # Reusable UI components
│   ├── ExpirationBadge.tsx  # Color-coded expiration status
│   ├── PantryCard.tsx       # Individual pantry item card
│   ├── PantryList.tsx       # Scrollable list with empty state
│   ├── ShoppingListItem.tsx # Shopping list item with checkbox
│   └── ui/                  # Platform-specific UI components
│
├── store/                   # State management
│   └── usePantryStore.ts    # Zustand store with persistence
│
├── types/                   # TypeScript type definitions
│   └── pantry.ts            # PantryItem, ShoppingItem, Category
│
├── utils/                   # Utility functions
│   └── expiration.ts        # Expiration status calculations
│
├── constants/               # App constants
│   └── theme.ts             # Color schemes and fonts
│
├── hooks/                   # Custom React hooks
│
├── assets/                  # Static assets (images, fonts)
│
└── plans/                   # Architecture documentation
    ├── pantry-tracker-implementation.md
    └── architectural-decisions.md
```

---

## Coding Standards

### TypeScript Conventions

```typescript
// Prefer interfaces for object shapes
interface PantryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  expirationDate: string;
  createdAt: string;
  updatedAt?: string;
}

// Use const assertions for literal arrays
export const CATEGORIES = ['Dairy', 'Produce', 'Meat & Seafood'] as const;
export type Category = (typeof CATEGORIES)[number];

// Prefer typed function components
export function PantryCard({ item, onEdit, onDelete }: PantryCardProps) {
  // ...
}

// Use Zustand selectors for optimized re-renders
export const usePantryItems = () => usePantryStore(state => state.items);
```

### Naming Conventions

| Type       | Convention                  | Example                          |
| ---------- | --------------------------- | -------------------------------- |
| Components | PascalCase                  | `PantryCard.tsx`                 |
| Hooks      | camelCase with `use` prefix | `usePantryStore.ts`              |
| Utils      | camelCase                   | `expiration.ts`                  |
| Types      | PascalCase                  | `PantryItem`, `ShoppingItem`     |
| Constants  | SCREAMING_SNAKE_CASE        | `CATEGORIES`, `UNITS`            |
| Files      | kebab-case or PascalCase    | `add-item.tsx`, `PantryCard.tsx` |

### Import Organization

```typescript
// 1. React and React Native
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

// 2. Third-party libraries
import { Text, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

// 3. Internal imports (use @ alias)
import { usePantryStore } from '@/store/usePantryStore';
import { PantryItem } from '@/types/pantry';
import { getExpirationStatus } from '@/utils/expiration';
```

### Component Structure

```typescript
/**
 * ComponentName - Brief description
 *
 * @description Detailed description if needed
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

// Types
interface ComponentNameProps {
  item: PantryItem;
  onAction: (id: string) => void;
}

// Component
export function ComponentName({ item, onAction }: ComponentNameProps) {
  const theme = useTheme();
  const [state, setState] = useState(initialState);

  const handleAction = useCallback(() => {
    onAction(item.id);
  }, [item.id, onAction]);

  return (
    <View style={styles.container}>
      {/* JSX */}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## Architectural Decisions

### State Management: Zustand

**Why Zustand over Context API:**

- Automatic TypeScript type inference
- Built-in persistence middleware
- Selector-based re-renders (performance)
- Minimal boilerplate

```typescript
// Store pattern with persistence
export const usePantryStore = create<PantryStore>()(
  persist(
    (set, get) => ({
      items: [],
      shoppingList: [],

      addItem: data =>
        set(state => ({
          items: [...state.items, { ...data, id: generateId() }],
        })),
    }),
    {
      name: 'pantry-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

### UI Library: React Native Paper

**Why Paper over alternatives:**

- Material Design 3 consistency
- Excellent TypeScript support
- First-class Expo integration
- 50+ production-ready components

### Data Persistence: AsyncStorage

**Why AsyncStorage over SQLite/Realm:**

- Simple key-value storage
- Adequate for 50-200 items
- No migration management
- Direct Zustand integration

---

## Development Workflow

### Commands

```bash
# Start development server
npm start

# Start with tunnel (for physical devices)
npm start -- --tunnel

# Run on specific platform
npm run ios
npm run android
npm run web

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Clear caches
rm -rf node_modules/.cache .expo
npx expo start --clear
```

### Git Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add barcode scanning feature
fix: resolve expiration date sorting issue
docs: update API documentation
style: format code with prettier
refactor: extract expiration logic to utils
test: add unit tests for pantry store
chore: update dependencies
```

### Branch Naming

```
feature/barcode-scanning
bugfix/expiration-sorting
hotfix/crash-on-delete
release/v1.2.0
```

---

## Agent Behaviors & Rules

### Code Generation Rules

1. **Always use TypeScript** - No `any` types without justification
2. **Prefer functional components** - Use hooks, not class components
3. **Use path aliases** - Import with `@/` not relative paths beyond one level
4. **Handle empty states** - Every list should have an empty state component
5. **Validate user input** - Forms must have validation with error messages
6. **Persist data** - User data should survive app restarts

### Component Guidelines

1. **Single Responsibility** - Each component does one thing
2. **Props Interface** - Always define typed props interface
3. **Memoization** - Use `useCallback` for handlers passed as props
4. **Accessibility** - Include accessibility labels for interactive elements
5. **Dark Mode** - Support both light and dark themes via `useTheme()`

### State Management Rules

1. **Single Source of Truth** - All pantry data in Zustand store
2. **Selector Pattern** - Export typed selectors for components
3. **Immutable Updates** - Never mutate state directly
4. **Persistence** - Use Zustand's persist middleware for AsyncStorage

### Error Handling

```typescript
// Always handle async errors
const handleAsyncAction = async () => {
  try {
    await someAsyncOperation();
  } catch (error) {
    console.error('Operation failed:', error);
    Alert.alert('Error', 'Failed to complete operation');
  }
};
```

---

## Future Features (Roadmap)

### Phase 2: Enhanced Features

1. **Barcode Scanning**
   - Install: `expo-camera`
   - API: Open Food Facts (free)
   - Auto-populate item details from scan

2. **Recipe Suggestions**
   - API: Spoonacular (free tier)
   - Match recipes to current inventory
   - Display missing ingredients

3. **Push Notifications**
   - Install: `expo-notifications`, `expo-task-manager`
   - Daily reminders for expiring items
   - Custom notification times

### Phase 3: Advanced Features

- Multi-household support
- Shared shopping lists
- Price tracking
- Import/export data
- Widget support

---

## Troubleshooting

### Common Issues

**Expo Go Download Error:**

```bash
# Use tunnel mode for physical devices
npx expo start --tunnel
```

**TypeScript Errors:**

```bash
# Regenerate type definitions
npx expo customize tsconfig.json
```

**Cache Issues:**

```bash
# Clear all caches
rm -rf node_modules/.cache .expo
npx expo start --clear
```

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Changelog

| Version | Date       | Changes                                                |
| ------- | ---------- | ------------------------------------------------------ |
| 1.0.0   | 2026-02-19 | Initial release with pantry tracking and shopping list |

---

_Last updated: 2026-02-20_
_Generated by Kilo Code AI Agent_
