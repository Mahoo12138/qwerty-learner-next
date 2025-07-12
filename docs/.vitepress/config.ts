import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Qwerty Learner',
  description: '高效的词汇学习与管理平台',
  lang: 'en-US',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/',
      themeConfig: {
        logo: '/logo.webp',
        nav: [
          { text: 'Guide', link: '/development' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Database', link: '/database' },
          { text: 'API', link: '/api' },
          { text: '中文', link: '/zh/' }
        ],
        sidebar: [
          { text: 'Getting Started', link: '/development' },
          { text: 'Deployment', link: '/deployment' },
          { text: 'Testing', link: '/testing' },
          { text: 'Technologies', link: '/technologies' },
          { text: 'Troubleshooting', link: '/troubleshooting' }
        ]
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        logo: '/logo.webp',
        nav: [
          { text: '指南', link: '/zh/development' },
          { text: '架构', link: '/zh/architecture' },
          { text: '数据库', link: '/zh/database' },
          { text: 'API', link: '/zh/api' },
          { text: 'English', link: '/' }
        ],
        sidebar: [
          { text: '快速开始', link: '/zh/development' },
          { text: '部署', link: '/zh/deployment' },
          { text: '测试', link: '/zh/testing' },
          { text: '技术栈', link: '/zh/technologies' },
          { text: '常见问题', link: '/zh/troubleshooting' }
        ]
      }
    }
  }
}); 