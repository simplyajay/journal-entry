import React, { type ReactNode } from "react";
import { X } from "lucide-react";
import { Maximize } from "lucide-react";
import { MinusIcon } from "lucide-react";

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
          <button onClick={() => window.api.window.minimize()}>
            <MinusIcon className="hover:cursor-pointer" size={18} />
          </button>
          <button onClick={() => window.api.window.toggleMaximize()}>
            <Maximize className="hover:cursor-pointer" size={15} />
          </button>
          <button onClick={() => window.api.window.close()}>
            <X className="hover:cursor-pointer" size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">{children}</div>
    </div>
  );
};

export default AppWindow;
