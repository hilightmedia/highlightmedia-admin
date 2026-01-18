const ACCESSTOKEN = "accessToken";
const REFRESHTOKEN = "refreshToken";

const get = (key: string) => localStorage.getItem(key);
const set = (key: string, value: string) => localStorage.setItem(key, value);
const remove = (key: string) => localStorage.removeItem(key);
const clearStorageLocal = () => localStorage.clear();



const getAccessTokenLocal = () => get(ACCESSTOKEN) || "";
const setAccessTokenLocal = (token: string) => set(ACCESSTOKEN, token);
const removeAccessTokenLocal = () => remove(ACCESSTOKEN);

const getRefreshTokenLocal = () => get(REFRESHTOKEN);
const setRefreshTokenLocal = (token: string) => set(REFRESHTOKEN, token);
const removeRefreshTokenLocal = () => remove(REFRESHTOKEN);



export {
  getAccessTokenLocal,
  setAccessTokenLocal,
  removeAccessTokenLocal,
  getRefreshTokenLocal,
  setRefreshTokenLocal,
  removeRefreshTokenLocal,
  clearStorageLocal,
};
