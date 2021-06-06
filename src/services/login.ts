import request from '@/utils/request';
import Parse from 'parse/node';

if (BACKEND_ENV) {
  Parse.initialize(BACKEND_ENV.parse_app_id);
  Parse.serverURL = BACKEND_ENV.parse_server_url;
}

export interface LoginParamsType {
  userName: string;
  password: string;
}

export function logout() {
  return Parse.User.logOut();
}

export async function login(params: LoginParamsType) {
  if (REACT_APP_ENV === 'staging' || REACT_APP_ENV === 'production') {
    try {
      const userLogined = await Parse.User.logIn(params.userName, params.password);
      const { username, objectId, sessionToken } = userLogined.toJSON();
      return {
        status: 'ok',
        data: { username, userid: objectId, sessionToken },
        type: null,
        currentAuthority: 'admin',
        error: null,
      };
    } catch (error) {
      return {
        status: 'error',
        type: null,
        data: null,
        currentAuthority: 'guest',
        error,
      };
    }
  } else {
    return request('/api/login/account', {
      method: 'POST',
      data: params,
    });
  }
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
