import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import { Router } from "react-router-dom";
//import './stil.css';
import {AuthProvider} from './context/AuthProvider'
import LogIn from "./Pages/LogIn";
import SignUp from "./Pages/SignUp";
import PosetilacProfile from "./components/PosetilacProfile";
import UgostiteljskiObjekatHome from "./components/UgostiteljskiObjekatHome";
import UgostiteljskiObjekatProfile from "./components/UgostiteljskiObjekatProfile";
import ObjekatCard from "./components/ObjekatCard";
import ObjekatPosetilac from "./components/ObjekatPosetilac";
import PosetilacPassword from "./components/PosetilacPassword";
import UrediStolove from "./components/UrediStolove"
import UgostiteljskiObjekatPassword from "./components/UgostiteljskiObjekatPassword";
import Footer from "./components/Footer"

import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Routes,
  } from "react-router-dom";
import SignUpObjekat from "./Pages/SignUpObjekat";
import ProtectedRoutes from "./components/ProtectedRoutes";
import 'semantic-ui-css/semantic.min.css'
   
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
    },
    {
      path: "LogIn",
      element: <LogIn/>,
    },
    {
      path:"SignUp",
      element:<SignUp/>,
    },
    {
      path:"SignUpObjekat",
      element:<SignUpObjekat/>,
    },
    { element:<ProtectedRoutes />,
     } ,
    
    {
      path:"PosetilacProfile",
      element:<PosetilacProfile/>
    },
    {
      path:"UgostiteljskiObjekatHome",
      element:<UgostiteljskiObjekatHome/>,
    },
    {
      path:"UgostiteljskiObjekatProfile",
      element:<UgostiteljskiObjekatProfile/>,
    },
    {
      path:"ObjekatCard",
      element:<ObjekatCard/>,
    },
    {
      path:"ObjekatCard",
      element:<ObjekatCard/>,
    },
    {
      path:"ObjekatPosetilac",
      element:<ObjekatPosetilac/>,
    },
    {
      path:"PosetilacPassword",
      element:<PosetilacPassword/>,
    },
    {
      path:"UgostiteljskiObjekatPassword",
      element:<UgostiteljskiObjekatPassword/>,
    },
    {
      path:"UrediStolove",
      element:<UrediStolove/>,
    },
    {
      path:"Footer",
      element:<Footer/>,
    },

  ]);



    const el=document.getElementById('root');
    const root=ReactDOM.createRoot(el);

   

root.render(
<AuthProvider>
<RouterProvider router={router} />
</AuthProvider>

);