import React from "react";
import { products } from "../data/product.js";
import ProductCard from "../components/ProductCard.jsx";

const RedeemPage = () => {
    const ha = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes floatY {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `;
  return (
        <div
      className="min-h-screen flex justify-center items-center"
      style={{
        background: "linear-gradient(135deg, #a7f3d0 0%, #d9f99d 100%)",
      }}
    >
        <style>{ha}</style>
       <div className="max-w-[1200px] w-full mx-auto px-4 py-10">
       <h1
          className="text-5xl sm:text-6xl md:text-6xl font-extrabold text-center mb-10"
          style={{
            background: "linear-gradient(90deg, #0B3D2E, #1B5E20, #FFC107, #1B5E20)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gradientShift 6s ease-in-out infinite, floatY 4s ease-in-out infinite",
          }}
        >
          Shop Sustainably, Support Our Planet
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedeemPage;