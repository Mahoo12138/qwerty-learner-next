import { SunIcon, MoonIcon, SmileIcon } from "lucide-react";
import { FC } from "react";
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import styled from '@emotion/styled';
import { useTranslate } from "@/utils/i18n";

interface Props {
  value: Appearance;
  onChange: (appearance: Appearance) => void;
  className?: string;
}

const appearanceList = ["system", "light", "dark"] as const;

const iconStyle = { width: 20, height: 'auto', marginRight: 8, verticalAlign: 'middle' };

const AppearanceSelect: FC<Props> = (props: Props) => {
  const { onChange, value, className } = props;
  const t = useTranslate();

  const getPrefixIcon = (appearance: Appearance) => {
    if (appearance === "light") {
      return <SunIcon style={iconStyle} />;
    } else if (appearance === "dark") {
      return <MoonIcon style={iconStyle} />;
    } else {
      return <SmileIcon style={iconStyle} />;
    }
  };

  const handleSelectChange = (_: any, appearance: Appearance | null) => {
    if (appearance) {
      onChange(appearance);
    }
  };

  return (
    <Select
      value={value}
      onChange={handleSelectChange}
      sx={{ minWidth: 180 }}
      className={className}
      startDecorator={getPrefixIcon(value)}
      placeholder="Appearance"
    >
      {appearanceList.map((appearance) => (
        <Option key={appearance} value={appearance}>
          {getPrefixIcon(appearance)}
          {t(`setting.appearance-option.${appearance}`)}
        </Option>
      ))}
    </Select>
  );
};

export default AppearanceSelect;
