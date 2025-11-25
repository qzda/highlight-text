import prolog from "@qzda/prolog";
import { displayName, version } from "../package.json";
import { isDev } from "./dev";

export function log(...arg: any[]) {
  console.log(
    prolog.bgBlack(prolog.brightYellow(`${displayName} v${version}`)),
    ...arg
  );
}

export function logError(...arg: any[]) {
  console.log(prolog.bgRed(`${displayName} ${version}`), ...arg);
}

export function devLog(...arg: any[]) {
  if (isDev) {
    log(...arg);
  }
}

export function devLogError(...arg: any[]) {
  if (isDev) {
    logError(...arg);
  }
}
