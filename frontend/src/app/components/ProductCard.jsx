'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/redeem');
  };

  const cardStyle = {
    background: 'linear-gradient(145deg, #A5D6A7, #E8F5E9, #C8E6C9)',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 6s ease-in-out infinite',
  };

  const kf = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <>
      <style>{kf}</style>
      <div
        className="card w-80 shadow-lg rounded-2xl transition-transform transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-green-300/50 duration-300"
        style={cardStyle}
      >
        <figure className="px-6 pt-6 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-xl h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </figure>

        <div className="card-body items-center text-center transition-all duration-300 hover:translate-y-1 hover:opacity-100 opacity-95">
          <h2 className="card-title font-semibold text-lg" style={{ color: '#1B5E20' }}>
            {product.name}
          </h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-green-600 text-sm font-medium">NGO: {product.ngo}</p>

          <div className="card-actions mt-3">
            <button
              onClick={handleClick}
              className="bg-gradient-to-r from-emerald-900 to-green-950 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:shadow-green-500/30 transition"
            >
              {product.price} GT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
