mod layer;
mod workspace;
mod dom_builder;
mod event_handlers;

use wasm_bindgen::prelude::*;
use workspace::WORKSPACE;

// Test function
#[wasm_bindgen]
pub fn test_wasm() -> String {
    "WASM module loaded successfully!".to_string()
}

// Mount workspace and create layers
#[wasm_bindgen]
pub fn mount_workspace(container: &web_sys::HtmlElement) -> Result<(), JsValue> {
    WORKSPACE.with(|workspace| {
        workspace.borrow_mut().mount(container)
    })
}

// Unmount workspace and clean up
#[wasm_bindgen]
pub fn unmount_workspace() -> Result<(), JsValue> {
    WORKSPACE.with(|workspace| {
        workspace.borrow_mut().unmount()
    })
}

// Update selected layer position
#[wasm_bindgen]
pub fn update_selected_position(axis: &str, value: i32) -> Result<(), JsValue> {
    WORKSPACE.with(|workspace| {
        workspace.borrow_mut().update_selected_position(axis, value)
    })
}

// Bring selected layer to front
#[wasm_bindgen]
pub fn bring_to_front() -> Result<(), JsValue> {
    WORKSPACE.with(|workspace| {
        workspace.borrow_mut().bring_to_front()
    })
}

// Send selected layer to back
#[wasm_bindgen]
pub fn send_to_back() -> Result<(), JsValue> {
    WORKSPACE.with(|workspace| {
        workspace.borrow_mut().send_to_back()
    })
}

// Select a layer by index
#[wasm_bindgen]
pub fn select_layer(index: usize) -> Result<(), JsValue> {
    WORKSPACE.with(|workspace| {
        workspace.borrow_mut().select_layer(index)
    })
}
