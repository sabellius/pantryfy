/**
 * Pantry Inventory Screen
 * Main screen displaying all pantry items sorted by expiration
 */

import { PantryList } from '@/components/PantryList';
import { usePantryStore } from '@/store/usePantryStore';
import { PantryItem } from '@/types/pantry';
import {
  getExpiredItems,
  getExpiringItems,
} from '@/utils/expiration';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Chip, FAB, useTheme } from 'react-native-paper';

export default function PantryScreen() {
  const theme = useTheme();
  const router = useRouter();

  const items = usePantryStore((state) => state.items);
  const removeItem = usePantryStore((state) => state.removeItem);
  const getSortedByExpiration = usePantryStore((state) => state.getSortedByExpiration);

  // Get sorted items
  const sortedItems = getSortedByExpiration();

  // Get counts for status chips
  const expiredCount = getExpiredItems(items).length;
  const expiringCount = getExpiringItems(items).length;

  const handleEdit = useCallback(
    (item: PantryItem) => {
      router.push(`/add-item?editId=${item.id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        'Delete Item',
        'Are you sure you want to delete this item?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => removeItem(id),
          },
        ]
      );
    },
    [removeItem]
  );

  const handleAddItem = () => {
    router.push('/add-item');
  };

  return (
    <View style={styles.container}>
      {/* Status Summary */}
      {items.length > 0 && (expiredCount > 0 || expiringCount > 0) && (
        <View style={styles.statusContainer}>
          {expiredCount > 0 && (
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: '#FEE2E2' }]}
              textStyle={{ color: '#EF4444' }}
              icon="alert-circle"
            >
              {expiredCount} expired
            </Chip>
          )}
          {expiringCount > 0 && (
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: '#FEF3C7' }]}
              textStyle={{ color: '#D97706' }}
              icon="clock-alert"
            >
              {expiringCount} expiring soon
            </Chip>
          )}
        </View>
      )}

      {/* Item List */}
      <PantryList
        items={sortedItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddItem}
        color="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  statusChip: {
    height: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
