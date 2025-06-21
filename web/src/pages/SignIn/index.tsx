import AuthFooter from '@/components/AuthFooter';
import PasswordSignInForm from '@/components/PasswordSignInForm';
import { useTranslate } from "@/utils/i18n";
import { Link } from '@tanstack/react-router';
import { Box, Typography } from '@mui/joy';

const SignIn = () => {
  const t = useTranslate();

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
            Qwerty
          </Typography>
        </Box>
        <PasswordSignInForm />
        <Typography level="body-sm" sx={{ width: '100%', mt: 4 }}>
          <span style={{ color: 'var(--joy-palette-text-tertiary)' }}>{t("auth.sign-up-tip")}</span>
          <Link
            to="/auth/sign-up"
            style={{ cursor: 'pointer', marginLeft: 8, color: '#2563eb', textDecoration: 'underline' }}
            viewTransition
          >
            {t("common.sign-up")}
          </Link>
        </Typography>
      </Box>
      <AuthFooter />
    </Box>
  );
};

export default SignIn;
