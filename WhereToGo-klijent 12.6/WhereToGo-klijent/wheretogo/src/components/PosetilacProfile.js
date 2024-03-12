import React, { useCallback } from 'react'
import '../index.css'
import {Link, useNavigate } from 'react-router-dom';
import PosetilacPassword from './PosetilacPassword';


import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import LogIn from '../Pages/LogIn';
import Navbar from './Navbar';
import { Input } from 'semantic-ui-react';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-Z][a-zA-Z]{1,29}$/;
const LASTNAME_REGEX = /^[A-Z][a-zA-Z]{3,35}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const PosetilacProfile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
    
        if(!isLoggedIn) navigate('/', { replace: true });
        const korisnikTmp= localStorage.getItem('korisnik');

        if(!korisnikTmp) navigate('/UgostiteljskiObjekatHome', { replace: true });
      }, [])

    
    
    const userRef = useRef();
    const errRef = useRef();

    const [korisnik, setKorisnik] = useState({})

    const [validName, setValidName] = useState(false);
    const [validPwd, setValidPwd] = useState(false);
     const [valid,setValid]=useState(false);
     const [validLast,setValidLast]=useState(false);
     const[validEmail,setValidEmail]=useState(false);

     const [isEditing, setIsEditing] = useState(false);
     const [errMsg, setErrMsg] = useState("");

      
     useEffect(()=>{
        const korisnikTmp= JSON.parse(localStorage.getItem('korisnik'));
 
        korisnik !== {} && setKorisnik(korisnikTmp)
    },[setKorisnik])
    

    useEffect(() => {
        korisnik.username && setValidName(USER_REGEX.test(korisnik.username));
    }, [korisnik])

    useEffect(()=>{
        korisnik.ime &&  setValid(NAME_REGEX.test(korisnik.ime));
    }, [korisnik]

    )
    useEffect(() => {
        korisnik.prezime && setValidLast(LASTNAME_REGEX.test(korisnik.prezime));
    }, [korisnik])
   


    const handleEdit = useCallback(() => {
        
        setIsEditing(true);
      },[setIsEditing])
       
    const handleSave = useCallback(async () => {
        try{
            const url=`https://localhost:7193/Posetilac/IzmeniPodatke/${korisnik.id}/${korisnik.ime}/${korisnik.prezime}/${korisnik.username}`;

            const response=await axios.put(url);
            console.log(response.data);
            setIsEditing(false);
        }
        catch(err)
       {
            setErrMsg("No server response");
       }
       
       
      
         
    
        
      },[setIsEditing,korisnik])
      
     
      const handleCancel = useCallback(() => {
        const korisnikTmp= JSON.parse(localStorage.getItem('korisnik'));
 
        setKorisnik(korisnikTmp)
        setIsEditing(false);
      },[setIsEditing])
    

  return (
    
    <>
        
         <Navbar />
         
         <section style={{backgroundColor:'#2f2f33'}} className="profilSekcija">
                    {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
                    <h1 className='font-poppins' style={{color:'#941103'}}>Profile</h1>
                    <div className="forma">
                        <label className='fontLog' style={{color:'#f0f0f7'}}>
                            Username:
                           
                        </label>
                        <Input 
                            name="username"
                            value={korisnik && korisnik.username}
                            onChange={(ev, { value }) => setKorisnik((prev) => ({...prev, username: value}))}
                            required
                            disabled={!isEditing}
                            
                        />
                        
                         <label className='fontLog' style={{color:'#f0f0f7'}}>
                           First Name:
                           
                        </label>
                        <Input 
                            name="ime"
                            value={korisnik && korisnik.ime}
                            onChange={(ev, { value }) => setKorisnik((prev) => ({...prev, ime: value}))}
                            required
                            disabled={!isEditing}
                        />
                       
                        <label className='fontLog' style={{color:'#f0f0f7'}}>
                           Last Name:
                            
                        </label>
                        <Input 
                            name="prezime"
                            value={korisnik && korisnik.prezime}
                            onChange={(ev, { value }) => setKorisnik((prev) => ({...prev, prezime: value}))}
                            required
                            disabled={!isEditing}
                        />
                        
                            <label style={{color:'#f0f0f7', fontFamily: 'Crafty Girls'}} className="emailLabel">
                           Email:
                            
                        </label>

                        <Input 
                            name="email"
                            value={korisnik && korisnik.email}
                            disabled={true}
                        />
  
                    
                    <button style={{marginTop:'15px'}} onClick={handleEdit}>Edit</button>
                              {isEditing && (
                                <>
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={handleCancel}>Cancel</button>
                                </>
                                )}      
                    
                        <Link to="/PosetilacPassword"><button style={{marginTop:'15px'}}>Change Your Password</button> </Link>
                       
                        
                        
                        

                      </div>
                      </section>
                     
                        
         
       
            
    </>
  )
}

export default PosetilacProfile;
