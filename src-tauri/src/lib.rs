use tauri::{Manager, PhysicalPosition, WindowEvent};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Put the widget in the top-right corner of the main screen
            if let Some(widget) = app.get_webview_window("widget") {
                if let Some(monitor) = widget.primary_monitor()? {
                    let screen = monitor.size();
                    let origin = monitor.position();
                    let widget_size = widget.outer_size()?;
                    let margin = (24.0 * monitor.scale_factor()) as i32;

                    let x = origin.x + screen.width as i32 - widget_size.width as i32 - margin;
                    let y = origin.y + margin;
                    widget.set_position(PhysicalPosition::new(x, y))?;
                }
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            // Closing the main window quits the whole app, widget included
            if window.label() == "main" {
                if let WindowEvent::CloseRequested { .. } = event {
                    window.app_handle().exit(0);
                }
            }
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}