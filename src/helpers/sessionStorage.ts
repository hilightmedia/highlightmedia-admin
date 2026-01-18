const ACCESSTOKEN = "accessToken";
const REFRESHTOKEN = "refreshToken";


const get = (key: string) => sessionStorage.getItem(key);
const set = (key: string, value: string) => sessionStorage.setItem(key, value);
const remove = (key: string) => sessionStorage.removeItem(key);
const clearStorageSession = () => sessionStorage.clear();

const getAccessTokenSession = () => get(ACCESSTOKEN) || "";
const setAccessTokenSession = (token: string) => set(ACCESSTOKEN, token);
const removeAccessTokenSession = () => remove(ACCESSTOKEN);

const getRefreshTokenSession = () => get(REFRESHTOKEN);
const setRefreshTokenSession = (token: string) => set(REFRESHTOKEN, token);
const removeRefreshTokenSession = () => remove(REFRESHTOKEN);

export {
  getAccessTokenSession,
  setAccessTokenSession,
  removeAccessTokenSession,
  getRefreshTokenSession,
  setRefreshTokenSession,
  removeRefreshTokenSession,
  clearStorageSession,
};