import { isTauri } from "@tauri-apps/api/core";
import { Window } from "@tauri-apps/api/window";

const SHOWN_KEY = "jibon-guchao-widget";

// Show or hide the widget, and remember the choice for next time
export async function setWidgetVisible(visible: boolean) {
  if (!isTauri()) return;
  const widget = await Window.getByLabel("widget");
  if (widget === null) return;

  if (visible) {
    await widget.show();
  } else {
    await widget.hide();
  }
  localStorage.setItem(SHOWN_KEY, visible ? "shown" : "hidden");
}

export async function toggleWidget() {
  if (!isTauri()) return;
  const widget = await Window.getByLabel("widget");
  if (widget === null) return;
  await setWidgetVisible(!(await widget.isVisible()));
}

export function widgetWasShown(): boolean {
  return localStorage.getItem(SHOWN_KEY) === "shown";
}