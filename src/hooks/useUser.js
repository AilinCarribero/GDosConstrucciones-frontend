import { useContext } from "react";
import { UserContext } from "../contexts/UserProvider";
import { configToken } from "../services/apiServices";
import { useEffect, useState } from "react";
import { getUser } from "../services/apiAuth";

export const useUser = () => {
    const contextUserValue = useContext(UserContext);
    if(contextUserValue.user.token) configToken(contextUserValue.user.token);

    return contextUserValue
}

export const useGetUser = () => {
    const [ user, setUser ] = useState([]);

    useEffect(() => {
        (async () => {
            const resGetUser = await getUser();
            setUser(resGetUser);
        })()
    }, [])
    return { user, setUser }
}