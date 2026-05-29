import { useState } from "react";
import AppWindow from "./components/AppWindow";

function App() {
  return (
    <AppWindow>
      <div className="h-full w-full flex flex-row items-center justify-center gap-20">
        <button type="button" className="p-4 text-xl text-gray-200 rounded-lg border border-gray-800">
          Select excel file to store forms
        </button>
        <button type="button" className="p-4 text-xl text-gray-200 rounded-lg border border-gray-800">
          Select excel file to store forms
        </button>
      </div>
    </AppWindow>
  );
}

export default App;
