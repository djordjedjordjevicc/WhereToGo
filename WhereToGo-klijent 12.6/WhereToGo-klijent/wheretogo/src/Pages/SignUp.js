import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "../index.css";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import '../objekatPosetilac.css'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-Z][a-zA-Z]{1,29}$/;
const LASTNAME_REGEX = /^[A-Z][a-zA-Z]{3,35}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const REGISTER_URL = "/register";

const SignUp = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [name, setName] = useState("");
  const [valid, setValid] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [lastname, setLastName] = useState("");
  const [validLast, setValidLast] = useState(false);
  const [lastnameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);
  useEffect(() => {
    setValid(NAME_REGEX.test(name));
  }, [name]);
  useEffect(() => {
    setValidLast(LASTNAME_REGEX.test(lastname));
  }, [lastname]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd, name, lastname, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = NAME_REGEX.test(name);
    const v4 = LASTNAME_REGEX.test(lastname);
    const v5 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const url = `https://localhost:7193/Posetilac/UnosPosetioca/${user}/${pwd}/${matchPwd}/${name}/${lastname}/${email}`;
      /* const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json',
              'Accept':'application/json'
                     }
            });*/
      let response;
      response = axios.post(url);

      console.log(response.data);

      // Uspješno registrovanje
      setSuccess(true);
      setUser("");
      setPwd("");
      setMatchPwd("");
      setName("");
      setLastName("");
      setEmail("");
      // else {
      // Greška prilikom registracije
      //const errorMessage = await response.text();
      //setErrMsg(errorMessage);
      //}
    } catch (err) {
      setErrMsg("No Server Response");
      errRef.current.focus();
    }
  };
  return (
    <>
      <Navbar></Navbar>
      {success ? (
        <section style={{backgroundColor:'#2f2f33', marginBottom:'30px'}} >
        <h1  className='font-poppins' style={{color:'#941103'}}>Success!</h1>
        <h1 className='fontLog' style={{color:'#f0f0f7'}}>We have sent you an email to the address you provided for account verification.
             Please verify your account in order to log in.</h1>
        <p className='fontLog' style={{color:'#f0f0f7'}}>
            <Link style={{color:'#941103'}} to ="/LogIn">Sign In</Link>
        </p>
    </section>
      ) : (
        <section style={{backgroundColor:'#2f2f33'}}>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className='font-poppins' style={{color:'#941103'}}>Register</h1>
          <form className="forma" onSubmit={handleSubmit}>
            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
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
              <FontAwesomeIcon icon={faInfoCircle} />
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
              Must match the first password input field.
            </p>
            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="name">
              Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={valid ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={valid || !name ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="name"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              aria-invalid={valid ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
            />
            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="lastname">
              Last Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={lastname ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validLast || !lastname ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="lastname"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setLastName(e.target.value)}
              value={lastname}
              required
              aria-invalid={valid ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                lastnameFocus && lastname && !validLast
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a uppercase letter,include only letters.
            </p>

            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={email ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="uidnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <br />
              Your email address!
            </p>

            <button style={{marginTop:'15px'}}
              disabled={
                !validName ||
                !validPwd ||
                !validMatch ||
                !valid ||
                !validLast ||
                !validEmail
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>
          <p className='fontLog' style={{color:'#f0f0f7'}}>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <Link style={{color:'#941103'}} to="/LogIn">Sign In</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};
export default SignUp;
