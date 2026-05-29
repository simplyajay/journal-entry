import React, { type ReactNode } from "react";

type WindowProps = {
  children: ReactNode;
};

const AppWindow = ({ children }: WindowProps) => {
  return (
    <div className="h-screen  overflow-hidden  text-white">
      <div
        className="h-10 flex items-center justify-between px-4 bg-white border-b border-white/10"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <div className="font-medium text-gray-800">Journal Entry</div>

        <div className="flex gap-2 text-gray-800" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
          <button onClick={() => window.electron.minimize()}>—</button>
          <button onClick={() => window.electron.toggleMaximize()}>z</button>
          <button onClick={() => window.electron.close()}>✕</button>
        </div>
      </div>

      <div className="h-[calc(100vh-40px)] bg-[#007d87] overflow-auto">{children}</div>
    </div>
  );
};

export default AppWindow;
