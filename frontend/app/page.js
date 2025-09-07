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

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow empty string or numeric values
    if (value === "" || !isNaN(value)) {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" }); // clear error
    } else {
      setErrors({ ...errors, [name]: "Please enter a valid number" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submit if errors exist
    const hasErrors = Object.values(errors).some((msg) => msg !== "");
    if (hasErrors) {
      alert("Please fix errors before submitting.");
      return;
    }

    setLoading(true);

    const data = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") data[key] = parseFloat(value);
    });

    try {
      const res = await fetch(
        "https://hmpi-cal.onrender.com/api/hmpi/calculate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heavyMetalConcentrations: data }),
        }
      );
      const json = await res.json();
      setResult(json);

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) =>
    typeof num === "number" ? num.toFixed(2) : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Heavy Metal Pollution Indices Calculator
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {Object.keys(formData).map((metal) => (
            <div key={metal}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {metal}
                </label>
                <div className="relative">
                <input
                    type="text"
                    name={metal}
                    value={formData[metal]}
                    onChange={handleChange}
                    className={`w-full rounded-md border p-2 pr-12 shadow-sm focus:ring-2 text-black ${
                    errors[metal]
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                   }`}
                  placeholder={`Enter ${metal}`}
                />

                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                   mg
                 </span>
            </div>
  {errors[metal] && (
    <p className="text-red-500 text-sm mt-1">{errors[metal]}</p>
  )}
</div>

          ))}

          <div className="col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </div>
        </form>

        {result && (
          <div
            ref={resultRef}
            className="mt-10 p-6 bg-gradient-to-r from-green-50 to-green-100 border rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Results:</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <b>HPI:</b> {formatNumber(result.HPI)}
              </li>
              <li>
                <b>HEI:</b> {formatNumber(result.HEI)}
              </li>
              <li>
                <b>MI:</b> {formatNumber(result.MI)}
              </li>
              <li>
                <b>Cd:</b> {formatNumber(result.Cd)}
              </li>
              <li>
                <b>Nemerow:</b> {formatNumber(result.Nemerow)}
              </li>
              <li>
                <b>Classification:</b>{" "}
                <span
                  className={
                    result.classification === "Safe"
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
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
