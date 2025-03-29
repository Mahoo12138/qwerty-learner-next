import { SunIcon, MoonIcon, SmileIcon } from "lucide-react";
import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <Select
      onValueChange={(appearance) => {
        if (appearance) {
          handleSelectChange(appearance as Appearance);
        }
      }}
      value={value}
    >
      <SelectTrigger className="w-[180px] text-foreground">
        {getPrefixIcon(value)}
        <SelectValue placeholder="Appearance" />
      </SelectTrigger>
      <SelectContent className='bg-background'>
        {appearanceList.map((appearance) => {
          return (
            <SelectItem
              key={appearance}
              value={appearance}
              className="whitespace-nowrap hover:bg-accent hover:text-accent-foreground"
            >
              {t(`setting.appearance-option.${appearance}`)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default AppearanceSelect;
