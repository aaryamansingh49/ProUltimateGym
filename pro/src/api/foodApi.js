import axios from "axios";
import BASE_URL from "./config";

/* 🔍 Search Food */
export const searchFood = (query) => {
  return axios.get(`${BASE_URL}/api/food/search?query=${query}`);
};

/* ➕ Add Custom Food */
export const addFood = (foodData) => {
  return axios.post(`${BASE_URL}/api/food`, foodData);
};