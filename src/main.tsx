import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/700.css";
import "./themes/themes.css";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import App from "./App";
import { getStartingTheme } from "./themes/useTheme";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { listenToOtherWindows } from "./lib/windowSync";
import { WidgetApp } from "./widget/WidgetApp";
import { setWidgetVisible, widgetWasShown } from "./widget/widgetWindow";

// Both windows load this same file. The window's label tells us which one we are.
const isWidget = isTauri() && getCurrentWindow().label === "widget";

document.documentElement.dataset.theme = getStartingTheme();
// If the theme is changed in the other window, follow it
window.addEventListener("storage", () => {
  document.documentElement.dataset.theme = getStartingTheme();
});

listenToOtherWindows(queryClient);

// Bring the widget back if it was open last time
if (!isWidget && widgetWasShown()) {
  void setWidgetVisible(true);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {isWidget ? <WidgetApp /> : <App />}
    </QueryClientProvider>
  </React.StrictMode>,
);