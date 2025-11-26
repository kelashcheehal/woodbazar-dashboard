"use client";
import ProductBreadcrumb from "@/components/breadcrumb";
import ProductGallery from "@/components/product-gallery";
import ProductInfo from "@/components/product-info";
import ProductFeatures from "@/components/product-feature";
import ProductTabs from "@/components/product-tab";
import RelatedProducts from "@/components/related-products";

export default function ProductDetail() {
  const product = {
    id: 1,
    name: "Premium Wooden Dining Chair",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 128,
    sku: "WDC-001-WAL",
    availability: "In Stock",
    images: [
      "/wooden-dining-chair-front-view.jpg",
      "/wooden-dining-chair-side-view.jpg",
      "/wooden-dining-chair-detail.jpg",
      "/wooden-dining-chair-back-view.jpg",
    ],
    colors: [
      { name: "walnut", hex: "#3E2723", label: "Walnut" },
      { name: "oak", hex: "#8D6E63", label: "Oak" },
      { name: "maple", hex: "#A1887F", label: "Maple" },
    ],
    sizes: ["Small", "Medium", "Large"],
    description:
      "Handcrafted premium wooden dining chair featuring solid wood construction with a beautiful walnut finish. Perfect for modern dining rooms, this chair combines elegance with comfort.",
    features: [
      "Solid wood construction for durability",
      "Comfortable curved backrest",
      "Non-slip foot pads",
      "Easy to clean and maintain",
      "Supports up to 300 lbs",
      "Available in multiple finishes",
    ],
    specifications: {
      material: "Solid Walnut Wood",
      dimensions: '18" W × 22" D × 32" H',
      weight: "12 lbs",
      finish: "Hand-applied natural oil",
      warranty: "5 years",
      care: "Wipe clean with damp cloth, dry immediately",
    },
    reviews_data: [
      {
        id: 1,
        author: "John Smith",
        rating: 5,
        date: "2 weeks ago",
        title: "Excellent quality!",
        comment:
          "This chair is absolutely beautiful and very sturdy. The craftsmanship is outstanding.",
      },
      {
        id: 2,
        author: "Sarah Johnson",
        rating: 4,
        date: "1 month ago",
        title: "Great value for money",
        comment:
          "Very satisfied with the purchase. Arrived well packaged and on time.",
      },
    ],
    relatedProducts: [
      {
        id: 2,
        name: "Modern Coffee Table",
        price: 449,
        image: "/wooden-coffee-table-modern.jpg",
        rating: 4.7,
      },
      {
        id: 3,
        name: "Elegant Side Table",
        price: 199,
        image: "/wooden-side-table-elegant.jpg",
        rating: 4.9,
      },
      {
        id: 4,
        name: "Vintage Bookshelf",
        price: 599,
        image: "/wooden-bookshelf-vintage.jpg",
        rating: 4.6,
      },
    ],
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = (quantity, color, size) => {
    console.log(
      `Added to cart: ${quantity}x ${product.name} in ${color} size ${size}`
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-6 pb-4 px-4 md:px-8 max-w-7xl mx-auto">
        <ProductBreadcrumb productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery
            images={product.images}
            productName={product.name}
            discount={discount}
          />
          <ProductInfo product={product} onAddToCart={handleAddToCart} />
        </div>

        <ProductFeatures />
        <ProductTabs product={product} />
        <RelatedProducts products={product.relatedProducts} />
      </div>
    </div>
  );
}
