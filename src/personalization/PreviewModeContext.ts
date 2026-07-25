import { createContext, useContext } from "react";

export const PreviewModeContext = createContext(false);

export function usePreviewMode(): boolean {
  return useContext(PreviewModeContext);
}
