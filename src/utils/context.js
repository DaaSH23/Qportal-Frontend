import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const initialState = {
    isLoggedIn: false,
    _id: null,
    role: null,
    name: null,
};

const AppContext = createContext();

const AppProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            try{
                const decodedToken = jwtDecode(token);
                dispatch({
                    type: "SET_STATE",
                    payload: {
                        isLoggedIn: true,
                        _id: decodedToken.userId,
                        role: decodedToken.userRole,
                        name: decodedToken.userName,
                    },
                });
            }catch(err){
                console.log("Error decoding token, error: ", err);
            };
        };
    }, []);
    const contextValue = {
        state,
        dispatch,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use and create the context
const useGlobalContext = () => {
    return useContext(AppContext);
}

export { initialState, AppContext, AppProvider, useGlobalContext };