import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { login as loginService, logout as logoutService } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(loginService, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        const { username, userid, sessionToken } = response.data;
        localStorage.setItem('username', username);
        localStorage.setItem('userid', userid);
        localStorage.setItem('sessionToken', sessionToken);
        setTimeout(() => {
          localStorage.removeItem('username');
          localStorage.removeItem('userid');
          localStorage.removeItem('sessionToken');
        }, 7 * 24 * 3600 * 1000);
      } else {
        message.error(`Login failed, ${response.error}`);
      }
    },

    *logout({ payload }, { call }) {
      yield call(logoutService, payload);
      localStorage.removeItem('username');
      localStorage.removeItem('userid');
      localStorage.removeItem('sessionToken');
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
