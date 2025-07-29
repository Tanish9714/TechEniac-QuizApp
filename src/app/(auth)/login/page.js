"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  function formValidator() {
    const { email, password } = formData;
    let fieldErrors = {};

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      fieldErrors.email = "A valid email is required.";
    }

    if (!password.trim() || password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!formValidator()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Login failed" });
      } else {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          if (data.user) {
            localStorage.setItem("userData", JSON.stringify(data.user));
          }
          router.push("/");
        }
        console.log("Login successful");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "An error occurred during login." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="font-sans items-center min-h-screen justify-center sm:p-20 flex bg-gray-900">
      <div className="p-6 rounded-lg shadow-lg w-full max-w-md border border-cyan-50 bg-gray-800">
        <h2 className="text-2xl font-bold text-cyan-50 text-center mb-6">
          Login
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-cyan-50"
        >
          {errors.general && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              className={`border p-2 rounded w-full bg-gray-700 text-white placeholder-gray-400 ${
                errors.email ? "border-red-500" : "border-cyan-50"
              }`}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              type="password"
              value={formData.password}
              className={`border p-2 rounded w-full bg-gray-700 text-white placeholder-gray-400 ${
                errors.password ? "border-red-500" : "border-cyan-50"
              }`}
              onChange={handleChange}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-bold p-2 rounded cursor-pointer transition-colors ${
              isSubmitting
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-cyan-50 text-black hover:bg-gray-50"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-cyan-50">
            Don't have an account?{" "}
            <Link href="/register" className="underline hover:text-cyan-100">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
