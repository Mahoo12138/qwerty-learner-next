import React from "react";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Main = ({ fixed, className, ...props }: MainProps) => {
  return <main {...props} />;
};

Main.displayName = "Main";
