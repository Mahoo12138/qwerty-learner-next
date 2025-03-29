

import { FC } from "react";
import { GlobeIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <Select
      onValueChange={(value) => handleSelectChange(value as Locale)}
      value={value}
    >
      <SelectTrigger className="w-[180px]">
      <GlobeIcon className="w-4 h-auto" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent
        className={`!min-w-[10rem] w-auto whitespace-nowrap ${className ?? ""}`}
      >
        {locales.map((locale) => {
          const languageName = new Intl.DisplayNames([locale], {
            type: "language",
          }).of(locale);
          if (languageName) {
            return (
              <SelectItem key={locale} value={locale}>
                 {languageName.charAt(0).toUpperCase() + languageName.slice(1)}
              </SelectItem>
            );
          }
          return (
            <SelectItem key={locale} value={locale}>
              {locale}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default LocaleSelect;
