import { Outlet } from '@tanstack/react-router';
import Sidebar from '../SideBar';

function SideBarLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div
        className="has-background-white-ter"
        style={{
          marginLeft: "14rem",
          flexGrow: 1,
          padding: "24px", // 容器内部的间距
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default SideBarLayout;