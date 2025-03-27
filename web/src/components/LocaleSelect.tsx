
import { RadioGroup } from '@headlessui/react'

// import { GlobeIcon } from "lucide-react";
import { FC } from "react";
import { locales } from "@/i18n";

interface Props {
  value: Locale;
  className?: string;
  onChange: (locale: Locale) => void;
}

const LocaleSelect: FC<Props> = (props: Props) => {
  const { onChange, value, className } = props;

  const handleSelectChange = async (locale: Locale) => {
    onChange(locale);
  };

  return (
    <RadioGroup
      className={`!min-w-[10rem] w-auto whitespace-nowrap ${className ?? ""}`}
      // startDecorator={<GlobeIcon className="w-4 h-auto" />}
      value={value}
      onChange={(value) => handleSelectChange(value as Locale)}
    >
      {locales.map((locale) => {
        try {
          const languageName = new Intl.DisplayNames([locale], { type: "language" }).of(locale);
          if (languageName) {
            return (
              <RadioGroup.Option key={locale} value={locale}>
                {languageName.charAt(0).toUpperCase() + languageName.slice(1)}
              </RadioGroup.Option>
            );
          }
        } catch (error) {
          // do nth
        }

        return (
          <RadioGroup.Option key={locale} value={locale}>
            {locale}
          </RadioGroup.Option>
        );
      })}
    </RadioGroup>
  );
};

export default LocaleSelect;
