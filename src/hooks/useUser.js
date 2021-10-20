import { useContext } from "react";
import { UserContext } from "../contexts/UserProvider";
import { configToken } from "../services/apiServices";

export const useUser = () => {
    const contextUserValue = useContext(UserContext);
    if(contextUserValue.user.token) configToken(contextUserValue.user.token);

    return contextUserValue
}