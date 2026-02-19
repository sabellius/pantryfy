/**
 * PantryCard Component
 * Displays a single pantry item with expiration status and actions
 */

import { PantryItem } from '@/types/pantry';
import {
  getExpirationBackgroundColor,
  getExpirationDescription,
  getExpirationStatus,
} from '@/utils/expiration';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';
import { ExpirationBadge } from './ExpirationBadge';

interface PantryCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
}

export function PantryCard({ item, onEdit, onDelete }: PantryCardProps) {
  const theme = useTheme();
  const expirationStatus = getExpirationStatus(item.expirationDate);
  const expirationDescription = getExpirationDescription(item.expirationDate);
  const backgroundColor = getExpirationBackgroundColor(expirationStatus);

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor },
      ]}
      mode="elevated"
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.name}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.category}>
              {item.category}
            </Text>
          </View>
          <ExpirationBadge status={expirationStatus} size="small" />
        </View>

        <View style={styles.details}>
          <View style={styles.quantityContainer}>
            <Text variant="bodyMedium" style={styles.quantity}>
              {item.quantity} {item.unit}
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.expiration}>
            {expirationDescription}
          </Text>
        </View>
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => onEdit(item)}
          iconColor={theme.colors.onSurfaceVariant}
        />
        <IconButton
          icon="delete"
          size={20}
          onPress={() => onDelete(item.id)}
          iconColor={theme.colors.error}
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  content: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontWeight: '600',
  },
  category: {
    opacity: 0.7,
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontWeight: '500',
  },
  expiration: {
    opacity: 0.8,
  },
  actions: {
    paddingTop: 0,
    marginTop: -8,
  },
});
