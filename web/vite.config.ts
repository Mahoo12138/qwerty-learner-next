import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
// import { promises as fs } from 'fs'
import { getLastCommit } from 'git-last-commit'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import Icons from 'unplugin-icons/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'


const devProxyServer = "http://127.0.0.1:3000";

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(async ({ mode }) => {
  const latestCommitHash = await new Promise<string>((resolve) => {
    return getLastCommit((err, commit) => (err ? 'unknown' : resolve(commit.shortHash)))
  })
  return {
    plugins: [
      TanStackRouterVite(),
      react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
      visualizer() as PluginOption,
      tailwindcss(),
      Icons({
        compiler: 'jsx',
        jsx: 'react',
        customCollections: {
          // 'my-icons': {
          //   xiaohongshu: () => fs.readFile('./src/assets/xiaohongshu.svg', 'utf-8'),
          // },
        },
      }),
    ],
    build: {
      minify: true,
      outDir: 'build',
      sourcemap: false,
    },
    server: {
      host: "0.0.0.0",
      port: 8500,
      proxy: {
        "^/api": {
          target: devProxyServer,
          xfwd: true,
        },
      },
    },
    esbuild: {
      drop: mode === 'development' ? undefined : ['console', 'debugger'],
    },
    define: {
      REACT_APP_DEPLOY_ENV: JSON.stringify(process.env.REACT_APP_DEPLOY_ENV),
      LATEST_COMMIT_HASH: JSON.stringify(latestCommitHash + (process.env.NODE_ENV === 'production' ? '' : ' (dev)')),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
  }
})
