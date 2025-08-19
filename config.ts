import { name, description, version } from "./package.json";

const icon = "https://github.com/qzda.png";

const userScriptUrl =
  "https://raw.githubusercontent.com/qzda/highlight-text/main/dist/highlight-text.user.js";

type configValue = string | number;

export const UserScriptConfig: Record<string, configValue | configValue[]> = {
  name,
  description,
  author: "qzda",
  version,
  match: "*://*/*",
  namespace: "https://github.com/qzda/highlight-text/",
  supportURL: "https://github.com/qzda/highlight-text/issues/new",
  downloadURL: userScriptUrl,
  updateURL: userScriptUrl,
  icon,
  copyright: "MIT",
  "run-at": "document-end",
  connect: ["raw.githubusercontent.com", "github.com"],
  grant: ["unsafeWindow", "GM_addStyle", "GM_addElement"],
};
