import LoginForm from "@/components/form/login/LoginForm";
import RegisterForm from "@/components/form/register/RegisterForm";
import { Button } from "@/components/common/ui/button";
import { useState } from "react";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="relative h-130 w-full max-w-5xl">
        <div className="absolute inset-0 flex overflow-hidden rounded-xl bg-slate-700">
          <div className="flex w-1/3 flex-col items-center justify-center gap-4 text-white">
            <h2 className="text-2xl font-semibold">Welcome Back</h2>

            {mode === "register" && (
              <Button variant="outline" onClick={() => setMode("login")}>
                Login
              </Button>
            )}
          </div>

          <div className="flex w-2/3 flex-col items-center justify-center gap-4 text-white">
            <h2 className="text-2xl font-semibold">Create Account</h2>

            {mode === "login" && (
              <Button variant="outline" onClick={() => setMode("register")}>
                Register
              </Button>
            )}
          </div>
        </div>

        <div
          className={`absolute -top-5 z-10 h-115 w-[55%] rounded-xl bg-white p-8 shadow-2xl transition-all duration-500 ease-in-out ${
            mode === "login" ? "left-0" : "left-[45%]"
          } `}
        >
          <div
            className="h-full w-full transition-opacity duration-300"
            key={mode}
          >
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
