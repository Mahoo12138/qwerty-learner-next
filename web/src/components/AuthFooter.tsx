// import { workspaceStore } from "@/store/workspace";
import AppearanceSelect from "./AppearanceSelect";
import LocaleSelect from "./LocaleSelect";
import { useGlobalStore } from "@/store/global";
import { Box, Stack } from '@mui/joy';

interface Props {
  className?: string;
}
const AuthFooter = ({ className }: Props) => {
  const { locale, appearance, setLocale, setAppearance } = useGlobalStore();
  const handleLocaleSelectChange = (locale: Locale) => {
    setLocale(locale);
  };

  const handleAppearanceSelectChange = (appearance: Appearance) => {
    setAppearance(appearance);
  };

  return (
    <Box
      sx={{
        width: 320,
        maxWidth: '100%',
        mx: 'auto',
        mt: 2,
        mb: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
      className={className}
    >
      <Stack direction="row" spacing={2} width="100%" justifyContent="center" alignItems="center">
        <LocaleSelect value={locale} onChange={handleLocaleSelectChange} />
        <AppearanceSelect
          value={appearance as Appearance}
          onChange={handleAppearanceSelectChange}
        />
      </Stack>
    </Box>
  );
};

export default AuthFooter;
