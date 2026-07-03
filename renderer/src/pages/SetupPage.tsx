import SetupForm from "@/components/form/setup/SetupForm";

const SetupPage = () => {
  return (
    <div className="flex min-h-full w-full justify-center overflow-y-auto bg-white p-12">
      <div className="flex min-h-full items-center justify-center">
        <div className="mx-auto w-200">
          <SetupForm />
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
