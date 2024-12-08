import { userState } from "../atoms/user";
import { selector } from "recoil";

export const userEmailState = selector({
  key: 'userEmailState',
  get: ({ get }) => {
    const state = get(userState);
    console.log('userEmailState - userState:', state); // Add logging statement
    return state.userEmail;
  },
});
