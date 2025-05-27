import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-700 p-6 text-center">
      <h1 className="text-7xl font-bold text-purple-600">404</h1>
      <h2 className="text-2xl mt-4 font-semibold">Oops! Page not found.</h2>
      <p className="max-w-md mt-2 text-gray-500">
        Looks like the page you’re looking for has gone out of style.
        <br />
        Redirecting you to the home page in <span className="font-bold">{secondsLeft}</span> second{secondsLeft !== 1 ? "s" : ""}...
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Go Home Now
      </button>
    </div>
  );
};

export default ErrorPage;
