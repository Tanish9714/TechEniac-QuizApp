"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    phone: "",
    password: "",
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function formValidator() {
    let fieldErrors = {};
    const firstname = formData.firstName.trim();
    const lastname = formData.lastName.trim();
    const email = formData.email.trim();
    const birthdate = formData.birthdate.trim();
    const phone = formData.phone.trim();
    const password = formData.password.trim();
    const profilePicture = formData.profilePicture;

    if (!firstname || firstname.length < 2) {
      fieldErrors.firstName =
        "First name is required and must be at least 2 characters long.";
    }

    if (!lastname || lastname.length < 2) {
      fieldErrors.lastName =
        "Last name is required and must be at least 2 characters long.";
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      fieldErrors.email = "A valid email is required.";
    }

    if (!birthdate) {
      fieldErrors.birthdate = "Birthdate is required.";
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      fieldErrors.phone =
        "Phone number is required and must be 10 digits long.";
    }

    if (!password || password.length < 8) {
      fieldErrors.password =
        "Password is required and must be at least 8 characters long.";
    }

    if (profilePicture && !profilePicture.type.startsWith("image/")) {
      fieldErrors.profilePicture = "Profile picture must be an image file.";
    }
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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
      const formData = new FormData(event.target);

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) {
          if (result.error.includes("email already exists")) {
            setErrors({ email: result.error });
          } else {
            setErrors({ general: result.error });
          }
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        general: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="font-sans items-center min-h-screen justify-items-center sm:p-20 flex justify-center bg-gray-900">
      <div className="p-6 rounded-lg shadow-lg w-full max-w-md border border-cyan-50 bg-gray-800">
        <h2 className="text-2xl font-bold text-cyan-50 text-center mb-6">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 text-cyan-50"
          encType="multipart/form-data"
        >
          {errors.general && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {errors.general}
            </div>
          )}
          <div className="flex gap-2">
            <div>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                className={`border p-2 rounded w-full bg-gray-700 text-white placeholder-gray-400 ${
                  errors.firstName ? "border-red-500" : "border-cyan-50"
                }`}
                onChange={handleChange}
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                className={`border p-2 rounded w-full bg-gray-700 text-white placeholder-gray-400 ${
                  errors.lastName ? "border-red-500" : "border-cyan-50"
                }`}
                onChange={handleChange}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

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
              name="birthdate"
              type="date"
              value={formData.birthdate}
              className={`border p-2 rounded w-full bg-gray-700 text-white ${
                errors.birthdate ? "border-red-500" : "border-cyan-50"
              }`}
              onChange={handleChange}
            />
            {errors.birthdate && (
              <p className="text-red-400 text-sm mt-1">{errors.birthdate}</p>
            )}
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              className={`border p-2 rounded w-full bg-gray-700 text-white placeholder-gray-400 ${
                errors.phone ? "border-red-500" : "border-cyan-50"
              }`}
              onChange={handleChange}
              placeholder="Phone Number (10 digits)"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              type="password"
              value={formData.password}
              placeholder="Password"
              className={`border p-2 rounded w-full bg-gray-700 text-white placeholder-gray-400 ${
                errors.password ? "border-red-500" : "border-cyan-50"
              }`}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Must be 8+ characters with uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <input
              name="profilePicture"
              type="file"
              accept="image/*"
              className={`border p-2 rounded w-full bg-gray-700 text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-cyan-50 file:text-black ${
                errors.profilePicture ? "border-red-500" : "border-cyan-50"
              }`}
              onChange={handleChange}
            />
            {errors.profilePicture && (
              <p className="text-red-400 text-sm mt-1">
                {errors.profilePicture}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Optional: JPEG, PNG, or GIF (max 5MB)
            </p>
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
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-cyan-50">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-cyan-100">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
