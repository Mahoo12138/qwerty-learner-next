import logo from "@/assets/logo.svg";
import type { PropsWithChildren } from "react";
import type React from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, LogOut, Info } from "lucide-react";
import { Box, Stack, Typography, Avatar, IconButton, Menu, MenuItem, Divider, Dropdown, MenuButton } from '@mui/joy';

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box component="header" sx={{ py: 3, px: 4, width: '100%', bgcolor: 'background.body' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src={logo}
              style={{ height: '3.5rem', marginRight: 16 }}
              alt="Qwerty Learner Logo"
            />
            <Typography level="h1" sx={{ fontSize: 32, color: 'text.primary', fontWeight: 700, m: 0 }}>
              Qwerty Learner
            </Typography>
          </RouterLink>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Dropdown>
              <MenuButton
                slots={{ root: Avatar }}
                slotProps={{
                  root: {
                    src: "https://avatars.githubusercontent.com/u/45908451",
                    sx: { width: 50, height: 50 },
                    alt: "User Avatar"
                  }
                }}
              >
                <Avatar

                />
              </MenuButton>
              <Menu
                placement="bottom-end"
                sx={{
                  minWidth: 180,
                  '--Menu-item-radius': '8px',
                  '--ListDivider-gap': '4px',
                }}
              >
                <MenuItem component={RouterLink} to="/setting">
                  <Settings size={18} style={{ marginRight: 8 }} />设置
                </MenuItem>
                <MenuItem component={RouterLink} to="/about">
                  <Info size={18} style={{ marginRight: 8 }} />关于
                </MenuItem>
                <Divider />
                <MenuItem sx={{ color: 'danger.plainColor' }}>
                  <LogOut size={18} style={{ marginRight: 8 }} />退出登录
                </MenuItem>
              </Menu>
            </Dropdown>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Header;
