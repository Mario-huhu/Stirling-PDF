use tauri::{RunEvent, WindowEvent};

mod utils;
mod commands;

use commands::{start_backend, check_backend_health, get_opened_file, clear_opened_file, cleanup_backend, set_opened_file};
use utils::add_log;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|_| {
      // Check command line arguments at startup for macOS file opening
      let args: Vec<String> = std::env::args().collect();
      for arg in args.iter().skip(1) {
        if arg.ends_with(".pdf") && std::path::Path::new(arg).exists() {
          add_log(format!("📂 File argument detected at startup: {}", arg));
          set_opened_file(arg.clone());
          break; // Only handle the first PDF file
        }
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![start_backend, check_backend_health, get_opened_file, clear_opened_file])
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(|app_handle, event| {
      match event {
        RunEvent::ExitRequested { .. } => {
          add_log("🔄 App exit requested, cleaning up...".to_string());
          cleanup_backend();
          // Use Tauri's built-in cleanup
          app_handle.cleanup_before_exit();
        }
        RunEvent::WindowEvent { event: WindowEvent::CloseRequested {.. }, .. } => {
          add_log("🔄 Window close requested, cleaning up...".to_string());
          cleanup_backend();
          // Allow the window to close
        }
        _ => {}
      }
    });
}