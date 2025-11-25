"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useProducts } from "../../../context/ProductsContext";

export default function EditProductForm({
  onSubmitRedirect = "/admin/products",
}) {
  const { products, updateProduct } = useProducts();
  const params = useParams();
  const productId = Number(params.id);
  const router = useRouter();

  const product = products.find((p) => p.id === productId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: "",
    stock: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill formData when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        sku: product.sku || "",
        stock: product.stock || "",
        image: product.image || "",
      });
      setImagePreview(product.image || null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    updateProduct(productId, { ...formData, price: Number(formData.price) });
    router.push(onSubmitRedirect);
  };

  if (!product) return <p>Product not found</p>;

  return (
    <Card>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Price */}
          <div className="grid gap-6 md:grid-cols-2">
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

          {/* Category & SKU */}
          <div className="grid gap-6 md:grid-cols-2">
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
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home & Kitchen</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="toys">Toys & Games</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">SKU (Optional)</label>
              <Input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
              />
            </div>
          </div>

          {/* Stock */}
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

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImagePlus className="mb-2 h-8 w-8" />
                    <span>Upload image</span>
                  </div>
                )}
              </div>
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(onSubmitRedirect)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
