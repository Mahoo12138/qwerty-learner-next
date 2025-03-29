import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useLoading from "@/hooks/useLoading";
import useNavigateTo from "@/hooks/useNavigateTo";
// import { workspaceStore } from "@/store/v2";
import { useTranslate } from "@/utils/i18n";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useMutation } from '@tanstack/react-query';

const PasswordSignInForm = () => {
  const t = useTranslate();
  const navigateTo = useNavigateTo();

  const actionBtnLoadingState = useLoading(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);


  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      navigateTo("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in.");
    },
  });

  const handleUsernameInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value as string;
    setUsername(text);
  };

  const handlePasswordInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = e.target.value as string;
    setPassword(text);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignInButtonClick();
  };

  const handleSignInButtonClick = async () => {
    if (username === "" || password === "") {
      return;
    }

    if (actionBtnLoadingState.isLoading) {
      return;
    }

    try {
      actionBtnLoadingState.setLoading();
      await loginMutation.mutateAsync({ username, password });
    } catch (error: any) {
      console.error(error);
    } finally {
      actionBtnLoadingState.setFinish();
    }
  };

  return (
    <form className="w-full mt-2" onSubmit={handleFormSubmit}>
      <div className="flex flex-col justify-start items-start w-full gap-4">
        <div className="w-full flex flex-col justify-start items-start">
          <span className="leading-8 text-gray-600">
            {t("common.username")}
          </span>
          <Input
            className="w-full bg-white dark:bg-black"
            size={24}
            type="text"
            readOnly={actionBtnLoadingState.isLoading}
            placeholder={t("common.username")}
            value={username}
            autoComplete="username"
            autoCapitalize="off"
            spellCheck={false}
            onChange={handleUsernameInputChanged}
            required
          />
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <span className="leading-8 text-gray-600">
            {t("common.password")}
          </span>
          <Input
            className="w-full bg-white dark:bg-black"
            size={24}
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
      <div className="flex flex-row justify-start items-center w-full mt-6 gap-2">
        <Checkbox
          checked={remember}
          onCheckedChange={(e) => setRemember(!!e.valueOf())}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("common.remember-me")}
        </label>
      </div>
      <div className="flex flex-row justify-end items-center w-full mt-6">
        <Button
          type="submit"
          color="primary"
          size="lg"
          className='w-full'
          disabled={actionBtnLoadingState.isLoading}
          onClick={handleSignInButtonClick}
        >
          {t("common.sign-in")}
          {actionBtnLoadingState.isLoading && (
            <LoaderIcon className="w-5 h-auto ml-2 animate-spin opacity-60" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default PasswordSignInForm;
