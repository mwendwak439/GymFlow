import api from "./api";

export const fetchCsrf = () => api.get("/csrf/");
export const registerUser = (data) => api.post("/register/", data);
export const loginUser = (data) => api.post("/login/", data);
export const logoutUser = () => api.post("/logout/");
export const getMe = () => api.get("/me/");