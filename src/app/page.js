"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Screen from "./_components/Screen";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState("home");
  const [results, setResults] = useState([]);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log(decoded, currentTime);
      if (decoded.exp < currentTime) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        router.push("/login");
      } else {
        setIsLoggedIn(true);
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      }
    } catch (error) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 text-cyan-50 px-8 py-6 rounded shadow-lg text-xl font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  const handleStartQuiz = () => {
    setScreen("quiz");
  };

  const handleFinish = (data) => {
    setResults(data);
    setScreen("result");
  };

  const handleRestart = () => {
    setResults([]);
    setScreen("home");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-cyan-50 p-4">
        <div className="flex mx-5 justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-50">Quiz App</h1>
          <div className="flex items-center gap-4">
            {userData && (
              <div className="flex items-center gap-3 text-cyan-50">
                <img
                  src={userData.profilePicture}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-cyan-50"
                />
                <span className="hidden sm:block">
                  {userData.firstName} {userData.lastName}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="font-sans flex flex-col gap-4 mt-20 items-center justify-items-center p-8 sm:p-20">
        <Screen
          screen={screen}
          onStart={handleStartQuiz}
          onFinish={handleFinish}
          results={results}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
