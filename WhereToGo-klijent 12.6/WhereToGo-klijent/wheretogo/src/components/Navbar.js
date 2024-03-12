import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn"));
  const isObjekat = useMemo(() => localStorage.getItem("objekat"),[]);

  const navigate = useNavigate();

  const handleLogout = () => {
    const isKorisnik = localStorage.getItem("korisnik")
    // Brisanje informacija o prijavi iz lokalnog skladišta
    localStorage.removeItem('isLoggedIn');
    isKorisnik ? localStorage.removeItem('korisnik') : localStorage.removeItem('objekat');

    // Dodatne radnje prilikom odjave...
    setIsLoggedIn(false)
    // Preusmeri korisnika na odgovarajuću stranicu za nelogovane korisnike
    navigate('/', { replace: true });

  };
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img  style={{height:'50px', width:'60px'}} src="https://scontent.fbeg9-1.fna.fbcdn.net/v/t39.30808-6/327123308_887023965842093_9137604737252347348_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=9VRWHYl1VPgAX9R4jSt&_nc_ht=scontent.fbeg9-1.fna&oh=00_AfBrj4XC0CHBP0XgdALI7h68htEXQd1sxpn_0aQ43mpIDw&oe=6488F164" alt="Logo"></img>
      </div>
      <ul className="navbar-menu">
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/LogIn">LogIn</Link>
            </li>
            <li>
              <Link to="/SignUp">SignUp</Link>
            </li>
            <li style={{marginRight:'10px'}}>
              <Link to="/SignUpObjekat">Become our partner</Link>
            </li>
          </>
        ) : isObjekat ? (
          <>
          <li>
            <Link to="/UgostiteljskiObjekatHome">Home</Link>
          </li>
          <li>
            <Link onClick={handleLogout}>LogOut</Link>
          </li>
          <li style={{marginRight:'10px'}}>
            <Link to="/UgostiteljskiObjekatProfile">Profile</Link>
          </li>
        </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link onClick={handleLogout}>LogOut</Link>
            </li>
            <li style={{marginRight:'10px'}}>
              <Link to="/PosetilacProfile">Profile</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
