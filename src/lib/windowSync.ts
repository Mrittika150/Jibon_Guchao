import { isTauri } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { QueryClient } from "@tanstack/react-query";

const DATA_CHANGED = "data-changed";
type DataChanged = { from: string };

// Tell the other windows: "I saved something, refresh your data"
export function tellOtherWindows() {
  if (!isTauri()) return;
  void emit<DataChanged>(DATA_CHANGED, { from: getCurrentWindow().label });
}

// When ANOTHER window saved something, refresh this window's data
export function listenToOtherWindows(queryClient: QueryClient) {
  if (!isTauri()) return;
  const me = getCurrentWindow().label;
  void listen<DataChanged>(DATA_CHANGED, (event) => {
    if (event.payload.from !== me) {
      void queryClient.invalidateQueries();
    }
  });
}