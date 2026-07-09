import * as net from 'node:net';

export const noop = () => {};

export const sleep = async (ms: number) => new Promise(resolve => {
  setTimeout(resolve, ms);
});

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return () => {
    if (!timeout) {
      timeout = setTimeout(() => {
        func();
      }, wait);
    }
  };
};

export const logAddress = (socket: net.Socket) => {
  return `${socket.remoteAddress}:${socket.remotePort}`;
};

export const sigmoid = (x: number, k: number = 12) => {
  const low = 1 / (1 + Math.exp(-k * (0 - 0.5)));
  const high = 1 / (1 + Math.exp(-k * (1 - 0.5)));
  const result = 1 / (1 + Math.exp(-k * (x - 0.5)));
  return (result - low) / (high - low);
};