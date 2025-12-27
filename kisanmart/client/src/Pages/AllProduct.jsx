// src/Pages/AllProduct.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import ProductCard from '../Components/ProductCard';

const AllProduct = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filterProducts = () => {
      setLoading(true);
      try {
        let result = [...products];
        
        // Apply search filter
        if (searchQuery.length > 0) {
          result = result.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply category filter from URL if present
        const category = searchParams.get('category');
        if (category) {
          result = result.filter(product => 
            product.category && 
            product.category.toLowerCase() === category.toLowerCase()
          );
        }

        setFilteredProducts(result);
      } catch (error) {
        console.error('Error filtering products:', error);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [products, searchQuery, searchParams]);

  return (
    <div className='mt-16 flex flex-col px-4'>
      <div className='flex flex-col items-start w-full max-w-7xl mx-auto'>
        <h1 className='text-2xl font-medium uppercase mb-2'>
          {searchQuery ? 'Search Results' : 'All Products'}
        </h1>
        <div className='w-16 h-0.5 bg-primary rounded-full mb-6'></div>
        
        {loading ? (
          <div className="w-full text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {filteredProducts
              .filter(product => product.inStock)
              .map((product, index) => (
                <ProductCard key={`${product._id}-${index}`} product={product} />
              ))}
          </div>
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProduct;