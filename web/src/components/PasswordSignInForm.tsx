import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import useLoading from "@/hooks/useLoading";
import useNavigateTo from "@/hooks/useNavigateTo";
// import { workspaceStore } from "@/store/v2";
import { useTranslate } from "@/utils/i18n";
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { Button, Checkbox, Input, Box, Stack, Typography } from '@mui/joy';

const PasswordSignInForm = () => {
  const t = useTranslate();
  const navigateTo = useNavigateTo();
  const { setToken } = useAuthStore()
  const actionBtnLoadingState = useLoading(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      return data.data;
    },
    onSuccess: (data) => {
      setToken(data)
      navigateTo("/");
    },
    onError: (error: Error) => {
      // toast.error(error.message || "Failed to sign in.");
    },
  });

  const handleUsernameInputChanged = (
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
    handleSignInButtonClick();
  };

  const handleSignInButtonClick = async () => {
    if (email === "" || password === "") {
      return;
    }

    if (actionBtnLoadingState.isLoading) {
      return;
    }

    try {
      actionBtnLoadingState.setLoading();
      await loginMutation.mutateAsync({ email, password });
    } catch (error: any) {
      // toast.error(error.message || "Failed to sign in.");
    } finally {
      actionBtnLoadingState.setFinish();
    }
  };

  return (
    <Box component="form" sx={{ width: '100%', mt: 2 }} onSubmit={handleFormSubmit}>
      <Stack spacing={2} alignItems="flex-start" width="100%">
        <Box width="100%">
          <Typography level="body-sm" sx={{ lineHeight: 2, color: 'text.tertiary' }}>
            {t("common.email")}
          </Typography>
          <Input
            fullWidth
            type="email"
            readOnly={actionBtnLoadingState.isLoading}
            placeholder={t("common.email")}
            value={email}
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            onChange={handleUsernameInputChanged}
            required
            sx={{ bgcolor: 'background.body' }}
          />
        </Box>
        <Box width="100%">
          <Typography level="body-sm" sx={{ lineHeight: 2, color: 'text.tertiary' }}>
            {t("common.password")}
          </Typography>
          <Input
            fullWidth
            type="password"
            readOnly={actionBtnLoadingState.isLoading}
            placeholder={t("common.password")}
            value={password}
            autoComplete="password"
            autoCapitalize="off"
            spellCheck={false}
            onChange={handlePasswordInputChanged}
            required
            sx={{ bgcolor: 'background.body' }}
          />
        </Box>
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', width: '100%', mt: 3, gap: 2 }}>
        <Checkbox
          label={t("common.remember-me")}
          checked={remember}
          onChange={(e) => setRemember(!!e.target.checked)}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', width: '100%', mt: 6 }}>
        <Button
          type="submit"
          color="primary"
          size="lg"
          fullWidth
          disabled={actionBtnLoadingState.isLoading}
          onClick={handleSignInButtonClick}
          startDecorator={actionBtnLoadingState.isLoading ? <LoaderIcon style={{ width: 20, height: 'auto', marginRight: 8, animation: 'spin 1s linear infinite', opacity: 0.6 }} /> : undefined}
        >
          {t("common.sign-in")}
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordSignInForm;
