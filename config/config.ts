// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import { getRoutes } from './routes';
const { REACT_APP_ENV } = process.env;
let BACKEND_ENV, BASE_PATH;

let env;
if (process.env.NODE_ENV !== 'production') {
  env = require('dotenv').config().parsed;
} else {
  env = process.env;
}

BACKEND_ENV = {
  parse_app_id: env.PARSE_APP_ID,
  parse_server_url: env.PARSE_SERVER_URL,
};
BASE_PATH = '/';

// BACKEND_ENV = {
//   parse_app_id: 'test-app-id',
//   parse_server_url: '/api',
// };
// BASE_PATH = '/';

const routes = getRoutes();

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  base: BASE_PATH,
  outputPath: `./dist${BASE_PATH}`,
  publicPath: BASE_PATH,
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing

  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  routes,
  define: {
    BACKEND_ENV,
    REACT_APP_ENV,
  },
});
