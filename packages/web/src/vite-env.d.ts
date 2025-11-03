/// <reference types="node" />

// CSS module declarations
declare module '*.css' {
  const content: string;
  export default content;
}

// Allow importing CSS as side effects
declare module '*.css?inline' {
  const content: string;
  export default content;
}
