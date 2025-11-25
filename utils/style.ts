import { removeElementById } from "./element.ts";
import { name } from "../package.json";
import { devLog } from "./log.ts";

export function addStyles(id: string, css: string) {
  const styleID = `${name}-${id}`;
  const oldStyle = document.getElementById(styleID) as HTMLStyleElement | null;

  if (oldStyle) {
    if (oldStyle.textContent !== css) {
      oldStyle.textContent = css;
      devLog("update css");
    }
    return oldStyle;
  } else {
    const style = document.createElement("style");
    style.id = styleID;
    style.textContent = css;
    document.head.appendChild(style);
    devLog("add css");

    return style;
  }
}

export function removeStyles(id: string) {
  const styleID = `${name}-${id}`;

  removeElementById(styleID);
}
