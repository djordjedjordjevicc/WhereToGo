import { Link } from 'react-router-dom';
import React, { useCallback } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import {
    faCheck,
    faTimes,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useRef, useState, useEffect } from "react";
  import { Input } from 'semantic-ui-react';
  import axios from '../api/axios';
  import '../objekatPosetilac.css'

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const  PosetilacPassword=()=> {
    const navigate = useNavigate();
    useEffect(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
  
      if(!isLoggedIn) navigate('/', { replace: true });
      const korisnikTmp= localStorage.getItem('korisnik');

      if(!korisnikTmp) navigate('/UgostiteljskiObjekatHome', { replace: true });
    }, [])

     const errRef = useRef();
    const [korisnik, setKorisnik] = useState({})

        const[pwd,setPwd]=useState('');
        const [validPwd, setValidPwd] = useState(false);
        const [pwdFocus, setPwdFocus] = useState(false);

        const [matchPwd, setMatchPwd] = useState(""); 
        const [validMatch, setValidMatch] = useState(false);
        const [matchFocus, setMatchFocus] = useState(false);


        const[newPwd,setNewPwd]=useState('');
        const [validNewPwd, setValidNewPwd] = useState(false);
        const [newFocus, setNewFocus] = useState(false);

        const [errMsg, setErrMsg] = useState("");
        const [success, setSuccess] = useState(false);


        useEffect(()=>{
            const korisnikTmp= JSON.parse(localStorage.getItem('korisnik'));
     
            korisnikTmp !== {} && setKorisnik(korisnikTmp)
        },[setKorisnik])

        
        




        useEffect(() => {
            setValidPwd(PWD_REGEX.test(pwd));
            setValidMatch(newPwd === matchPwd);
            setValidNewPwd(PWD_REGEX.test(newPwd)&& !(newPwd===pwd));
          }, [pwd, matchPwd,newPwd]);

       const changePassword= useCallback(async(e)=>{
                e.preventDefault();
                const v1=PWD_REGEX.test(pwd);
                const v2=PWD_REGEX.test(newPwd);
                const v3=newPwd === matchPwd;
                const v4=newPwd!== pwd;

                if(!v1|| !v2 || !v3 || !v4){
                    setErrMsg("Invalid entry");
                }
                try{
               const url=`https://localhost:7193/Posetilac/PromeniPassword/${korisnik.id}/${pwd}/${newPwd}`;
               const response=await axios.put(url);
               if(response.status===200){

                setSuccess(true);
                setPwd('');
                setNewPwd('');
                setMatchPwd('');
                setErrMsg('');



               }
            }
            catch(err)
            {
                setErrMsg('No server response');
                errRef.current.focus();
            } 


                
       })
        

  return (
    <>
       
        {success ? (
        <section style={{backgroundColor:'#2f2f33',marginTop:'50px'}}>
          <h1 className='font-poppins' style={{color:'#941103',marginLeft:'75px', marginTop:'40px'}}>Success!</h1>
          <h1 className='font-poppins' style={{color:'#941103',marginLeft:'75px', marginTop:'20px'}}>
             You have successfully changed your password.
          </h1>
          <p style={{marginLeft:'150px',marginTop:'100px'}}>
            <Link className='fontLog' style={{color:'#f0f0f7'}} to="/">Home</Link>
          </p>
        </section>
      ) : (
        <>
        <Navbar/>
        <section style={{backgroundColor:'#2f2f33'}} className="profilPassword">
             
            
                    { <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> }
                    <h1 className='font-poppins' style={{color:'#941103'}}>Change Your Password</h1>
                 <div>
                
                 <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="password">
               Old password:
              {/* <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              /> */}
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="newpassword">
              New Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validNewPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validNewPwd || !newPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="newpassword"
              onChange={(e) => setNewPwd(e.target.value)}
              value={newPwd}
              required
              aria-invalid={validNewPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setNewFocus(true)}
              onBlur={() => setNewFocus(false)}
            />
            <p
              id="pwdnote"
              className={newFocus && !validNewPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.Must  
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            

            

            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
             onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the new password input field.
            </p>

            <button style={{marginTop:'15px'}} onClick={changePassword}  disabled={
                
                !validPwd ||
                !validMatch ||
                !validNewPwd
                  ? true
                  : false
              }>Edit</button>

           

            </div>
            </section>
            </>
            )}
      
    </>
  )
}

export default PosetilacPassword