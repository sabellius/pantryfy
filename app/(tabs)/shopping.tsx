/**
 * Shopping List Screen
 * Displays shopping list with auto-populate from low stock and expired items
 */

import { ShoppingListItem } from '@/components/ShoppingListItem';
import { usePantryStore } from '@/store/usePantryStore';
import { ShoppingItem } from '@/types/pantry';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  FAB,
  Menu,
  Text,
  useTheme
} from 'react-native-paper';

export default function ShoppingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const shoppingList = usePantryStore((state) => state.shoppingList);
  const toggleShoppingItem = usePantryStore((state) => state.toggleShoppingItem);
  const removeShoppingItem = usePantryStore((state) => state.removeShoppingItem);
  const clearCheckedItems = usePantryStore((state) => state.clearCheckedItems);
  const clearShoppingList = usePantryStore((state) => state.clearShoppingList);
  const addToShoppingList = usePantryStore((state) => state.addToShoppingList);
  const autoAddLowStockToShoppingList = usePantryStore((state) => state.autoAddLowStockToShoppingList);
  const autoAddExpiredToShoppingList = usePantryStore((state) => state.autoAddExpiredToShoppingList);

  const checkedCount = shoppingList.filter((item) => item.checked).length;

  const handleToggle = useCallback(
    (id: string) => {
      toggleShoppingItem(id);
    },
    [toggleShoppingItem]
  );

  const handleDelete = useCallback(
    (id: string) => {
      removeShoppingItem(id);
    },
    [removeShoppingItem]
  );

  const handleAutoAddLowStock = () => {
    const count = autoAddLowStockToShoppingList();
    setMenuVisible(false);
    if (count > 0) {
      Alert.alert('Items Added', `Added ${count} low stock item(s) to your shopping list.`);
    } else {
      Alert.alert('No Items', 'No low stock items found.');
    }
  };

  const handleAutoAddExpired = () => {
    const count = autoAddExpiredToShoppingList();
    setMenuVisible(false);
    if (count > 0) {
      Alert.alert('Items Added', `Added ${count} expired item(s) to your shopping list for replacement.`);
    } else {
      Alert.alert('No Items', 'No expired items found.');
    }
  };

  const handleClearChecked = () => {
    Alert.alert(
      'Clear Checked Items',
      'Remove all checked items from your shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => clearCheckedItems(),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Shopping List',
      'Remove all items from your shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearShoppingList(),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <ShoppingListItem
      item={item}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Shopping List is Empty
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
      >
        Add items manually or auto-populate from your pantry
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Action Buttons */}
      {shoppingList.length > 0 && (
        <View style={styles.actionsContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                icon="plus"
                style={styles.actionButton}
              >
                Auto-Add
              </Button>
            }
          >
            <Menu.Item
              onPress={handleAutoAddLowStock}
              title="Add Low Stock Items"
              leadingIcon="package-variant"
            />
            <Menu.Item
              onPress={handleAutoAddExpired}
              title="Add Expired Items"
              leadingIcon="alert-circle"
            />
          </Menu>

          {checkedCount > 0 && (
            <Button
              mode="text"
              onPress={handleClearChecked}
              style={styles.actionButton}
            >
              Clear Checked ({checkedCount})
            </Button>
          )}
        </View>
      )}

      {/* Shopping List */}
      <FlatList
        data={shoppingList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          shoppingList.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
      />

      {/* Empty State FAB */}
      {shoppingList.length === 0 && (
        <FAB
          icon="cart-plus"
          label="Auto-Add Items"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setMenuVisible(true)}
          color="white"
        />
      )}

      {/* Clear All FAB (when list has items) */}
      {shoppingList.length > 0 && (
        <FAB
          icon="delete-sweep"
          style={[styles.fab, { backgroundColor: theme.colors.error }]}
          onPress={handleClearAll}
          color="white"
        />
      )}

      {/* Menu for empty state */}
      <Menu
        visible={menuVisible && shoppingList.length === 0}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
        <Menu.Item
          onPress={handleAutoAddLowStock}
          title="Add Low Stock Items"
          leadingIcon="package-variant"
        />
        <Menu.Item
          onPress={handleAutoAddExpired}
          title="Add Expired Items"
          leadingIcon="alert-circle"
        />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    flexShrink: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
