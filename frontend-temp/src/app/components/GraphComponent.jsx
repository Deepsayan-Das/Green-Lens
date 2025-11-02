import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { monthlyTokens, activityBreakdown } from "../data/dashboardData";

const COLORS = ["#2E7D32", "#66BB6A", "#81C784", "#A5D6A7"];

export default function GraphComponent() {
  const totalTokens = monthlyTokens.reduce((sum, m) => sum + m.tokens, 0);
  const lastMonthTokens = monthlyTokens[monthlyTokens.length - 2].tokens;
  const currentMonthTokens = monthlyTokens[monthlyTokens.length - 1].tokens;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#A5D6A7] to-[#E8F5E9] p-8 mt-6 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 text-emerald-900">
        Your previous activities
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="card bg-white shadow-md p-5 rounded-2xl border-t-4 border-green-700">
          <h2 className="text-gray-600">Total Tokens Earned</h2>
          <p className="text-3xl font-bold text-green-800 mt-2">{totalTokens}</p>
        </div>
        <div className="card bg-white shadow-md p-5 rounded-2xl border-t-4 border-emerald-600">
          <h2 className="text-gray-600">Last Month</h2>
          <p className="text-3xl font-bold text-emerald-800 mt-2">{lastMonthTokens}</p>
        </div>
        <div className="card bg-white shadow-md p-5 rounded-2xl border-t-4 border-lime-600">
          <h2 className="text-gray-600">Current Month</h2>
          <p className="text-3xl font-bold text-lime-800 mt-2">{currentMonthTokens}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-6 text-green-800">
            Monthly Green Tokens Earned
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyTokens}>
              <Line type="monotone" dataKey="tokens" stroke="#2E7D32" strokeWidth={3} />
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-green-800">
            Token Breakdown by Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#2E7D32"
                dataKey="value"
                label
              >
                {activityBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}