import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getRouter } from "#/router";
import "@fontsource-variable/inter";
import "#/styles.css";

const root = document.getElementById("app");
if (!root) throw new Error("Missing app element");
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={getRouter()} />
  </StrictMode>,
);
