"use strict";
import { devLog, log } from "../utils/log";
import { addStyles } from "../utils/style";
import { initMenuCommand } from "./initMenuCommand";
import { name } from "../package.json";

log();
initMenuCommand();

// 预设颜色列表
const colors = ["red", "yellow", "green", "blue", "#8e44ad"];

const toolbarCSS = `
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

let currentToolbar: HTMLDivElement | null = null;
let savedRange: Range | undefined; // 用来保存当前选区

document.addEventListener("mouseup", (e) => {
  // 如果点击的是工具条内部元素，跳过
  if ((e.target as Element).closest?.(`.${name}.toolbar`)) {
    return;
  }

  const selection = window.getSelection();
  const text = selection?.toString().trim();

  if (!selection?.isCollapsed && text) {
    devLog("select text", text);

    addStyles("toolbar", toolbarCSS);

    // 移除旧的工具条
    if (currentToolbar) {
      currentToolbar.remove();
      currentToolbar = null;
    }

    // 保存当前选区
    savedRange = selection?.getRangeAt(0).cloneRange();
    // 选中的文字
    const textNode = savedRange?.startContainer;

    if (textNode && textNode?.nodeName === "#text") {
      // 创建工具条
      const toolbar = document.createElement("div");
      toolbar.className = `${name} toolbar`;

      // 颜色选项
      colors.forEach((color, colorIndex) => {
        const option = document.createElement("div");
        option.className = `${name} option`;
        option.style.background = color;

        option.onclick = () => {
          if (!savedRange) return;

          const selectedTextString = savedRange.toString();
          const className = `${name} colored color-${colorIndex}`;

          if (
            textNode.parentNode?.nodeName === "SPAN" &&
            (textNode.parentNode as HTMLSpanElement)?.className.includes(
              name
            ) &&
            (textNode.parentNode as HTMLSpanElement)?.className.includes(
              "colored"
            )
          ) {
            (textNode.parentNode as HTMLSpanElement).style.backgroundColor =
              color;
          } else {
            const span = document.createElement("span");
            span.className = className;
            span.style.backgroundColor = color;
            span.textContent = selectedTextString;

            savedRange?.deleteContents();
            savedRange?.insertNode(span);
          }

          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
          );

          let node: Node | null;
          while ((node = walker.nextNode())) {
            if (
              node.nodeName === "#text" &&
              node.nodeValue?.includes(savedRange.toString())
            ) {
              const parent = node.parentNode as HTMLElement;

              // 避免重复包裹已经有 colored 的文本
              if (parent.classList.contains("colored")) continue;

              const frag = document.createDocumentFragment();
              const parts = node.nodeValue.split(savedRange.toString());

              parts.forEach((part, index) => {
                frag.appendChild(document.createTextNode(part));
                if (index < parts.length - 1) {
                  const span = document.createElement("span");
                  span.className = `${name} colored color-${colorIndex}`;
                  span.style.backgroundColor = color;
                  span.textContent = savedRange!.toString();
                  frag.appendChild(span);
                }
              });

              parent.replaceChild(frag, node);
            }
          }

          // 清理
          toolbar.remove();
          currentToolbar = null;
          savedRange = undefined;

          // 清除高亮选区
          selection?.removeAllRanges();
        };

        toolbar.appendChild(option);
      });

      // 判断选中的文本已经被 span.colored 包裹的时候，才执行
      if (
        textNode?.nodeName === "#text" &&
        textNode?.parentNode?.nodeName === "SPAN" &&
        (textNode?.parentNode as HTMLSpanElement).classList.contains(name) &&
        (textNode?.parentNode as HTMLSpanElement).classList.contains("colored")
      ) {
        // 恢复默认颜色选项
        const reset = document.createElement("div");
        reset.className = "option reset";
        reset.textContent = "X";
        reset.onclick = () => {
          // 找出页面所有相同颜色的 span.colored.color-1，替换成纯文本
          document
            .querySelectorAll(
              `span.${(
                textNode.parentNode as HTMLSpanElement
              ).className.replaceAll(" ", ".")}`
            )
            .forEach((span) => {
              const textNode = document.createTextNode(span.textContent);
              span.replaceWith(textNode);
            });

          toolbar.remove();
          currentToolbar = null;
          savedRange = undefined;
          selection?.removeAllRanges();
        };
        toolbar.appendChild(reset);
      }

      // 定位工具条
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

// 点击空白处时清除工具条
document.addEventListener("click", (e) => {
  if (
    currentToolbar &&
    !(e.target as HTMLElement).closest(".toolbar") &&
    !window.getSelection()?.toString().trim()
  ) {
    currentToolbar.remove();
    currentToolbar = null;
    savedRange = undefined;
  }
});
