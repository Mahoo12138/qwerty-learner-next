declare module "*.png" {
  const url: string;
  export default url;
}
declare module "*.wav" {
  const url: string;
  export default url;
}

declare type Locale = string;
declare type Appearance = "system" | "light" | "dark";
