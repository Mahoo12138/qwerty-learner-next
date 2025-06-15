import React, { useState } from 'react';
import styles from './style.module.scss';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Main } from '@/components/layouts/Main';

// 模拟数据
const mockStats = {
  todayPractice: 120,
  totalPractice: 5499,
  todayDuration: 23,
  totalDuration: 19234,
};

const mockErrorWords = [
  { word: 'plausible', frequency: 5 },
  { word: 'concede', frequency: 3 },
  { word: 'obedient', frequency: 4 },
  { word: 'suffice', frequency: 2 },
  { word: 'components', frequency: 22 },
];

// 模拟折线图数据：最近10次练习的正确率
const mockCorrectRateData = [
  { name: '#1', '正确率': 95 },
  { name: '#2', '正确率': 88 },
  { name: '#3', '正确率': 92 },
  { name: '#4', '正确率': 78 },
  { name: '#5', '正确率': 85 },
  { name: '#6', '正确率': 90 },
  { name: '#7', '正确率': 93 },
  { name: '#8', '正确率': 80 },
  { name: '#9', '正确率': 87 },
  { name: '#10', '正确率': 91 },
];

// 模拟柱状图数据：每周练习数量
const mockWeeklyPracticeData = [
  { name: '周一', '练习数量': 300 },
  { name: '周二', '练习数量': 450 },
  { name: '周三', '练习数量': 200 },
  { name: '周四', '练习数量': 600 },
  { name: '周五', '练习数量': 350 },
  { name: '周六', '练习数量': 700 },
  { name: '周日', '练习数量': 250 },
];

// 模拟柱状图数据：每月练习数量
const mockMonthlyPracticeData = [
  { name: '1月', '练习数量': 1200 },
  { name: '2月', '练习数量': 1500 },
  { name: '3月', '练习数量': 1000 },
  { name: '4月', '练习数量': 1800 },
  { name: '5月', '练习数量': 1300 },
  { name: '6月', '练习数量': 2000 },
];

export default function StatisticPage() {
  const [practiceChartType, setPracticeChartType] = useState('week');

  const currentPracticeData = practiceChartType === 'week' ? mockWeeklyPracticeData : mockMonthlyPracticeData;

  return (
    <Main>
      <div className={`container  ${styles.statisticPage}`}>
        <h1 className={styles.pageTitle}>统计数据</h1>
        <p className={styles.pageDescription}>查看你的学习进度和错误分析，帮助你更好地提升打字水平。</p>
        <div className="columns is-multiline">
          <div className="column is-7">
            <div className={`${styles.card} ${styles.wordCloudCard} ${styles.hoverCard}`} style={{ height: '400px' }}>
              <h2 className="title is-5">最近错误</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={mockErrorWords.sort((a, b) => b.frequency - a.frequency)}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="word" width={100} interval={0} />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#f87171" barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 右侧数据卡片部分 */}
          <div className="column is-5">
            <div className={`${styles.card} ${styles.hoverCard} is-flex is-flex-direction-column`} style={{ height: '400px' }}>
              <div className="columns is-multiline is-gapless is-mobile is-flex-grow-1">
                <div className="column is-half">
                  <div className={`${styles.dataCard} ${styles.hoverCard}`}>
                    <span className={styles.dataIconBullet}></span>
                    <p className={styles.dataLabel}>今日练习</p>
                    <p className={styles.dataValue}>{mockStats.todayPractice} 词</p>
                  </div>
                </div>
                <div className="column is-half">
                  <div className={`${styles.dataCard} ${styles.hoverCard}`}>
                    <span className={styles.dataIconBullet}></span>
                    <p className={styles.dataLabel}>累计练习</p>
                    <p className={styles.dataValue}>{mockStats.totalPractice} 词</p>
                  </div>
                </div>
                <div className="column is-half">
                  <div className={`${styles.dataCard} ${styles.hoverCard}`}>
                    <span className={styles.dataIconBullet}></span>
                    <p className={styles.dataLabel}>今日时长</p>
                    <p className={styles.dataValue}>{mockStats.todayDuration} 分钟</p>
                  </div>
                </div>
                <div className="column is-half">
                  <div className={`${styles.dataCard} ${styles.hoverCard}`}>
                    <span className={styles.dataIconBullet}></span>
                    <p className={styles.dataLabel}>累计时长</p>
                    <p className={styles.dataValue}>{mockStats.totalDuration} 分钟</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 图表部分 */}
        <div className="columns is-multiline">
          <div className="column is-one-third">
            <div className={`${styles.card} ${styles.chartCard} ${styles.hoverCard}`}>
              <h2 className="title is-5">最近10次练习正确率</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockCorrectRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="正确率" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="column is-two-thirds">
            <div className={`${styles.card} ${styles.chartCard} ${styles.hoverCard}`}>
              <div className={`is-flex is-justify-content-space-between is-align-items-center ${styles.chartHeader}`}>
                <h2 className="title is-5">练习单词数量</h2>
                <div className="buttons has-addons">
                  <button
                    className={`button is-small ${practiceChartType === 'week' ? 'is-primary' : 'is-light'
                      }`}
                    onClick={() => setPracticeChartType('week')}
                  >
                    周
                  </button>
                  <button
                    className={`button is-small ${practiceChartType === 'month' ? 'is-primary' : 'is-light'
                      }`}
                    onClick={() => setPracticeChartType('month')}
                  >
                    月
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={currentPracticeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="练习数量" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}