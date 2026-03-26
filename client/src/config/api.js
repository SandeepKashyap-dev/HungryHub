
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {

  UNIFIED_LOGIN: `${API_URL}/api/login`,

  USER_LOGIN: `${API_URL}/api/user/login`,
  USER_REGISTER: `${API_URL}/api/user/register`,
  USER_PROFILE: `${API_URL}/api/user/userprofile`,
  USER_UPDATE_PROFILE: `${API_URL}/api/user/updateprofile`,

  ADMIN_LOGIN: `${API_URL}/api/admin/adminlogin`,
  ADMIN_REGISTER: `${API_URL}/api/admin/adminreg`,

  ADD_FOOD: `${API_URL}/api/food/addfood`,
  GET_ALL_FOOD: `${API_URL}/api/food/allfood`,
  UPDATE_FOOD: (id) => `${API_URL}/api/food/${id}`,
  DELETE_FOOD: (id) => `${API_URL}/api/food/${id}`,
  GET_FOOD_CARD: `${API_URL}/api/food/foodcard`,

  GET_ALL_USERS: `${API_URL}/api/admin/users`,
  DELETE_USER: (id) => `${API_URL}/api/admin/users/${id}`,

  CREATE_ORDER: `${API_URL}/api/orders`,
  GET_USER_ORDERS: `${API_URL}/api/orders/user`,
  CANCEL_ORDER: (orderId) => `${API_URL}/api/orders/${orderId}/cancel`,
};

export default API_URL;

