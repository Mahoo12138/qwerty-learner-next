import AuthFooter from '@/components/AuthFooter';
import PasswordSignInForm from '@/components/PasswordSignInForm';
import { useTranslate } from "@/utils/i18n";
import { Link } from '@tanstack/react-router';
// import { useEffect } from "react";

const SignIn = () => {
  const t = useTranslate();

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
        {/* {!workspaceGeneralSetting.disallowPasswordAuth ? (
          <PasswordSignInForm />
        ) : (
          <p className="w-full text-2xl mt-2 dark:text-gray-500">
            Password auth is not allowed.
          </p>
        )} */}
        <PasswordSignInForm />
        {/* {!workspaceGeneralSetting.disallowUserRegistration &&
          !workspaceGeneralSetting.disallowPasswordAuth && (
            <p className="w-full mt-4 text-sm">
              <span className="dark:text-gray-500">
                {t("auth.sign-up-tip")}
              </span>
              <Link
                to="/auth/signup"
                className="cursor-pointer ml-2 text-blue-600 hover:underline"
                viewTransition
              >
                {t("common.sign-up")}
              </Link>
            </p>
          )} */}
        <p className="w-full mt-4 text-sm">
          <span className="dark:text-gray-500">{t("auth.sign-up-tip")}</span>
          <Link
            to="/auth/sign-up"
            className="cursor-pointer ml-2 text-blue-600 hover:underline"
            viewTransition
          >
            {t("common.sign-up")}
          </Link>
        </p>
        {/* {identityProviderList.length > 0 && (
          <>
            <Divider className="!my-4">{t("common.or")}</Divider>
            <div className="w-full flex flex-col space-y-2">
              {identityProviderList.map((identityProvider) => (
                <Button
                  className="bg-white dark:bg-black"
                  key={identityProvider.name}
                  variant="outlined"
                  fullWidth
                  onClick={() =>
                    handleSignInWithIdentityProvider(identityProvider)
                  }
                >
                  {t("common.sign-in-with", {
                    provider: identityProvider.title,
                  })}
                </Button>
              ))}
            </div>
          </>
        )} */}
      </div>
      <AuthFooter />
    </div>
  );
};

export default SignIn;
