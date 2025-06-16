import { User, Home, FileText, Settings, Book, BarChart2, AlertCircle } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { menuItems } from "@/constants";
import styles from "./style.module.scss";

const iconMap = {
  Home,
  Book,
  AlertCircle,
  BarChart2,
  Settings,
  Profile: User,
  default: FileText,
} as const;

const SideBar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
        <img
          src="https://avatars.githubusercontent.com/u/45908451"
          alt="avatar"
          className={styles.avatar}
        />
        <span className={styles.username}>mahoo12138</span>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map(({ path, icon, label }) => {
            const IconComponent = iconMap[icon] || iconMap.default;
            return (
              <li key={path} className={styles.menuItem}>
                <Link 
                  className={`${styles.link} ${location.pathname === path ? styles.active : ''}`} 
                  to={path}
                >
                  <IconComponent size={18} className={styles.icon} /> {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;