// "use client";

// import { Heart, Bookmark, Share2, Truck, RotateCcw } from "lucide-react";
// import StarRating from "./star-rating";
// export default function ProductInfo({
//   product,
//   colors,
//   sizes,
//   quantity,
//   selectedColor,
//   selectedSize,
//   setQuantity,
//   setSelectedColor,
//   setSelectedSize,
//   ratingBreakdown,
// }) {
//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
//       {/* Header with Actions */}
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
//           <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
//             {product.name}
//           </h1>
//         </div>
//         <div className="flex gap-3 ml-4">
//           <button className="p-2 hover:bg-gray-100 rounded-full transition">
//             <Heart className="w-6 h-6" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 rounded-full transition">
//             <Bookmark className="w-6 h-6" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 rounded-full transition">
//             <Share2 className="w-6 h-6" />
//           </button>
//         </div>
//       </div>

//       {/* Price and Rating */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-4">
//         <div>
//           <div className="text-4xl font-bold text-blue-600 mb-1">
//             ${product.price.toFixed(2)}
//           </div>
//           {product.originalPrice !== product.price && (
//             <div className="text-lg text-muted-foreground line-through">
//               ${product.originalPrice.toFixed(2)}
//             </div>
//           )}
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <StarRating rating={product.rating} size="lg" />
//             <span className="font-semibold text-foreground">
//               {product.rating}
//             </span>
//           </div>
//           <div className="text-sm text-muted-foreground">
//             {product.reviews} Reviews
//           </div>
//           <div className="text-sm text-green-600">
//             {product.recommendationPercentage}% of buyers have recommended this.
//           </div>
//         </div>
//       </div>

//       {/* Color Selection */}
//       <div>
//         <label className="block text-sm font-semibold mb-3">
//           Choose a Color
//         </label>
//         <div className="flex gap-3 flex-wrap">
//           {colors.map((color) => (
//             <button
//               key={color.name}
//               onClick={() => setSelectedColor(color.name)}
//               className={`w-12 h-12 rounded-full border-2 transition ${
//                 selectedColor === color.name
//                   ? "border-primary"
//                   : "border-gray-300"
//               }`}
//               style={{ backgroundColor: color.hex }}
//               title={color.name}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Size Selection */}
//       <div>
//         <label className="block text-sm font-semibold mb-3">
//           Choose a Size
//         </label>
//         <div className="flex flex-wrap gap-2">
//           {sizes.map((size) => (
//             <button
//               key={size}
//               onClick={() => setSelectedSize(size.toLowerCase())}
//               className={`px-4 py-2 border rounded transition ${
//                 selectedSize === size.toLowerCase()
//                   ? "border-primary bg-primary text-primary-foreground"
//                   : "border-gray-300 hover:border-primary"
//               }`}
//             >
//               {size}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Quantity and Add to Cart */}
//       <div className="flex gap-4 items-center flex-col sm:flex-row">
//         <div className="flex items-center border border-gray-300 rounded">
//           <button
//             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//             className="px-4 py-2 hover:bg-gray-100 transition"
//           >
//             −
//           </button>
//           <span className="px-6 py-2 font-semibold">{quantity}</span>
//           <button
//             onClick={() => setQuantity(quantity + 1)}
//             className="px-4 py-2 hover:bg-gray-100 transition"
//           >
//             +
//           </button>
//         </div>
//         <button className="flex-1 sm:flex-initial bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition">
//           🛒 Add To Cart
//         </button>
//       </div>

//       {/* Delivery Info */}
//       <div className="space-y-4 border-t pt-6">
//         <div className="flex gap-3">
//           <Truck className="w-6 h-6 text-primary flex-shrink-0" />
//           <div>
//             <h3 className="font-semibold text-foreground mb-1">
//               Free Delivery
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               Enter your Postal code for Delivery Availability
//             </p>
//           </div>
//         </div>
//         <div className="flex gap-3">
//           <RotateCcw className="w-6 h-6 text-primary flex-shrink-0" />
//           <div>
//             <h3 className="font-semibold text-foreground mb-1">
//               Return Delivery
//             </h3>
//             <p className="text-sm text-muted-foreground">
//               Free 30 days Delivery Return.{" "}
//               <a href="#" className="text-blue-600 hover:underline">
//                 Details
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
