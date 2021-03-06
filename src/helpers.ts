import { join } from '../deps.ts';
import { WebSocketMessage } from './types.ts';

export function copyObj<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function parseMessage(message: string) {
  return JSON.parse(message) as WebSocketMessage;
}

export function stringifyMessage(message: Omit<WebSocketMessage, 'result'>) {
  return JSON.stringify(message);
}

export function joinAndEscape(...paths: string[]) {
  return join(
    ...join(...paths).split(/\/|\\/g)
      .map((e) => e.includes(' ') ? `"${e}"` : e),
  );
}
