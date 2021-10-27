import axios from "axios";
const headers = {
  // "Access-Control-Allow-Origin": "*",
  // "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  // "Content-Type": "application/json",
};

export const endpoint = process.env.NEXT_PUBLIC_API_URL;
// export const endpoint =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:8787"
//     : process.env.NEXT_PUBLIC_API_URL;
export const sendReq = (url: string) => axios.get(`${endpoint}${url}`);
export const sendPostReq = (url: string, data: any) =>
  axios.post(`${endpoint}${url}`, data, { headers });
export const defaultQueryFn = async ({ queryKey }: any) => {
  const { data } = await axios.get(`${endpoint}${queryKey[0]}`);
  return data;
};
export const mutationFn = async ({ queryKey }: any) => {
  const { data } = await axios.get(`${endpoint}${queryKey[0]}`);
  return data;
};
