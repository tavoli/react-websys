use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{Document, HtmlElement, MouseEvent, Window};

use crate::layer::Layer;
use crate::dom_builder::DomBuilder;
use crate::event_handlers::{EventHandle, DragState};

thread_local! {
    pub static WORKSPACE: RefCell<Workspace> = RefCell::new(Workspace::new());
}

pub struct Workspace {
    layers: Vec<Layer>,
    container: Option<HtmlElement>,
    document: Option<Document>,
    window: Option<Window>,
    selected_layer: Option<usize>,
    event_handles: Vec<EventHandle>,
    drag_state: Rc<RefCell<DragState>>,
}

impl Workspace {
    pub fn new() -> Self {
        Workspace {
            layers: Vec::new(),
            container: None,
            document: None,
            window: None,
            selected_layer: None,
            event_handles: Vec::new(),
            drag_state: Rc::new(RefCell::new(DragState::new())),
        }
    }

    pub fn mount(&mut self, container: &HtmlElement) -> Result<(), JsValue> {
        // Get document and window
        let window = web_sys::window().ok_or("No window")?;
        let document = window.document().ok_or("No document")?;

        self.container = Some(container.clone());
        self.document = Some(document.clone());
        self.window = Some(window.clone());

        // Create 5 layers
        for i in 0..5 {
            let x = 50 + (i as i32 * 120);
            let y = 50 + (i as i32 * 80);
            let z_index = i as i32;

            let mut layer = Layer::new(i, x, y, z_index);

            // Create layer element
            let layer_elem = DomBuilder::create(&document, "div")?
                .id(&format!("layer-{}", i))?
                .class("wasm-layer")?
                .style("position", "absolute")?
                .style("width", "100px")?
                .style("height", "100px")?
                .style("left", &format!("{}px", x))?
                .style("top", &format!("{}px", y))?
                .style("z-index", &z_index.to_string())?
                .attr("data-layer-id", &i.to_string())?
                .attr("data-selected", "false")?
                .text(&format!("Layer {}", i + 1))?
                .build_html()
                .ok_or("Failed to create HTML element")?;

            // Setup mousedown event for this layer
            self.setup_layer_events(&layer_elem, i)?;

            // Append to container
            container.append_child(&layer_elem)?;

            layer.set_element(layer_elem);
            self.layers.push(layer);
        }

        // Setup global mousemove and mouseup events
        self.setup_global_events()?;

        // Select first layer by default
        self.select_layer(0)?;

        Ok(())
    }

    fn setup_layer_events(&mut self, element: &HtmlElement, layer_id: usize) -> Result<(), JsValue> {
        let drag_state = self.drag_state.clone();
        let container = self.container.as_ref().unwrap().clone();

        let mousedown = Closure::wrap(Box::new(move |event: web_sys::Event| {
            let mouse_event = event.dyn_ref::<MouseEvent>().unwrap();
            let mut state = drag_state.borrow_mut();

            // Get the element from the event target instead of using a captured clone
            if let Some(target) = event.current_target() {
                if let Some(html_elem) = target.dyn_ref::<HtmlElement>() {
                    // Use getBoundingClientRect to get viewport-relative coordinates
                    let layer_rect = html_elem.get_bounding_client_rect();
                    let layer_x = layer_rect.left() as i32;
                    let layer_y = layer_rect.top() as i32;

                    // Calculate offset between mouse and layer (both in viewport coordinates)
                    state.start(
                        mouse_event.client_x() - layer_x,
                        mouse_event.client_y() - layer_y,
                        layer_id,
                        container.clone(),
                        html_elem.clone()  // Use the element from the event target, not a captured clone
                    );

                    // Set opacity during drag
                    let _ = html_elem.style().set_property("opacity", "0.8");
                }
            }

            event.prevent_default();
        }) as Box<dyn FnMut(_)>);

        let handle = EventHandle::new(
            element.clone().into(),
            "mousedown",
            mousedown,
        )?;

        self.event_handles.push(handle);
        Ok(())
    }

    fn setup_global_events(&mut self) -> Result<(), JsValue> {
        let document = self.document.as_ref().ok_or("No document")?.clone();
        let drag_state = self.drag_state.clone();

        // Mousemove handler
        let drag_state_move = drag_state.clone();
        let mousemove = Closure::wrap(Box::new(move |event: web_sys::Event| {
            let mouse_event = event.dyn_ref::<MouseEvent>().unwrap();
            let state = drag_state_move.borrow();

            if state.dragging {
                // Use cached elements instead of querying DOM
                if let (Some(container), Some(layer_elem)) = (&state.container, &state.layer_element) {
                    let container_rect = container.get_bounding_client_rect();
                    let new_x = mouse_event.client_x() - container_rect.left() as i32 - state.start_x;
                    let new_y = mouse_event.client_y() - container_rect.top() as i32 - state.start_y;

                    let style = layer_elem.style();
                    let _ = style.set_property("left", &format!("{}px", new_x));
                    let _ = style.set_property("top", &format!("{}px", new_y));
                }
            }
        }) as Box<dyn FnMut(_)>);

        let doc_for_handle = document.clone();
        let move_handle = EventHandle::new(
            doc_for_handle.into(),
            "mousemove",
            mousemove,
        )?;

        // Mouseup handler
        let drag_state_up = drag_state.clone();
        let mouseup = Closure::wrap(Box::new(move |_event: web_sys::Event| {
            let mut state = drag_state_up.borrow_mut();

            if state.dragging {
                // Use cached element to restore opacity
                if let Some(layer_elem) = &state.layer_element {
                    let _ = layer_elem.style().set_property("opacity", "1");
                }

                state.stop();
            }
        }) as Box<dyn FnMut(_)>);

        let up_handle = EventHandle::new(
            document.into(),
            "mouseup",
            mouseup,
        )?;

        self.event_handles.push(move_handle);
        self.event_handles.push(up_handle);

        Ok(())
    }

    pub fn unmount(&mut self) -> Result<(), JsValue> {
        // Clear event handles (Drop trait will clean up)
        self.event_handles.clear();

        // Remove all layer elements
        if let Some(container) = &self.container {
            container.set_inner_html("");
        }

        self.layers.clear();
        self.container = None;
        self.document = None;
        self.selected_layer = None;

        Ok(())
    }

    pub fn select_layer(&mut self, index: usize) -> Result<(), JsValue> {
        if index >= self.layers.len() {
            return Ok(());
        }

        // Deselect previous
        if let Some(prev_idx) = self.selected_layer {
            self.layers[prev_idx].set_selected(false)?;
        }

        // Select new
        self.layers[index].set_selected(true)?;
        self.selected_layer = Some(index);

        // Sync position inputs
        self.sync_position_inputs()?;

        Ok(())
    }

    pub fn update_selected_position(&mut self, axis: &str, value: i32) -> Result<(), JsValue> {
        if let Some(idx) = self.selected_layer {
            let layer = &mut self.layers[idx];
            match axis {
                "x" => layer.set_position(value, layer.y)?,
                "y" => layer.set_position(layer.x, value)?,
                _ => {}
            }
        }
        Ok(())
    }

    pub fn bring_to_front(&mut self) -> Result<(), JsValue> {
        if let Some(idx) = self.selected_layer {
            let max_z = self.layers.iter().map(|l| l.z_index).max().unwrap_or(0);
            self.layers[idx].set_z_index(max_z + 1)?;
        }
        Ok(())
    }

    pub fn send_to_back(&mut self) -> Result<(), JsValue> {
        if let Some(idx) = self.selected_layer {
            let min_z = self.layers.iter().map(|l| l.z_index).min().unwrap_or(0);
            self.layers[idx].set_z_index(min_z - 1)?;
        }
        Ok(())
    }

    fn sync_position_inputs(&self) -> Result<(), JsValue> {
        if let (Some(doc), Some(idx)) = (&self.document, self.selected_layer) {
            let layer = &self.layers[idx];

            if let Some(x_input) = doc.query_selector("[data-wasm-sync='position-x']")? {
                if let Some(input) = x_input.dyn_ref::<HtmlElement>() {
                    input.set_attribute("value", &layer.x.to_string())?;
                }
            }

            if let Some(y_input) = doc.query_selector("[data-wasm-sync='position-y']")? {
                if let Some(input) = y_input.dyn_ref::<HtmlElement>() {
                    input.set_attribute("value", &layer.y.to_string())?;
                }
            }
        }
        Ok(())
    }
}
