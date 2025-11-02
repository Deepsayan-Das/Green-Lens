import React from "react"
import { TreeDeciduous } from "lucide-react";


const recommendations = [
  {
    id: 1,
    title: "Switch to Renewable Energy",
    description:
      "Install solar panels or opt for a renewable energy provider to cut your emissions significantly.",
    image:"/solar-energy.png",
  },
  {
    id: 2,
    title: "Use Public Transport",
    description:
      "Reduce carbon emissions by choosing buses, trains, cycling, or carpooling instead of solo drives.",
    image:
      "train.png",
  },
  {
    id: 3,
    title: "Reduce Food Waste",
    description:
      "Plan your meals, store food properly, and compost organic waste to lower methane emissions.",
    image:
      "compost.png",
  },
  {
    id: 4,
    title: "Switch to Reusable Items",
    description:
      "Replace single-use plastics with reusable bottles, bags, and containers for everyday use.",
    image:
      "recycle.png",
  },
  {
    id: 5,
    title: "Plant a Tree",
    description:
      "Join local tree-planting drives — every tree absorbs about 22 kg of CO₂ per year.",
      image:
      "plant.png",

  },
  {
    id: 6,
    title: "Buy Local Products",
    description:
      "Support local farmers and reduce transport emissions by choosing local and seasonal produce.",
    image:
      "healthy.png",
  },
];

const RecommendationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A5D6A7] to-[#E8F5E9] py-12 px-8">
      <h1 className="text-3xl font-bold text-center text-green-900 mb-10">
        Recommendations to Reduce Your Carbon Footprint
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="card bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-green-200"
          >
            <figure className="px-6 pt-6">
              <img
                src={rec.image}
                alt={rec.title}
                className="w-20 h-20 object-contain"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-green-800 font-semibold mb-2">
                {rec.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{rec.description}</p>
              <div className="card-actions mt-4">
                <button className="bg-gradient-to-r from-emerald-900 to-green-950 text-white px-4 py-2 rounded-xl hover:scale-105 transition">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPage;