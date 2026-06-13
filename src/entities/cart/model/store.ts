import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Теперь элемент корзины хранит только ID и количество
interface CartItem {
  documentId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (documentId: string) => void; // Принимаем только ID!
  removeItem: (documentId: string) => void;
  clearCart: () => void;
  increaseQuantity: (documentId: string) => void;
  decreaseQuantity: (documentId: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (documentId) => {
        if (!documentId) return;
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.documentId === documentId);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.documentId === documentId 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { documentId, quantity: 1 }] });
        }
      },

      removeItem: (documentId: string) => set((state) => {
        return {
          items: state.items.filter(item => item.documentId !== documentId)
        };
      }),
      
      clearCart: () => set({ items: [] }),

      increaseQuantity: (documentId: string) => set((state) => ({
        items: state.items.map(item => 
          item.documentId === documentId ? { ...item, quantity: item.quantity + 1 } : item
        )
      })),

      decreaseQuantity: (documentId: string) => set((state) => ({
        items: state.items.map(item => 
          item.documentId === documentId && item.quantity > 1 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
      })),
    }),
    {
      name: 'green-heritage-cart', 
    }
  )
);