"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // Products and Categories fetch together
        const [prodRes, catRes] = await Promise.all([
          supabase.from("products").select("*"),
          supabase.from("categories").select("*"),
        ]);

        if (prodRes.error) throw prodRes.error;
        if (catRes.error) throw catRes.error;

        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Error loading data:", err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
