"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    stock: "",
    images: Array(4).fill(null), // local files or URLs
  });
  const [previews, setPreviews] = useState(Array(4).fill(null));

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: catData, error: catError } = await supabase
          .from("categories")
          .select("*");
        if (catError) throw catError;
        setCategories(catData);

        const { data: prodData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();
        if (prodError) throw prodError;

        setFormData((prev) => ({
          ...prev,
          name: prodData.name || "",
          description: prodData.description || "",
          price: prodData.price || "",
          discount: prodData.discount || "",
          category: prodData.category || "",
          stock: prodData.stock || "",
        }));

        if (prodData.image_urls) {
          const urls = JSON.parse(prodData.image_urls);
          setFormData((prev) => ({
            ...prev,
            images: urls.slice(0, 4), // prefill images array
          }));
          setPreviews(urls.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load product data.");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectChange = (value) =>
    setFormData({ ...formData, category: value });

  const handleFileChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...formData.images];
    updatedImages[idx] = file; // replace file or URL
    setFormData({ ...formData, images: updatedImages });

    const updatedPreviews = [...previews];
    updatedPreviews[idx] = URL.createObjectURL(file); // preview
    setPreviews(updatedPreviews);
  };

  const uploadImages = async (imagesArray) => {
    return Promise.all(
      imagesArray.map(async (img) => {
        if (typeof img === "string") return img; // existing URL
        const fileName = `products/${Date.now()}_${img.name}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(fileName, img, { cacheControl: "3600", upsert: false });
        if (error) throw error;

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        return data.publicUrl;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadedFiles = formData.images.filter(Boolean);
    if (uploadedFiles.length < 2) {
      alert("Please upload at least 2 images.");
      return;
    }

    setLoading(true);
    try {
      const imageUrls = await uploadImages(uploadedFiles);
      const price = Number(formData.price);
      const discount = Number(formData.discount) || 0;
      const discount_price = price - (price * discount) / 100;

      const { error } = await supabase
        .from("products")
        .update([
          {
            name: formData.name,
            description: formData.description,
            price,
            discount,
            discount_price,
            category: formData.category,
            stock: Number(formData.stock),
            image_urls: JSON.stringify(imageUrls),
          },
        ])
        .eq("id", productId);

      if (error) throw error;
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p>Loading product...</p>;

  const price = Number(formData.price) || 0;
  const discount = Number(formData.discount) || 0;
  const discount_price = price - (price * discount) / 100;
  const savedMoney = price - discount_price;

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name, Price & Discount */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Price ($)</label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Discount (%)</label>
              <Input
                name="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
              />
              {discount > 0 && price > 0 && (
                <div className="text-green-600 font-semibold mt-1">
                  You save ${savedMoney.toFixed(2)} - Now $
                  {discount_price.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Category & Stock */}
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl w-full">
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.category || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.category}>
                      {cat.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Stock Quantity</label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2 font-medium">
              Product Images (min 2)
            </label>
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative flex h-28.5 w-28.5 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(e, idx)}
                  />
                  {previews[idx] ? (
                    <img
                      src={previews[idx]}
                      alt={`Preview ${idx + 1}`}
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImagePlus className="mb-2 h-8 w-8" />
                      <span>Upload</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : "Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
