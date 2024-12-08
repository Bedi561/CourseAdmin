// adminEmailState.js
import { adminState } from "../atoms/admin";
import { selector } from "recoil";

export const adminEmailState = selector({
  key: 'adminEmailState',
  get: ({ get }) => {
    const state = get(adminState);
    return state.adminEmail;
  },
});
