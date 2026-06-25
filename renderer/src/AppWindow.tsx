import React, { type ReactNode } from "react";

type WindowProps = {
  children: ReactNode;
};

const AppWindow = ({ children }: WindowProps) => {
  return (
    <div className="flex h-screen flex-col overflow-hidden text-white">
      <div
        className="flex h-10 items-center justify-between border-b border-white/10 bg-white px-4"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <div className="font-medium text-gray-800">Journal Entry</div>

        <div
          className="flex gap-2 text-gray-800"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <button onClick={() => window.api.minimize()}>—</button>
          <button onClick={() => window.api.toggleMaximize()}>z</button>
          <button onClick={() => window.api.close()}>✕</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#FAFAFA]">{children}</div>
    </div>
  );
};

export default AppWindow;
