import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Settings, User, Users, Database, LogOut, ClipboardList } from "lucide-react";

import { Main } from "./Main";


const menu = [
    {
        group: "基础", items: [
            { icon: <User size={18} />, label: "我的账号", link: "/setting" },
            { icon: <Settings size={18} />, label: "偏好设置", link: "/setting1" },
        ]
    },
    {
        group: "管理", items: [
            { icon: <Users size={18} />, label: "成员", link: "/setting/member" },
            { icon: <Database size={18} />, label: "存储", link: "/setting2" },
            { icon: <ClipboardList size={18} />, label: "备忘录", link: "/setting3" },
            { icon: <LogOut size={18} />, label: "单点登录", link: "/setting3" },
        ]
    }
];

export default function SettingLayout() {
    const location = useLocation();
    return (
        <Main>
            <div className="columns">
                {/* 侧边栏 */}
                <aside className="menu column is-2">
                    {menu.map(group => (
                        <div key={group.group} className="mb-5">
                            <p className="menu-label">{group.group}</p>
                            <ul className="menu-list">
                                {group.items.map(item => (
                                    <li key={item.label}>
                                        <Link to={item.link} className={item.link === location.pathname ? "is-active" : ""}>
                                            <span className="icon mr-2">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className="mt-4 pl-2 has-text-grey-light is-size-7">Version: v0.24.0</div>
                </aside>

                {/* 主内容 */}
                <div className="column is-10" style={{ padding: 32 }}>
                    <Outlet />

                </div>
            </div>
        </Main>
    )
}