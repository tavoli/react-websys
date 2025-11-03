use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{EventTarget, HtmlElement};

pub struct EventHandle {
    target: EventTarget,
    event_type: String,
    closure: Option<Closure<dyn FnMut(web_sys::Event)>>,
}

impl EventHandle {
    pub fn new(
        target: EventTarget,
        event_type: &str,
        closure: Closure<dyn FnMut(web_sys::Event)>,
    ) -> Result<Self, JsValue> {
        target.add_event_listener_with_callback(&event_type, closure.as_ref().unchecked_ref())?;

        Ok(EventHandle {
            target,
            event_type: event_type.to_string(),
            closure: Some(closure),
        })
    }
}

impl Drop for EventHandle {
    fn drop(&mut self) {
        if let Some(closure) = self.closure.take() {
            let _ = self.target.remove_event_listener_with_callback(
                &self.event_type,
                closure.as_ref().unchecked_ref(),
            );
        }
    }
}

pub struct DragState {
    pub dragging: bool,
    pub start_x: i32,
    pub start_y: i32,
    pub layer_id: usize,
    pub container: Option<HtmlElement>,
    pub layer_element: Option<HtmlElement>,
}

impl DragState {
    pub fn new() -> Self {
        DragState {
            dragging: false,
            start_x: 0,
            start_y: 0,
            layer_id: 0,
            container: None,
            layer_element: None,
        }
    }

    pub fn start(&mut self, x: i32, y: i32, layer_id: usize, container: HtmlElement, layer_elem: HtmlElement) {
        self.dragging = true;
        self.start_x = x;
        self.start_y = y;
        self.layer_id = layer_id;
        self.container = Some(container);
        self.layer_element = Some(layer_elem);
    }

    pub fn stop(&mut self) {
        self.dragging = false;
        self.container = None;
        self.layer_element = None;
    }
}
