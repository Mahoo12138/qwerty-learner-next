import { User, Home, BookOpen, Search, Bell, FileText, Settings, Book } from "lucide-react";
import { Link } from "@tanstack/react-router";
import styles from "./style.module.scss";

function Sidebar() {
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
          <li className={styles.menuItem}>
            <Link className={styles.link} to="/">
              <Home size={18} className={styles.icon} />首页
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link className={styles.link} to="/dictionary">
              <Book size={18} className={styles.icon} />词库
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link className={styles.link} to='/setting'>
              <Settings size={18} className={styles.icon} />设置
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;