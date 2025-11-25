// ==UserScript==
// @name Highlight Text
// @description Highlight your selected text in web
// @author qzda
// @version 0.0.1
// @match *://*/*
// @namespace https://github.com/qzda/highlight-text/
// @supportURL https://github.com/qzda/highlight-text/issues/new
// @downloadURL https://raw.githubusercontent.com/qzda/highlight-text/main/dist/highlight-text.user.js
// @updateURL https://raw.githubusercontent.com/qzda/highlight-text/main/dist/highlight-text.user.js
// @icon https://github.com/qzda.png
// @copyright MIT
// @run-at document-end
// @connect raw.githubusercontent.com
// @connect github.com
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_addElement
// @grant GM_registerMenuCommand
// ==/UserScript==

// ../node_modules/@qzda/prolog/dist/index.js
var Colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97
};
var Backgrounds = {
  bgBlack: 40,
  bgRed: 41,
  bgGreen: 42,
  bgYellow: 43,
  bgBlue: 44,
  bgMagenta: 45,
  bgCyan: 46,
  bgWhite: 47,
  bgGray: 100,
  bgBrightBlack: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107
};
var OtherStyles = {
  bold: 1,
  italic: 3,
  underline: 4
};
var Obj = Object.assign(Object.assign(Object.assign({}, Object.keys(Colors).reduce((_obj, color) => {
  _obj[color] = (str) => `\x1B[${Colors[color]}m${str}\x1B[0m`;
  return _obj;
}, {})), Object.keys(Backgrounds).reduce((_obj, bg) => {
  _obj[bg] = (str) => `\x1B[${Backgrounds[bg]}m${str}\x1B[0m`;
  return _obj;
}, {})), Object.keys(OtherStyles).reduce((_obj, style) => {
  _obj[style] = (str) => `\x1B[${OtherStyles[style]}m${str}\x1B[0m`;
  return _obj;
}, {}));
var dist_default = Obj;

// ../package.json
var name = "highlight-text";
var displayName = "Highlight Text";
var version = "0.0.1";

// ../utils/dev.ts
var isDev = false;

// ../utils/log.ts
function log(...arg) {
  console.log(dist_default.bgBlack(dist_default.brightYellow(`${displayName} v${version}`)), ...arg);
}
function devLog(...arg) {
  if (isDev) {
    log(...arg);
  }
}

// ../utils/style.ts
function addStyles(id, css) {
  const styleID = `${name}-${id}`;
  const oldStyle = document.getElementById(styleID);
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

// initMenuCommand.ts
function initMenuCommand() {
  GM_registerMenuCommand("Clear All", function(event) {
    document.querySelectorAll(`span.${name}.colored`).forEach((span) => {
      const textNode = document.createTextNode(span.textContent);
      span.replaceWith(textNode);
    });
  }, {
    autoClose: true
  });
  devLog("initMenuCommand");
}

// index.ts
log();
initMenuCommand();
var colors = ["red", "yellow", "green", "blue", "#8e44ad"];
var toolbarCSS = `
  .${name}.toolbar {
    position: absolute;
    background: #fff;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    display: flex;
    gap: 6px;
    opacity: 0;
    transform: translateY(8px);
    animation: ${name}-fadeInUp 0.2s ease-out forwards;
  }

  .${name}.toolbar .option {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #ccc;

    text-align: center;
  }

  .${name}.toolbar .reset {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes ${name}-fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
var currentToolbar = null;
var savedRange;
document.addEventListener("mouseup", (e) => {
  if (e.target.closest?.(`.${name}.toolbar`)) {
    return;
  }
  const selection = window.getSelection();
  const text = selection?.toString().trim();
  if (!selection?.isCollapsed && text) {
    devLog("select text", text);
    addStyles("toolbar", toolbarCSS);
    if (currentToolbar) {
      currentToolbar.remove();
      currentToolbar = null;
    }
    savedRange = selection?.getRangeAt(0).cloneRange();
    const textNode = savedRange?.startContainer;
    if (textNode && textNode?.nodeName === "#text") {
      const toolbar = document.createElement("div");
      toolbar.className = `${name} toolbar`;
      colors.forEach((color, colorIndex) => {
        const option = document.createElement("div");
        option.className = `${name} option`;
        option.style.background = color;
        option.onclick = () => {
          if (!savedRange)
            return;
          const selectedTextString = savedRange.toString();
          const className = `${name} colored color-${colorIndex}`;
          if (textNode.parentNode?.nodeName === "SPAN" && textNode.parentNode?.className.includes(name) && textNode.parentNode?.className.includes("colored")) {
            textNode.parentNode.style.backgroundColor = color;
          } else {
            const span = document.createElement("span");
            span.className = className;
            span.style.backgroundColor = color;
            span.textContent = selectedTextString;
            savedRange?.deleteContents();
            savedRange?.insertNode(span);
          }
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
          let node;
          while (node = walker.nextNode()) {
            if (node.nodeName === "#text" && node.nodeValue?.includes(savedRange.toString())) {
              const parent = node.parentNode;
              if (parent.classList.contains("colored"))
                continue;
              const frag = document.createDocumentFragment();
              const parts = node.nodeValue.split(savedRange.toString());
              parts.forEach((part, index) => {
                frag.appendChild(document.createTextNode(part));
                if (index < parts.length - 1) {
                  const span = document.createElement("span");
                  span.className = `${name} colored color-${colorIndex}`;
                  span.style.backgroundColor = color;
                  span.textContent = savedRange.toString();
                  frag.appendChild(span);
                }
              });
              parent.replaceChild(frag, node);
            }
          }
          toolbar.remove();
          currentToolbar = null;
          savedRange = undefined;
          selection?.removeAllRanges();
        };
        toolbar.appendChild(option);
      });
      if (textNode?.nodeName === "#text" && textNode?.parentNode?.nodeName === "SPAN" && (textNode?.parentNode).classList.contains(name) && (textNode?.parentNode).classList.contains("colored")) {
        const reset = document.createElement("div");
        reset.className = "option reset";
        reset.textContent = "X";
        reset.onclick = () => {
          document.querySelectorAll(`span.${textNode.parentNode.className.replaceAll(" ", ".")}`).forEach((span) => {
            const textNode2 = document.createTextNode(span.textContent);
            span.replaceWith(textNode2);
          });
          toolbar.remove();
          currentToolbar = null;
          savedRange = undefined;
          selection?.removeAllRanges();
        };
        toolbar.appendChild(reset);
      }
      const rect = savedRange?.getBoundingClientRect();
      if (rect) {
        toolbar.style.left = `${rect.left + window.scrollX}px`;
        toolbar.style.top = `${rect.top + window.scrollY - 40}px`;
        currentToolbar = toolbar;
      }
      document.body.appendChild(toolbar);
    }
  }
});
document.addEventListener("click", (e) => {
  if (currentToolbar && !e.target.closest(".toolbar") && !window.getSelection()?.toString().trim()) {
    currentToolbar.remove();
    currentToolbar = null;
    savedRange = undefined;
  }
});
