"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operations, setOperations] = useState(new Set());
  const cartRef = useRef(cart);

  // Keep cart ref updated
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // Fetch cart from Supabase
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCart(data || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err.message);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Remove item with optimistic update
  const removeItem = useCallback(
    async (itemId) => {
      const operationKey = `remove-${itemId}`;
      if (operations.has(operationKey)) return;

      setOperations((prev) => new Set(prev).add(operationKey));

      try {
        // Optimistic update
        setCart((prev) => prev.filter((item) => item.id !== itemId));

        const { error } = await supabase.from("cart").delete().eq("id", itemId);

        if (error) throw error;
      } catch (err) {
        console.error("Failed to remove item:", err.message);
        fetchCart(); // Revert on error
      } finally {
        setOperations((prev) => {
          const newOps = new Set(prev);
          newOps.delete(operationKey);
          return newOps;
        });
      }
    },
    [operations, fetchCart]
  );

  // Update quantity with optimistic updates
  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      if (quantity < 1) {
        await removeItem(itemId);
        return;
      }

      const operationKey = `update-${itemId}`;
      if (operations.has(operationKey)) return;

      setOperations((prev) => new Set(prev).add(operationKey));

      try {
        // Optimistic update
        setCart((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );

        const { error } = await supabase
          .from("cart")
          .update({ quantity })
          .eq("id", itemId);

        if (error) throw error;
      } catch (err) {
        console.error("Failed to update quantity:", err.message);
        fetchCart();
      } finally {
        setOperations((prev) => {
          const newOps = new Set(prev);
          newOps.delete(operationKey);
          return newOps;
        });
      }
    },
    [operations, removeItem, fetchCart]
  );

  // Add product to cart - OPTIMIZED VERSION
  const addToCart = useCallback(
    async (productId) => {
      if (!user) {
        console.warn("User must be logged in to add to cart");
        return { success: false, message: "Please login first" };
      }

      const operationKey = `add-${productId}`;
      if (operations.has(operationKey)) {
        return { success: false, message: "Operation in progress" };
      }

      setOperations((prev) => new Set(prev).add(operationKey));

      try {
        // Check if product already exists
        const existingItem = cartRef.current.find(
          (item) => item.product_id === productId
        );

        if (existingItem) {
          // Increase quantity instead of blocking
          await updateQuantity(existingItem.id, existingItem.quantity + 1);
          return {
            success: true,
            message: "Quantity increased",
            action: "increased",
          };
        }

        // Insert new item
        const { data, error } = await supabase
          .from("cart")
          .insert([
            {
              user_id: user.id,
              product_id: productId,
              quantity: 1,
            },
          ])
          .select()
          .single();

        if (error) {
          if (error.code === "23505") {
            // If duplicate found in DB, refetch and try to update
            await fetchCart();
            const refreshedItem = cartRef.current.find(
              (item) => item.product_id === productId
            );
            if (refreshedItem) {
              await updateQuantity(
                refreshedItem.id,
                refreshedItem.quantity + 1
              );
              return {
                success: true,
                message: "Quantity increased",
                action: "increased",
              };
            }
            return {
              success: false,
              message: "Product already in cart",
            };
          }
          throw error;
        }

        if (data) {
          setCart((prev) => [data, ...prev]);
          return {
            success: true,
            message: "Added to cart",
            action: "added",
          };
        }

        return { success: false, message: "Failed to add to cart" };
      } catch (err) {
        console.error("Failed to add to cart:", err.message);
        return {
          success: false,
          message: "Failed to add item to cart",
        };
      } finally {
        setOperations((prev) => {
          const newOps = new Set(prev);
          newOps.delete(operationKey);
          return newOps;
        });
      }
    },
    [user, operations, updateQuantity, fetchCart]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
    }
  }, [user]);

  // Memoized cart calculations
  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getItemQuantity = useCallback(
    (productId) => {
      const item = cart.find((item) => item.product_id === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const isInCart = useCallback(
    (productId) => {
      return cart.some((item) => item.product_id === productId);
    },
    [cart]
  );

  const getCartTotal = useCallback(() => {
    return cart.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const isOperating = useCallback(
    (operationType, id) => {
      return operations.has(`${operationType}-${id}`);
    },
    [operations]
  );

  // Fetch cart whenever user changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getItemQuantity,
    getCartTotal,
    isInCart,
    isOperating,
    refetchCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
