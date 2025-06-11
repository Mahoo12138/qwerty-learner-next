import { createFileRoute, Outlet } from "@tanstack/react-router";
import { User, Home, BookOpen, Search, Bell, FileText, Settings } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_sidebar")({
  component: RouteComponent,

});

function Sidebar() {
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "14rem",
        background: "#f7f7f9",
        borderRight: "1px solid #eee",
        padding: "2rem 0.5rem 2rem 1.5rem",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}
    >
      <div className="is-flex is-align-items-center mb-5">
        <img src="https://avatars.githubusercontent.com/u/45908451" alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <span className="ml-3 has-text-weight-bold">mahoo12138</span>
      </div>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li className="mb-2"><a className="is-flex is-align-items-center" href="#"><Home size={18} className="mr-2" /> 首页</a></li>
          <li className="mb-2"><a className="is-flex is-align-items-center" href="#"><BookOpen size={18} className="mr-2" /> 资源库</a></li>
          <li className="mb-2"><a className="is-flex is-align-items-center" href="#"><Search size={18} className="mr-2" /> 发现</a></li>
          <li className="mb-2"><a className="is-flex is-align-items-center" href="#"><User size={18} className="mr-2" /> 个人资料</a></li>
          <li className="mb-2"><a className="is-flex is-align-items-center" href="#"><Bell size={18} className="mr-2" /> 通知</a></li>
          <li className="mb-2"><a className="is-flex is-align-items-center" href="#"><FileText size={18} className="mr-2" /> 已归档</a></li>
          <li className="mt-4"><a className="is-flex is-align-items-center" href="#"><Settings size={18} className="mr-2" /> 设置</a></li>
        </ul>
      </nav>
    </aside>
  );
}

function RouteComponent() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div
        className="has-background-white-bis"
        style={{
          marginLeft: "14rem",
          flexGrow: 1,
          padding: "24px", // 容器内部的间距
        }}
      >
        <div className="box" style={{ borderRadius: 12, padding: "32px" }}> {/* 卡片内部的间距 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
