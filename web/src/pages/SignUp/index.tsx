import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import AuthFooter from "@/components/AuthFooter";
import useLoading from "@/hooks/useLoading";
import useNavigateTo from "@/hooks/useNavigateTo";
import { useTranslate } from "@/utils/i18n";
import { useGlobalStore } from '@/store/global';
import { Link } from '@tanstack/react-router';
import { Button, Input, Box, Stack, Typography } from "@mui/joy";

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
      // toast.error((error as ClientError).details || "Sign up failed");
    }
    actionBtnLoadingState.setFinish();
  };

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 8 },
        width: 320,
        maxWidth: '100%',
        minHeight: '100svh',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mb: 6 }}>
          <img
            style={{ height: 56, width: 'auto' }}
            src={"/logo.webp"}
            alt=""
          />
          <Typography level="h1" sx={{ pb: 2, ml: 2, fontSize: 40, color: 'text.primary', opacity: 0.8 }}>
            {"Qwerty"}
          </Typography>
        </Box>
        <>
          <Typography level="h2" sx={{ width: '100%', fontSize: 24, mt: 2, color: 'text.secondary' }}>
            {t("auth.create-your-account")}
          </Typography>
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
                  onChange={handleEmailInputChanged}
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
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', width: '100%', mt: 6 }}>
              <Button
                type="submit"
                color="primary"
                size="lg"
                fullWidth
                disabled={actionBtnLoadingState.isLoading}
                onClick={handleSignUpButtonClick}
                startDecorator={actionBtnLoadingState.isLoading ? <LoaderIcon style={{ width: 20, height: 'auto', marginRight: 8, animation: 'spin 1s linear infinite', opacity: 0.6 }} /> : undefined}
              >
                {t("common.sign-up")}
              </Button>
            </Box>
          </Box>
        </>
        {!statusData?.host ? (
          <Typography level="body-sm" sx={{ width: '100%', mt: 4, color: 'text.tertiary', fontWeight: 500 }}>
            {t("auth.host-tip")}
          </Typography>
        ) : (
          <Typography level="body-sm" sx={{ width: '100%', mt: 4 }}>
            <span style={{ color: 'var(--joy-palette-text-tertiary)' }}>{t("auth.sign-in-tip")}</span>
            <Link
              to="/auth/sign-in"
              style={{ cursor: 'pointer', marginLeft: 8, color: '#2563eb', textDecoration: 'underline' }}
              viewTransition
            >
              {t("common.sign-in")}
            </Link>
          </Typography>
        )}
      </Box>
      <AuthFooter />
    </Box>
  );
};

export default SignUp;
