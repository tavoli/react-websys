use wasm_bindgen::JsValue;
use web_sys::HtmlElement;

pub struct Layer {
    pub id: usize,
    pub x: i32,
    pub y: i32,
    pub z_index: i32,
    pub selected: bool,
    pub element: Option<HtmlElement>,
}

impl Layer {
    pub fn new(id: usize, x: i32, y: i32, z_index: i32) -> Self {
        Layer {
            id,
            x,
            y,
            z_index,
            selected: false,
            element: None,
        }
    }

    pub fn set_position(&mut self, x: i32, y: i32) -> Result<(), JsValue> {
        self.x = x;
        self.y = y;
        self.update_element_style()?;
        Ok(())
    }

    pub fn set_z_index(&mut self, z_index: i32) -> Result<(), JsValue> {
        self.z_index = z_index;
        self.update_element_style()?;
        Ok(())
    }

    pub fn set_selected(&mut self, selected: bool) -> Result<(), JsValue> {
        self.selected = selected;
        if let Some(element) = &self.element {
            element.set_attribute("data-selected", if selected { "true" } else { "false" })?;
        }
        Ok(())
    }

    pub fn update_element_style(&self) -> Result<(), JsValue> {
        if let Some(element) = &self.element {
            let style = element.style();
            style.set_property("left", &format!("{}px", self.x))?;
            style.set_property("top", &format!("{}px", self.y))?;
            style.set_property("z-index", &self.z_index.to_string())?;
        }
        Ok(())
    }

    pub fn set_element(&mut self, element: HtmlElement) {
        self.element = Some(element);
    }
}
