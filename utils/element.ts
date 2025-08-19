import { devLog } from "./log";
import { addStyles, removeStyles } from "./style";

export function removeElementById(id: string) {
  document.getElementById(id)?.remove();
}

export function removeElement(selector: string) {
  document.querySelector(selector)?.remove();
}

export function hiddenBody(hidden: boolean) {
  if (hidden) {
    addStyles("body", "body { opacity: 0; };");
  } else {
    removeStyles("body");
  }
  devLog("hiddenBody", hidden);
}

export function queryElementByXPath(
  xpath: string,
  contextNode: Node = document
) {
  const element = document.evaluate(
    xpath,
    contextNode,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  return element;
}

export function queryElementByXPathAll(
  xpath: string,
  contextNode: Node = document
) {
  const elements = document.evaluate(
    xpath,
    contextNode,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  return elements;
}
