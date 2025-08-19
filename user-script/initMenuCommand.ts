import { devLog } from "../utils/log";

export function initMenuCommand() {
  // @ts-ignore
  GM_registerMenuCommand(
    "选项1",
    function (event: MouseEvent | KeyboardEvent) {
      // todo
    },
    {
      autoClose: false,
    }
  );

  devLog("initMenuCommand");
}
