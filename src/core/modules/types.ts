import type { ComponentType } from "react";

export type ModuleArea = "rail" | "overlay";

export type AppModule = {
  id: string;
  title: string;
  description: string;
  area: ModuleArea;
  defaultOpen?: boolean;
  Component: ComponentType;
};
