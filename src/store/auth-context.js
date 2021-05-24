import React,{useState} from 'react';


const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: token => {},
    logout: () => {},
});


let logoutTimer;

const calculateRemainingTime = expirationTime => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
}

export const AuthContextProvider = props => {

    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token;

    

    const logoutHandler = () => {
        setToken(null);
        localStorage.clear();

        if(logoutTimer){
            clearTimeout(logoutTimer)
        }
    };

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler,remainingTime)
    };

    const contextValue = {
        token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }


    return <AuthContext.Provider value={contextValue} >
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;
