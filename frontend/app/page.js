"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    arsenic: "",
    lead: "",
    cadmium: "",
    chromium: "",
    mercury: "",
    nickel: "",
    copper: "",
    zinc: "",
    iron: "",
    manganese: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null); // 👈 reference for results section

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") data[key] = parseFloat(value);
    });

    try {
      const res = await fetch("http://localhost:3001/api/hmpi/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heavyMetalConcentrations: data }),
      });
      const json = await res.json();
      setResult(json);

      // 👇 Scroll to results after state updates
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-start p-6">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Heavy Metal Pollution Indices Calculator
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {Object.keys(formData).map((metal) => (
            <div key={metal}>
              <label className="block text-sm font-semibold text-gray-700 capitalize">
                {metal} (mg)
              </label>
              <div className="mt-2 flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-pink-300">
                <input
                  type="number"
                  step="0.0001"
                  name={metal}
                  value={formData[metal]}
                  onChange={handleChange}
                  className="w-full rounded-l-xl px-3 py-2 text-gray-800 focus:outline-none"
                  placeholder={`Enter ${metal}`}
                />
                <span className="px-3 py-2 text-gray-500 text-sm">mg</span>
              </div>
            </div>
          ))}

          <div className="col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition transform"
            >
              {loading ? "Calculating..." : "✨ Calculate ✨"}
            </button>
          </div>
        </form>

        {result && (
          <div
            ref={resultsRef} // 👈 attach the ref here
            className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-100 border rounded-2xl shadow-inner"
          >
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Results:</h2>
            <ul className="grid grid-cols-2 gap-3 text-gray-800 font-medium">
              <li><b>HPI:</b> {result.HPI.toFixed(2)}</li>
              <li><b>HEI:</b> {result.HEI.toFixed(2)}</li>
              <li><b>MI:</b> {result.MI.toFixed(2)}</li>
              <li><b>Cd:</b> {result.Cd.toFixed(2)}</li>
              <li><b>Nemerow:</b> {result.Nemerow.toFixed(2)}</li>
              <li className="col-span-2">
                <b>Classification:</b>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white font-bold ${
                    result.classification === "Safe"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {result.classification}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
