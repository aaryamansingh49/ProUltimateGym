export const getUserKey = () => {
    return localStorage.getItem("userKey");
  };
  
  export const setUserData = (key, value) => {
  
    const userKey = getUserKey();
    if (!userKey) return;
  
    localStorage.setItem(`${key}_${userKey}`, JSON.stringify(value));
  };
  
  export const getUserData = (key) => {
  
    const userKey = getUserKey();
    if (!userKey) return null;
  
    const data = localStorage.getItem(`${key}_${userKey}`);
  
    return data ? JSON.parse(data) : null;
  };
  
  export const removeUserData = (key) => {
  
    const userKey = getUserKey();
    if (!userKey) return;
  
    localStorage.removeItem(`${key}_${userKey}`);
  };