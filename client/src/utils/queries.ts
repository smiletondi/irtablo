import { sendReq } from "@utils/network";
export const getGames = async () => {
  const { data } = await sendReq("/games");
  return data;
};
