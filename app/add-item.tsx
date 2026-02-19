/**
 * Add/Edit Item Modal Screen
 * Form for adding new pantry items or editing existing ones
 */

import { usePantryStore } from '@/store/usePantryStore';
import {
  CATEGORIES,
  DEFAULT_PANTRY_ITEM_FORM,
  PantryItemFormData,
  UNITS,
} from '@/types/pantry';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

export default function AddItemScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string }>();

  const { addItem, updateItem, getItemById } = usePantryStore();

  const [formData, setFormData] = useState<PantryItemFormData>(DEFAULT_PANTRY_ITEM_FORM);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showUnitDialog, setShowUnitDialog] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PantryItemFormData, string>>>({});

  const isEditMode = !!params.editId;
  const editItem = params.editId ? getItemById(params.editId) : undefined;

  // Populate form if editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        category: editItem.category,
        quantity: editItem.quantity,
        unit: editItem.unit,
        expirationDate: editItem.expirationDate,
      });
    }
  }, [editItem]);

  const updateField = <K extends keyof PantryItemFormData>(
    field: K,
    value: PantryItemFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PantryItemFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required';
    } else {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.expirationDate)) {
        newErrors.expirationDate = 'Use YYYY-MM-DD format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isEditMode && params.editId) {
      updateItem(params.editId, formData);
    } else {
      addItem(formData);
    }

    router.back();
  };

  const handleDelete = () => {
    if (!params.editId) return;

    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            usePantryStore.getState().removeItem(params.editId!);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            {isEditMode ? 'Edit Item' : 'Add New Item'}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {isEditMode
              ? 'Update the details of your pantry item'
              : 'Enter the details of your new pantry item'}
          </Text>
        </View>

        {/* Name Input */}
        <TextInput
          label="Item Name"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          mode="outlined"
          style={styles.input}
          error={!!errors.name}
          placeholder="e.g., Milk, Bread, Eggs"
        />
        {errors.name && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.name}
          </Text>
        )}

        {/* Category Selector */}
        <Text variant="labelLarge" style={styles.label}>
          Category
        </Text>
        <Button
          mode="outlined"
          onPress={() => setShowCategoryDialog(true)}
          style={styles.selectorButton}
          icon="chevron-down"
          contentStyle={styles.selectorContent}
        >
          {formData.category}
        </Button>

        {/* Quantity and Unit Row */}
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TextInput
              label="Quantity"
              value={formData.quantity.toString()}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0;
                updateField('quantity', num);
              }}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.quantity}
            />
            {errors.quantity && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.quantity}
              </Text>
            )}
          </View>

          <View style={styles.halfWidth}>
            <Text variant="labelLarge" style={styles.label}>
              Unit
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowUnitDialog(true)}
              style={styles.selectorButton}
              icon="chevron-down"
              contentStyle={styles.selectorContent}
            >
              {formData.unit}
            </Button>
          </View>
        </View>

        {/* Expiration Date Input */}
        <TextInput
          label="Expiration Date (YYYY-MM-DD)"
          value={formData.expirationDate}
          onChangeText={(text) => updateField('expirationDate', text)}
          mode="outlined"
          style={styles.input}
          placeholder="2024-12-31"
          error={!!errors.expirationDate}
        />
        {errors.expirationDate && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.expirationDate}
          </Text>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            {isEditMode ? 'Update Item' : 'Add Item'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>

          {isEditMode && (
            <Button
              mode="text"
              onPress={handleDelete}
              textColor={theme.colors.error}
              style={styles.deleteButton}
            >
              Delete Item
            </Button>
          )}
        </View>
      </ScrollView>

      {/* Category Selection Dialog */}
      <Portal>
        <Dialog
          visible={showCategoryDialog}
          onDismiss={() => setShowCategoryDialog(false)}
        >
          <Dialog.Title>Select Category</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView style={styles.dialogScroll}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => {
                    updateField('category', category);
                    setShowCategoryDialog(false);
                  }}
                  style={styles.dialogItem}
                >
                  <Text
                    style={
                      formData.category === category
                        ? { color: theme.colors.primary, fontWeight: '600' }
                        : undefined
                    }
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowCategoryDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Unit Selection Dialog */}
      <Portal>
        <Dialog
          visible={showUnitDialog}
          onDismiss={() => setShowUnitDialog(false)}
        >
          <Dialog.Title>Select Unit</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView style={styles.dialogScroll}>
              {UNITS.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  onPress={() => {
                    updateField('unit', unit);
                    setShowUnitDialog(false);
                  }}
                  style={styles.dialogItem}
                >
                  <Text
                    style={
                      formData.unit === unit
                        ? { color: theme.colors.primary, fontWeight: '600' }
                        : undefined
                    }
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setShowUnitDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
  },
  selectorButton: {
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  selectorContent: {
    flexDirection: 'row-reverse',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    paddingVertical: 6,
  },
  cancelButton: {
    paddingVertical: 6,
  },
  deleteButton: {
    paddingVertical: 6,
  },
  dialogScroll: {
    maxHeight: 300,
  },
  dialogItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
