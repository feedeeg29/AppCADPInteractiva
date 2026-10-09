/// <reference lib="webworker" />
import { execute, type Request } from "./run";

self.onmessage = (ev: MessageEvent<Request>) => {
  self.postMessage(execute(ev.data));
};
