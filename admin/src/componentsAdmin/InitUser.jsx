// import {userState} from "../store/atoms/user.js";
// import {
//     useSetRecoilState
// } from 'recoil';
// import { useEffect } from "react";
// function InitUser() {
//     const setUser = useSetRecoilState(userState);

//     const init = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}/admin/me`, {
//                 headers: {
//                     "Authorization": "Bearer " + localStorage.getItem("token")
//                 }
//             });

//             if (response.data.username) {
//                 setUser({
//                     isLoading: false,
//                     userEmail: response.data.username
//                 });
//             } else {
//                 setUser({
//                     isLoading: false,
//                     userEmail: null
//                 });
//             }
//         } catch (e) {
//             setUser({
//                 isLoading: false,
//                 userEmail: null
//             });
//         } 
//     };

//     useEffect(() => {
//         // Check if the current route is /me before initializing the user
//             console.log("Initializing user...");
//             init();
        
//     }, []);

//     return <></>;
// }

// export default InitUser;