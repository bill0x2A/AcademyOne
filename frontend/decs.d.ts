declare module "react-identicons";

declare module "react-rich-diff";

declare module "markup-it";

declare module "markup-it/libs/markdown";

declare module "*.svg" {
    const content: any;
    export default content;
  }

  declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.sass' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}