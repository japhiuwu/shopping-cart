import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import Header from "./components/Header";
import { CartProvider } from "./components/CartContext";

import "./styles/index.css";
import routes from "./config/routes";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <Header />
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);
