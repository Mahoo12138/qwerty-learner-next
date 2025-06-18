import { HTMLAttributes } from "react";
import { Box, Container } from '@mui/system';
interface MainProps extends HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <Container fixed={fixed} component='main' {...props} />
  )
}

Main.displayName = "Main";
