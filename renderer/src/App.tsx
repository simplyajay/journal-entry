import AppWindow from "./components/AppWindow";
import JevForm from "./components/form/jev/JevForm";

function App() {
  return (
    <AppWindow>
      <div className="px-4 py-6">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-4">
          <JevForm />
        </div>
      </div>
    </AppWindow>
  );
}

export default App;
