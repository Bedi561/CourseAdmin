/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { createContext, useEffect, useState } from "react";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import axios from "axios";

export const AdminContext = createContext({
    currentAdmin : null,
    setCurrentAdmin : () => null
});

export const AdminProvider = ({ children }) => {
    
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const value = { currentAdmin, setCurrentAdmin }


    useEffect(() => {
        if (hasCookie('authentication')) {

            try {
                JSON.parse(getCookie('authentication'));
            } catch (err) {
                deleteCookie('authentication');
                window.location = "/";
            }

            axios.get(`${BASE_URL}/api/v1/admin/me`, {
              headers: {
                'Authorization': `Bearer ${JSON.parse(getCookie('authentication')).accessToken}`
              }
            })
              .then((response) => {
                if (response.data.statusCode == 200) {
                  setCurrentAdmin(response.data.data);
                  setCookie('authentication', JSON.stringify(response.data.data));
                }
                else {
                  deleteCookie('authentication');
                }
              })
              .catch((error) => {
                deleteCookie('authentication');
              });
          }
    },[]);

    return (<AdminContext.Provider value={value}>{children}</AdminContext.Provider>);

}