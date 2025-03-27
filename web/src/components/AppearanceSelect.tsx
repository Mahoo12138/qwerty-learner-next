import { SunIcon, MoonIcon, SmileIcon } from "lucide-react";
import { FC } from "react";
import { RadioGroup } from '@headlessui/react'

import { useTranslate } from "@/utils/i18n";

interface Props {
  value: Appearance;
  onChange: (appearance: Appearance) => void;
  className?: string;
}

const appearanceList = ["system", "light", "dark"] as const;

const AppearanceSelect: FC<Props> = (props: Props) => {
  const { onChange, value, className } = props;
  const t = useTranslate();

  const getPrefixIcon = (appearance: Appearance) => {
    const className = "w-4 h-auto";
    if (appearance === "light") {
      return <SunIcon className={className} />;
    } else if (appearance === "dark") {
      return <MoonIcon className={className} />;
    } else {
      return <SmileIcon className={className} />;
    }
  };

  const handleSelectChange = async (appearance: Appearance) => {
    onChange(appearance);
  };

  return (
    <RadioGroup
      className={`!min-w-[10rem] w-auto whitespace-nowrap ${className ?? ""}`}
      value={value}
      onChange={(appearance) => {
        if (appearance) {
          handleSelectChange(appearance);
        }
      }}
      // startDecorator={getPrefixIcon(value)}
    >
      {appearanceList.map((item) => (
        <RadioGroup.Option key={item} value={item} className="whitespace-nowrap">
          {t(`setting.appearance-option.${item}`)}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};

export default AppearanceSelect;
