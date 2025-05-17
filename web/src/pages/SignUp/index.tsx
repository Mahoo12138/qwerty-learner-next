import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import AuthFooter from "@/components/AuthFooter";
import useLoading from "@/hooks/useLoading";
import useNavigateTo from "@/hooks/useNavigateTo";
import { useTranslate } from "@/utils/i18n";
import { useGlobalStore } from '@/store/global';
import { Link } from '@tanstack/react-router';

const SignUp = () => {
  const t = useTranslate();
  const { statusData } = useGlobalStore();
  const navigateTo = useNavigateTo();
  const actionBtnLoadingState = useLoading(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value as string;
    setEmail(text);
  };

  const handlePasswordInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value as string;
    setPassword(text);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignUpButtonClick();
  };

  const handleSignUpButtonClick = async () => {
    console.log("email", email);
    if (email === "" || password === "") {
      return;
    }
    if (actionBtnLoadingState.isLoading) {
      return;
    }
    try {
      actionBtnLoadingState.setLoading();
      // await authServiceClient.signUp({ email, password });
      // await initialUserStore();
      navigateTo("/");
    } catch (error: any) {
      console.error(error);
      // toast.error((error as ClientError).details || "Sign up failed");
    }
    actionBtnLoadingState.setFinish();
  };

  return (
    <div className="py-4 sm:py-8 w-80 max-w-full min-h-[100svh] mx-auto flex flex-col justify-start items-center">
      <div className="w-full py-4 grow flex flex-col justify-center items-center">
        <div className="w-full flex flex-row justify-center items-center mb-6">
          <img
            className="h-14 w-auto"
            // src={workspaceGeneralSetting.customProfile?.logoUrl || "/logo.webp"}
            src={"/logo.webp"}
            alt=""
          />
          <p className="pb-2 ml-2 text-5xl text-black opacity-80 dark:text-gray-200">
            {/* {workspaceGeneralSetting.customProfile?.title || "Qwerty"} */}
            {"Qwerty"}
          </p>
        </div>
        <>
          <p className="w-full text-2xl mt-2 dark:text-gray-500">
            {t("auth.create-your-account")}
          </p>
          <form className="w-full mt-2" onSubmit={handleFormSubmit}>
            <div className="flex flex-col justify-start items-start w-full gap-4">
              <div className="w-full flex flex-col justify-start items-start">
                <span className="leading-8 text-gray-600">
                  {t("common.email")}
                </span>
                <Input
                  className="w-full bg-white dark:bg-black"
                  // size={}
                  type="email"
                  readOnly={actionBtnLoadingState.isLoading}
                  placeholder={t("common.email")}
                  value={email}
                  autoComplete="email"
                  autoCapitalize="off"
                  spellCheck={false}
                  onChange={handleEmailInputChanged}
                  required
                />
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <span className="leading-8 text-gray-600">
                  {t("common.password")}
                </span>
                <Input
                  className="w-full bg-white dark:bg-black"
                  // size="lg"
                  type="password"
                  readOnly={actionBtnLoadingState.isLoading}
                  placeholder={t("common.password")}
                  value={password}
                  autoComplete="password"
                  autoCapitalize="off"
                  spellCheck={false}
                  onChange={handlePasswordInputChanged}
                  required
                />
              </div>
            </div>
            <div className="flex flex-row justify-end items-center w-full mt-6">
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                disabled={actionBtnLoadingState.isLoading}
                onClick={handleSignUpButtonClick}
              >
                {t("common.sign-up")}
                {actionBtnLoadingState.isLoading && (
                  <LoaderIcon className="w-5 h-auto ml-2 animate-spin opacity-60" />
                )}
              </Button>
            </div>
          </form>
        </>
        {!statusData?.host ? (
          <p className="w-full mt-4 text-sm font-medium dark:text-gray-500">
            {t("auth.host-tip")}
          </p>
        ) : (
          <p className="w-full mt-4 text-sm">
            <span className="dark:text-gray-500">{t("auth.sign-in-tip")}</span>
            <Link
              to="/auth/sign-in"
              className="cursor-pointer ml-2 text-blue-600 hover:underline"
              viewTransition
            >
              {t("common.sign-in")}
            </Link>
          </p>
        )}
      </div>
      <AuthFooter />
    </div>
  );
};

export default SignUp;
