import React from 'react'
import {useRef, useState, useEffect, useContext} from 'react';
import Navbar from '../components/Navbar'
import '../index.css'
import '../objekatPosetilac.css'
import {Link } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios'
import PosetilacProfile from '../components/PosetilacProfile';
import{useNavigate} from 'react-router-dom' 





const LOGIN_URL='auth';

const LogIn = (userData) => {
    
    const navigate=useNavigate();
   
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const[role,setRole]=useState('customer');
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
      userRef.current.focus();
  }, [])

  useEffect(() => {
      setErrMsg('');
  }, [role,user, pwd])

   

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log(role.toString());
    try {
        let response;
        const auth={
            username:user,
            password:pwd
           };

        

        if (role === 'customer')
        
        
        {
            let urlToken='https://localhost:7193/Posetilac/GetToken/';
            let token;
            token=await axios.post(urlToken,auth,{
                headers: {
                    'Content-Type':'application/json'
                }
            })
            if(token.data==null)
            {
                setErrMsg('Invalid username or password');
            }
            

            
            console.log(token.data);

            let verifikacija;
          response = await axios.get('https://localhost:7193/Posetilac/LogInPosetilac/'+user+'/'+pwd);
          console.log(response.data.id);
          verifikacija=await axios.get('https://localhost:7193/Posetilac/NalogVerifikovan/'+response.data.id);
          userData=response.data;
          localStorage.setItem('korisnik', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn','true');
          
         
          if(verifikacija.data===false)
          {
             setErrMsg('Account is not verificated');
             return;
          }
          console.log(verifikacija.data);
        
        setUser('');
        setPwd('');
       
        setSuccess(true);
         
      } 
      else if (role === 'partner')
      {
        let urlToken='https://localhost:7193/UgostiteljskiObjekat/GetToken/';
            let token;
            token=await axios.post(urlToken,auth,{
                headers: {
                    'Content-Type':'application/json'
                }
            })
            if(token.data==null)
            {
                setErrMsg('Invalid username or password');
            }
           

            
            console.log(token.data);

            let verifikacija;
          response = await axios.get('https://localhost:7193/UgostiteljskiObjekat/LogInUgostiteljskiObjekat/'+user+'/'+pwd);
          console.log(response.data);
          console.log(response.data.iD_Korisnik);
          verifikacija=await axios.get('https://localhost:7193/UgostiteljskiObjekat/NalogVerifikovan/'+response.data.iD_Korisnik);
          userData=response.data;
          localStorage.setItem('objekat', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn','true');
          
          if(verifikacija.data===false)
          {
             setErrMsg('Account is not verificated');
             return;
          }
          console.log(verifikacija.data);
        
        setUser('');
        setPwd('');
       
        setSuccess(true);
      }
    }
        // Ostatak koda za obradu odgovora...
       catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Invalid Username or Password');
        } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        errRef.current.focus();
      }
    };


       /* try {
            let url;
            if (role === 'Customer') {
              url = 'https://localhost:7193/Posetilac/LogInPosetilac' + user +  + pwd;
            } else if (role === 'Partner') {
              url = 'https://localhost:7193/UgostiteljskiObjekat/LogInUgostitelj?user=' + user + '&pwd=' + pwd;
            }
        
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              withCredentials: true
            });
            const data = await response.json();
            console.log(data);
            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    
   
  }*/
  if(role==='customer')
  {

  
  return (
    <>
    
    
        {success ? (
           
            
            <section style={{marginTop:'50px', backgroundColor:'#2f2f33'}}>
                 
                <h1 className='font-poppins' style={{color:'#941103',marginLeft:'75px', marginTop:'40px'}}>You are logged in!</h1>
                <br />
                <p style={{marginLeft:'150px',marginTop:'100px'}}>
                    <Link className='fontLog' style={{color:'#f0f0f7'}} to="/">Go to Home</Link>
                </p>
            </section>
        ) : (
            <>
            <Navbar></Navbar>
            <section style={{backgroundColor:'#2f2f33'}}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1 className='font-poppins' style={{color:'#941103'}}>Sign In</h1>
                <form style={{backgroundColor:'#2f2f33'}} onSubmit={handleSubmit}>
                    
                <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="role">Role:</label>
                    <select
                    id="role"
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                    required 
                    >
                    <option value="customer">Customer</option>
                    <option value="partner">Partner</option>
                    </select>

                    <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />

                    <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button style={{marginTop:'15px'}}>Sign In</button>
                </form>
                <p className='fontLog' style={{color:'#f0f0f7'}}>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <Link style={{color:'#941103'}} to="/SignUp">Sign Up</Link>
                    </span>
                </p>
            </section>
            </>
        )}
     </> 
  
)
 
}
 else{
    return (
        <>
       
            {success ? (
               
                
                <section style={{marginTop:'50px',backgroundColor:'#2f2f33'}}>
                     
                    <h1 className='font-poppins' style={{color:'#941103', marginLeft:'75px', marginTop:'40px'}}>You are logged in!</h1>
                    <br />
                    <p style={{marginLeft:'150px',marginTop:'100px'}}>
                        <Link className='fontLog' style={{color:'#f0f0f7'}} to="/UgostiteljskiObjekatHome">Go to Home</Link>
                        
                        
                    </p>
                </section>
            ) : (
                <>
                     <Navbar></Navbar>
                <section style={{backgroundColor:'#2f2f33'}}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='font-poppins' style={{color:'#941103'}}>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        
                    <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="role">Role:</label>
                        <select
                        id="role"
                        onChange={(e) => setRole(e.target.value)}
                        value={role}
                        required 
                        >
                        <option value="customer">Customer</option>
                        <option value="partner">Partner</option>
                        </select>
    
                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />
    
                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button style={{marginTop:'15px'}}>Sign In</button>
                    </form>
                    <p className='fontLog' style={{color:'#f0f0f7'}}>
                        Need an Account?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <Link style={{color:'#941103'}} to="/SignUp">Sign Up</Link>
                        </span>
                    </p>
                </section>
               </> 
            )}
         </> 
      
    )
 }

}
 

export default LogIn
