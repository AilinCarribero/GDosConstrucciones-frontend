import React,{ createContext, useState } from "react";
import { configToken } from "../services/apiServices";
import Cookies from 'js-cookie';

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const stateValue = () => {
        const cookiesUser = Cookies.get('loggedAppUser');
        console.log(cookiesUser)
        if(cookiesUser == "existo"){
            const res = window.localStorage.getItem('loggedAppUser') ? JSON.parse(window.localStorage.getItem('loggedAppUser')) : [];
            return (res)
        } else {
            window.localStorage.removeItem('loggedAppUser');
            return ([])
        }
    }

    const stateValueDefault = stateValue()
    const [ user, setUser ] = useState(
        stateValueDefault
    );

    const contextUserValue = {
        user,
        loginContext(userLogin) {
            setUser(userLogin);
            configToken(userLogin.token); // se envia el token a los servicios
        },
        isLogged() {
            const loggedUserJSON = stateValue();

            if (loggedUserJSON) {
                const resUser = JSON.parse(loggedUserJSON);
                
                setUser(resUser);
                configToken(resUser.token); // se envia el token a los servicios
            }
        },
        logout(){
            window.localStorage.removeItem('loggedAppUser');
            document.cookie = 'loggedAppUser=existo; expires=Fri, 31 Dec 2000 23:59:59 GMT"';
            setUser([]);
        }
    }

    return <UserContext.Provider  value={contextUserValue}>
        {children}
    </UserContext.Provider>
}

export default UserProvider;