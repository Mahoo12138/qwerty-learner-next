import { FC } from "react";
import { GlobeIcon } from 'lucide-react';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { locales } from "@/i18n";

interface Props {
  value: Locale;
  className?: string;
  onChange: (locale: Locale) => void;
}

// 如需自定义样式，可用 emotion/styled
// const StyledSelect = styled(Select)`
//   min-width: 180px;
// `;

const LocaleSelect: FC<Props> = ({ onChange, value, className }) => {
  const handleSelectChange = (_: any, newValue: Locale | null) => {
    if (newValue) onChange(newValue);
  };

  return (
    <Select
      value={value}
      onChange={handleSelectChange}
      startDecorator={
          <GlobeIcon fontSize="small" />
      }
      sx={{ minWidth: 180 }}
      className={className}
      placeholder="Language"
    >
      {locales.map((locale) => {
        const languageName = new Intl.DisplayNames([locale], {
          type: "language",
        }).of(locale);
        return (
          <Option key={locale} value={locale}>
            {languageName
              ? languageName.charAt(0).toUpperCase() + languageName.slice(1)
              : locale}
          </Option>
        );
      })}
    </Select>
  );
};

export default LocaleSelect;
