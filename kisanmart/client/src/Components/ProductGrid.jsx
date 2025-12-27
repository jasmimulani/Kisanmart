import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import ProductCard from "./ProductCard";

const ProductGrid = ({ limit = 8 }) => {
  const { products } = useAppContext();

  // Safety check
  if (!Array.isArray(products)) return null;

  // Filter valid products & limit
  const items = products
    .filter((p) => p && (p._id || p.id))
    .slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Popular Products</h2>
        <Link
          to="/products"
          className="text-green-600 font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;


