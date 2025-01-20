import axios from "axios";

const API_URL = "http://192.168.1.106:3000";

export const fetchFundingRounds = async () => {
  const response = await axios.get(`${API_URL}/funding-rounds`);
  return response.data;
};
