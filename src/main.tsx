import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/700.css";
import "./themes/themes.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);