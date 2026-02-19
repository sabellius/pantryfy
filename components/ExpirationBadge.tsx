/**
 * ExpirationBadge Component
 * Displays a colored badge indicating expiration status
 */

import { ExpirationStatus } from '@/types/pantry';
import {
  getExpirationBackgroundColor,
  getExpirationColor,
} from '@/utils/expiration';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

interface ExpirationBadgeProps {
  status: ExpirationStatus;
  label?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export function ExpirationBadge({
  status,
  label,
  size = 'medium',
  style,
}: ExpirationBadgeProps) {
  const backgroundColor = getExpirationBackgroundColor(status);
  const textColor = getExpirationColor(status);

  const defaultLabel = status === 'expired'
    ? 'Expired'
    : status === 'expiring'
    ? 'Expiring Soon'
    : 'Fresh';

  return (
    <View
      style={[
        styles.badge,
        size === 'small' && styles.badgeSmall,
        { backgroundColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'small' && styles.textSmall,
          { color: textColor },
        ]}
      >
        {label || defaultLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 10,
    fontWeight: '500',
  },
});
