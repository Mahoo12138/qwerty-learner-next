import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Settings, User, Users, Database, LogOut, ClipboardList } from "lucide-react";

import { Main } from "./Main";
import { tabItems } from '@/constants';

export default function SettingLayout() {
  const location = useLocation();
  return (
    <Main className="container">
        {/* 侧边栏 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tabs is-medium" style={{ marginBottom: 0 }}>
            <ul>
              {tabItems.map(tab => (
                <li key={tab.label} className={tab.path === location.pathname ? "is-active" : ""}>
                  <Link to={tab.path} className="has-text-grey-dark">{tab.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* 主内容 */}
        <div className="column is-10" style={{ padding: 32 }}>
          <Outlet />
        </div>
    </Main>
  )
}