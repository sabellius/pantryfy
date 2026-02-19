/**
 * PantryList Component
 * Displays a scrollable list of pantry items sorted by expiration
 */

import { PantryItem } from '@/types/pantry';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { PantryCard } from './PantryCard';

interface PantryListProps {
  items: PantryItem[];
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
}

export function PantryList({ items, onEdit, onDelete }: PantryListProps) {
  const renderItem = ({ item }: { item: PantryItem }) => (
    <PantryCard item={item} onEdit={onEdit} onDelete={onDelete} />
  );

  const keyExtractor = (item: PantryItem) => item.id;

  const getItemLayout = (_: any, index: number) => ({
    length: 120, // Approximate height of each card
    offset: 120 * index,
    index,
  });

  const renderEmptyComponent = () => <EmptyPantryState />;

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      contentContainerStyle={[
        styles.listContent,
        items.length === 0 && styles.emptyListContent,
      ]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
}

// Empty state component
export function EmptyPantryState() {
  const theme = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Your Pantry is Empty
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
      >
        Tap the + button to add your first item
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100, // Space for FAB
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
