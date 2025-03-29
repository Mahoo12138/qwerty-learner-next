// import { workspaceStore } from "@/store/workspace";
import { cn } from "@/utils/ui";
import AppearanceSelect from "./AppearanceSelect";
import LocaleSelect from "./LocaleSelect";
import { useGlobalStore } from "@/store/global";

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
    <div
      className={cn(
        "mt-4 flex flex-row items-center justify-center w-full gap-2",
        className
      )}
    >
      <LocaleSelect value={locale} onChange={handleLocaleSelectChange} />
      <AppearanceSelect
        value={appearance as Appearance}
        onChange={handleAppearanceSelectChange}
      />
    </div>
  );
};

export default AuthFooter;
