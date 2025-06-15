import { HTMLAttributes } from "react";

interface MainProps extends HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

export const Main = ({ fixed, className, ...props }: MainProps) => {
  return (
    <main
      className={`${className || ''}`}
      style={{
        minHeight: "calc(100vh - 10rem)",
        ...(fixed && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        })
      }}
      {...props}
    />
  )
}

Main.displayName = "Main";
