/**
 * ShoppingListItem Component
 * Displays a single shopping list item with checkbox and actions
 */

import { ShoppingItem } from '@/types/pantry';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Checkbox, Chip, IconButton, Text, useTheme } from 'react-native-paper';

interface ShoppingListItemProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const SOURCE_LABELS: Record<ShoppingItem['source'], string> = {
  manual: 'Added manually',
  'low-stock': 'Low stock',
  expired: 'Replace expired',
};

const SOURCE_ICONS: Record<ShoppingItem['source'], string> = {
  manual: 'plus',
  'low-stock': 'package-variant',
  expired: 'alert-circle',
};

export function ShoppingListItem({
  item,
  onToggle,
  onDelete,
}: ShoppingListItemProps) {
  const theme = useTheme();

  const getSourceColor = (source: ShoppingItem['source']) => {
    switch (source) {
      case 'expired':
        return theme.colors.error;
      case 'low-stock':
        return '#F59E0B'; // Amber
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Card
      style={[
        styles.card,
        item.checked && styles.cardChecked,
      ]}
      mode="outlined"
    >
      <View style={styles.container}>
        <Checkbox.Android
          status={item.checked ? 'checked' : 'unchecked'}
          onPress={() => onToggle(item.id)}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              variant="titleMedium"
              style={[styles.name, item.checked && styles.nameChecked]}
            >
              {item.name}
            </Text>
            <Chip
              mode="flat"
              compact
              style={[
                styles.sourceChip,
                { backgroundColor: getSourceColor(item.source) + '20' },
              ]}
              textStyle={{ color: getSourceColor(item.source), fontSize: 10 }}
              icon={SOURCE_ICONS[item.source]}
            >
              {SOURCE_LABELS[item.source]}
            </Chip>
          </View>

          <View style={styles.details}>
            <Text variant="bodySmall" style={styles.category}>
              {item.category}
            </Text>
            <Text variant="bodyMedium" style={styles.quantity}>
              {item.quantity} {item.unit}
            </Text>
          </View>
        </View>

        <IconButton
          icon="delete"
          size={20}
          onPress={() => onDelete(item.id)}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  cardChecked: {
    opacity: 0.7,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  content: {
    flex: 1,
    marginLeft: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '600',
    flex: 1,
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  sourceChip: {
    height: 24,
    marginLeft: 8,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  category: {
    opacity: 0.7,
    marginRight: 12,
  },
  quantity: {
    fontWeight: '500',
  },
});
