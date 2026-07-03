import LoginForm from "@/components/form/login/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-full w-full justify-center overflow-y-auto bg-white p-12">
      <div className="flex min-h-full items-center justify-center">
        <div className="mx-auto w-100">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
