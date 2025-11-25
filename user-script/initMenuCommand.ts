import { devLog } from "../utils/log";
import { name } from "../package.json";

export function initMenuCommand() {
  GM_registerMenuCommand(
    "Clear All",
    function (event: MouseEvent | KeyboardEvent) {
      document.querySelectorAll(`span.${name}.colored`).forEach((span) => {
        const textNode = document.createTextNode(span.textContent);
        span.replaceWith(textNode);
      });
    },
    {
      autoClose: true,
    }
  );

  devLog("initMenuCommand");
}
