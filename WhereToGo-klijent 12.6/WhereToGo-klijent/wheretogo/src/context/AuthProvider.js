import {createContext,useState} from 'react'

const AuthContext=createContext({});

export const AuthProvider =({children}) =>{
    const [auth, setAuth]=useState({});
    const [objekatId, setObjekatId] = useState(localStorage.getItem("lastVisitedObject"))

    return (
        <AuthContext.Provider value={{auth,setAuth, objekatId, setObjekatId}}>   
        {children}
        </AuthContext.Provider>
    )

}

export default AuthContext;
