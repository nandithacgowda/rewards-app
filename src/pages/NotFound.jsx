import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{ marginBottom: "16px", fontSize: "2rem", fontWeight: "bold" }}
        >
          404
        </h1>
        <p style={{ marginBottom: "16px", fontSize: "1.2rem", color: "#888" }}>
          Oops! Page not found
        </p>
        <a href="/" style={{ color: "#16213e", textDecoration: "underline" }}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
