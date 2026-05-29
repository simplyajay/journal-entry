export {};

declare global {
  interface Window {
    electron: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
    };
  }
}
