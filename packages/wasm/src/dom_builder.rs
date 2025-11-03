use wasm_bindgen::JsValue;
use wasm_bindgen::JsCast;
use web_sys::{Document, Element, HtmlElement};

pub struct DomBuilder {
    element: Element,
}

impl DomBuilder {
    pub fn create(doc: &Document, tag: &str) -> Result<Self, JsValue> {
        let element = doc.create_element(tag)?;
        Ok(DomBuilder { element })
    }

    pub fn id(self, id: &str) -> Result<Self, JsValue> {
        self.element.set_id(id);
        Ok(self)
    }

    pub fn class(self, class: &str) -> Result<Self, JsValue> {
        self.element.set_class_name(class);
        Ok(self)
    }

    pub fn style(self, property: &str, value: &str) -> Result<Self, JsValue> {
        if let Some(html_element) = self.element.dyn_ref::<HtmlElement>() {
            html_element.style().set_property(property, value)?;
        }
        Ok(self)
    }

    pub fn attr(self, name: &str, value: &str) -> Result<Self, JsValue> {
        self.element.set_attribute(name, value)?;
        Ok(self)
    }

    pub fn text(self, text: &str) -> Result<Self, JsValue> {
        self.element.set_text_content(Some(text));
        Ok(self)
    }

    pub fn build(self) -> Element {
        self.element
    }

    pub fn build_html(self) -> Option<HtmlElement> {
        self.element.dyn_into::<HtmlElement>().ok()
    }
}
