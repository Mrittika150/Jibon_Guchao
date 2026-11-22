import { isTauri } from "@tauri-apps/api/core";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";

export async function notify(title: string, body: string): Promise<boolean> {
  if (!isTauri()) return false;
  let allowed = await isPermissionGranted();
  if (!allowed) {
    allowed = (await requestPermission()) === "granted";
  }
  if (allowed) {
    sendNotification({ title, body });
  }
  return allowed;
}