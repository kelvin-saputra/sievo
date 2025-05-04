'use client';

export function calculateAvailableQuantity(item: {
    item_qty: number;
    item_qty_reserved?: number;
    item_qty_damaged?: number;
  }) {
    return (item.item_qty ?? 0) - (item.item_qty_reserved ?? 0) - (item.item_qty_damaged ?? 0);
  }
  