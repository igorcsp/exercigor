import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./AuthContext.jsx";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <App />
    </AuthProvider>
);
