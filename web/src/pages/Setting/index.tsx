import { Main } from "@/components/layouts/Main";
import { Settings, User, Users, Database, LogOut, Info, ClipboardList } from "lucide-react";
// import AppearanceSelect from "@/components/AppearanceSelect";
// import LocaleSelect from "@/components/LocaleSelect";

const menu = [
  { group: "基础", items: [
    { icon: <User size={18} />, label: "我的账号", active: true },
    { icon: <Settings size={18} />, label: "偏好设置" },
  ]},
  { group: "管理", items: [
    { icon: <Users size={18} />, label: "成员" },
    { icon: <Database size={18} />, label: "存储" },
    { icon: <ClipboardList size={18} />, label: "备忘录" },
    { icon: <LogOut size={18} />, label: "单点登录" },
  ]}
];

const tokens = [
  { token: "eyJh****@IW8", desc: "user login", created: "2025/6/5 22:48:37", expires: "2025/6/12 22:48:37" },
  { token: "eyJh****E1ww", desc: "user login", created: "2025/6/4 02:40:36", expires: "2125/5/11 02:40:36" },
  { token: "eyJh****JFg4", desc: "user login", created: "2025/5/27 09:43:03", expires: "2125/5/3 09:43:03" },
  { token: "eyJh****02LA", desc: "user login", created: "2025/5/26 19:26:59", expires: "2125/5/2 19:26:59" },
  { token: "eyJh****ZwMc", desc: "user login", created: "2025/5/24 16:08:29", expires: "2125/4/30 16:08:29" },
  { token: "eyJh****ejj0", desc: "user login", created: "2025/3/29 16:19:50", expires: "2125/3/5 16:19:50" },
  { token: "eyJh****1yw0", desc: "user login", created: "2025/3/20 04:21:19", expires: "2125/2/24 04:21:19" },
];

export default function SettingPage() {
  return (
    <Main>
      {/* 整体内容区，减去顶部 Header 高度，并留出左右边距 */}
      <div className="columns is-gapless" style={{ minHeight: "calc(100vh - 3rem)", margin: "0 24px" }}>
        {/* 侧边栏 */} 
        <aside className="column is-3 has-background-white-bis" style={{ borderRadius: 12, padding: "24px 0" }}>
          <aside className="menu pt-5 pl-4">
            {menu.map(group => (
              <div key={group.group} className="mb-5">
                <p className="menu-label">{group.group}</p>
                <ul className="menu-list">
                  {group.items.map(item => (
                    <li key={item.label}>
                      <a className={item.active ? "is-active" : ""}>
                        <span className="icon mr-2">{item.icon}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-6 pl-2 has-text-grey-light is-size-7">Version: v0.24.0</div>
          </aside>
        </aside>

        {/* 主内容 */}
        <div className="column is-9" style={{ padding: 32 }}>
          {/* 账户信息卡片 */}
          <div className="box mb-5" style={{ borderRadius: 12 }}>
            <div className="is-flex is-align-items-center mb-3">
              <img src="https://avatars.githubusercontent.com/u/45908451" alt="avatar" style={{ width: 64, height: 64, borderRadius: "50%" }} />
              <div className="ml-4">
                <div className="is-size-4 has-text-weight-bold">mahoo12138 <span className="is-size-6 has-text-grey">(mahoo12138)</span></div>
                <button className="button is-small is-light mt-2">
                  <Settings size={16} className="mr-1" /> 编辑
                </button>
              </div>
            </div>
            <div className="is-flex is-align-items-center">
              <span className="mr-4">主题：</span>
              {/* <AppearanceSelect value="system" onChange={() => {}} /> */}
              <span className="ml-6 mr-4">语言：</span>
              {/* <LocaleSelect value="zh-CN" onChange={() => {}} /> */}
            </div>
          </div>

          {/* Access Token 表格 */}
          <div className="box" style={{ borderRadius: 12 }}>
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
              <div>
                <span className="is-size-5 has-text-weight-semibold">Access Tokens</span>
                <a className="ml-2" href="#"><Info size={16} /></a>
                <div className="is-size-7 has-text-grey">A list of all access tokens for your account.</div>
              </div>
              <button className="button is-success">创建</button>
            </div>
            <div className="table-container">
              <table className="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>说明</th>
                    <th>Created At</th>
                    <th>Expires At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t, i) => (
                    <tr key={i}>
                      <td>
                        {t.token}
                        <button className="button is-white is-small ml-2" title="复制">
                          <ClipboardList size={16} />
                        </button>
                      </td>
                      <td>{t.desc}</td>
                      <td>{t.created}</td>
                      <td>{t.expires}</td>
                      <td>
                        <button className="button is-white is-small has-text-danger" title="删除">
                          <LogOut size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
