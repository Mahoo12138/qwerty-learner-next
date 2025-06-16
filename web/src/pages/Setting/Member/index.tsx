import React, { useState } from 'react';
import styles from './style.module.scss';

interface User {
  username: string;
  role: string;
  nickname: string;
  email: string;
}

const initialMembers: User[] = [
  {
    username: 'mahoo12138',
    role: 'Host',
    nickname: 'mahoo12138',
    email: 'mahoo12138@qq.com',
  },
];

export default function Member() {
  const [members, setMembers] = useState<User[]>(initialMembers);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');

  const handleCreateMember = () => {
    // In a real application, you would send this data to a backend
    console.log({ username, password, role });
    // For now, just add a dummy new member
    const newMember: User = {
      username: username,
      role: role,
      nickname: username, // For simplicity, nickname is same as username
      email: `${username}@example.com`, // Dummy email
    };
    setMembers([...members, newMember]);
    setUsername('');
    setPassword('');
    setRole('User');
  };

  return (
    <>
      <div className={styles.card}>
        <h2 className={`title is-4 ${styles.cardTitle}`}>创建成员</h2>
        <div className="field">
          <label className="label">用户名</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">密码</label>
          <div className="control">
            <input
              className="input"
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">身份</label>
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                name="role"
                value="User"
                checked={role === 'User'}
                onChange={(e) => setRole(e.target.value)}
              />
              User
            </label>
            <label className="radio ml-4">
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={role === 'Admin'}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
          </div>
        </div>

        <div className="control">
          <button className="button is-success" onClick={handleCreateMember}>
            创建
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={`title is-4 ${styles.cardTitle}`}>成员列表</h2>
        <div className="table-container">
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>用户名</th>
                <th>身份</th>
                <th>昵称</th>
                <th>邮箱</th>
                <th></th>{/* For future actions like delete/edit */}
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index}>
                  <td>{member.username}</td>
                  <td>{member.role}</td>
                  <td>{member.nickname}</td>
                  <td>{member.email}</td>
                  <td>您自己</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
} 