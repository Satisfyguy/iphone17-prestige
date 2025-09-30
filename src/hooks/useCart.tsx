import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  color: string;
  storage: string;
  price: number;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string, color?: string, storage?: string) => void;
  changeQty: (id: string, color: string, storage: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cart:v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextType["addItem"] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.id === item.id && i.color === item.color && i.storage === item.storage
      );
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem: CartContextType["removeItem"] = (id, color, storage) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.color === color && i.storage === storage)));
  };

  const changeQty: CartContextType["changeQty"] = (id, color, storage, qty) => {
    setItems(prev => prev.map(i => (i.id === id && i.color === color && i.storage === storage ? { ...i, qty } : i)));
  };

  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value: CartContextType = { items, total, count, addItem, removeItem, changeQty, clear };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
