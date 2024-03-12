import React from 'react'
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import Navbar from '../components/Navbar'
import {Link } from 'react-router-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css'; 
import '../index.css'
import '../objekatPosetilac.css'
mapboxgl.accessToken = 'pk.eyJ1IjoiZGpvbGxlZSIsImEiOiJjbGlhazVpbDQwNGk0M2xtbDg4bWhyMmRkIn0.ttjjCvdpCQq7STgYTSFvDA'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-Z][a-zA-Z\s]{0,28}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const CITY_REGEX=/^[A-Z][a-zA-Z]{1,29}$/;
const COORDINATE_REGEX = /^-?\d+(\.\d+)?$/;
const DESCRIPTION_REGEX = /^[\s\S]{1,200}$/;
const OBJECT_TYPE_REGEX = /^[A-Za-z\s'-]{1,50}$/;



const SignUpObjekat = () => {
    const userRef = useRef();
    const errRef = useRef();
    //const petRef = useRef();
    //const smokeRef = useRef();
    const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiZGpvbGxlZSIsImEiOiJjbGlhazVpbDQwNGk0M2xtbDg4bWhyMmRkIn0.ttjjCvdpCQq7STgYTSFvDA' });

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
 
     const [name,setName] = useState('');
     const [valid,setValid]=useState(false);
     const [nameFocus,setNameFocus]=useState(false);

    
     const[email,setEmail]=useState('');
     const[validEmail,setValidEmail]=useState(false);
     const[emailFocus,setEmailFocus]=useState(false);

     const[city,setCity]=useState('');
     const[validCity,setValidCity]=useState(false);
     const[cityFocus,setCityFocus]=useState(false);

     const[address,setAddress]=useState('');
     const[validAddress,setValidAddress]=useState(false);
     const[addressFocus,setAddressFocus]=useState(false);

     const[x,setX]=useState(0.0);
     const[validX,setValidX]=useState(false);
     const[xFocus,setXFocus]=useState(false);

     const[y,setY]=useState(0.0);
     const[validY,setValidY]=useState(false);
     const[yFocus,setYFocus]=useState(false);

    

     const[description,setDescription]=useState('');
     const[validDescription,setValidDescription]=useState(false);
     const[descriptionFocus,setDescriptionFocus]=useState(false);

     const[type,setType]=useState('');
     const[validType,setValidType]=useState(false);
     const[typeFocus,setTypeFocus]=useState(false);

     const[pet,setPet]=useState(false);
     const[validPet,setValidPet]=useState(false);
     const[petFocus,setPetFocus]=useState(false);

     const[smoke,setSmoke]=useState(false);
     const[validSmoke,setValidSmoke]=useState(false);
     const[smokeFocus,setSmokeFocus]=useState(false);


    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(21.3061);
    const [lat, setLat] = useState(44.2556);
    const [zoom, setZoom] = useState(6);

    useEffect(() => {
        userRef.current.focus();
    }, [])
    
    
    

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])
    useEffect(()=>{
            setValid(NAME_REGEX.test(name));
    }, [name]

    )

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidCity(CITY_REGEX.test(city));
    }, [city])

    useEffect(() => {
        setValidDescription(DESCRIPTION_REGEX.test(description));
    }, [description])

    useEffect(() => {
        setValidType(OBJECT_TYPE_REGEX.test(type));
    }, [type])


    useEffect(() => {
        setValidX(COORDINATE_REGEX.test(x));
    }, [x])

    useEffect(() => {
        setValidY(COORDINATE_REGEX.test(y));
    }, [y])
    
   useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd,name,address,email,description,type,city])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(pet);
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = NAME_REGEX.test(name);
        const v4 = EMAIL_REGEX.test(email);
        const v5=  CITY_REGEX.test(city);
        const v6 = DESCRIPTION_REGEX.test(description);
        const v7 = OBJECT_TYPE_REGEX.test(type);
        
        const v9=COORDINATE_REGEX.test(x);
        const v10=COORDINATE_REGEX.test(y);
        
        if (!v1 && !v2 && !v3 && !v4 && !v5 && !v6 && !v7 && !v9 && !v10) { 
          setErrMsg("Invalid Entry");
          return;
        }
        try {
            const url = 'https://localhost:7193/UgostiteljskiObjekat/UnosObjekta/' + user + '/' + pwd + '/' + matchPwd + '/' + name + '/' + email + '/' + city + '/' + address + '/' + x +'/' + y + '/'
            + description+'/'+type+'/' + pet + '/' + smoke;
         
            /*const response =fetch(url,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                'Accept':'application/json'
                       }
                
            });*/
            let response;
            response= await axios.post(url);

            
            console.log(response.data);

              // Obrada odgovora
           
            
    
              
                // Uspješno registrovanje
                setSuccess(true);
                setUser('');
                setPwd('');
                setMatchPwd('');
                setName('');
                setEmail('');
                setCity('');
                setAddress('');
                setX(0);
               setY(0);
                setType('');
                setDescription('');
                setPet(false);
                setSmoke(false);
              
               //else {
                // Greška prilikom registracije
                //const errorMessage = await response.text();
                //setErrMsg(errorMessage);
              //}
         
          
        } catch (err) {
          setErrMsg('No Server Response');
          errRef.current.focus();
        }      };

        const getAddressFromCoordinates = (lngLat) => {
            geocodingClient
              .reverseGeocode({
                query: [lngLat.lng, lngLat.lat],
                types: ['address'],
              })
              .send()
              .then((response) => {
                const match = response.body;
                if (match && match.features.length > 0) {
                  const { place_name } = match.features[0];
                  setAddress(place_name);
                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          };

        useEffect(() => {
            if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
            });
            const marker = new mapboxgl.Marker();
            map.current.on('click',  (event) => {
                var coordinates = event.lngLat;
                console.log('Lng:', coordinates.lng, 'Lat:', coordinates.lat);
                marker.setLngLat(coordinates).addTo(map.current);
                setX(coordinates.lng);
                setY(coordinates.lat);
                getAddressFromCoordinates(event.lngLat)
            })
            
            // let markers = [];

            // map.current.on('click', (e) => {
            //   // Remove previous markers
            //   markers.forEach(marker => marker.remove());
            //   markers = [];

            //   const { lng, lat } = map.current.unproject(e.point);
          
            //   const newMarker = new mapboxgl.Marker()
            //     .setLngLat([lng, lat])
            //     .addTo(map.current);
          
            //   markers.push(newMarker);
          

            // });


            },[x,y, setX, setY]);
            

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
                <section style={{backgroundColor:'#2f2f33', marginBottom:'30px'}}>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className='font-poppins' style={{color:'#941103'}}>Register</h1>
                    <form className="forma" onSubmit={handleSubmit}>
                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
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
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
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
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
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
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="name">
                           Name:
                            <FontAwesomeIcon icon={faCheck} className={valid ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={valid || !name ? "hide" : "invalid"} />
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
                        <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <br />
                           Name of your object.
                            
                        </p>
                       

                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="email">
                           Email:
                            <FontAwesomeIcon icon={faCheck} className={email ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
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
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <br />
                           Your email address!
                            
                        </p>

                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="city">
                           City:
                            <FontAwesomeIcon icon={faCheck} className={city ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validCity || !city ? "hide" : "invalid"} />
                        </label>
                        <input
                            style={{marginBottom :'20px'}}
                            type="text"
                            id="city"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setCity(e.target.value)}
                            value={city}
                            required
                            aria-invalid={validCity ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setCityFocus(true)}
                            onBlur={() => setCityFocus(false)}
                        />
                        <p id="uidnote" className={cityFocus && city && !validCity ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <br />
                           Your city.
                            
                        </p>
                        <div ref={mapContainer} className="map-container" />

                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="address">
                           Address:
                            
                        </label>
                        <input
                            type="text"
                            id="address"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            required
                            aria-invalid={validAddress ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setAddressFocus(true)}
                            onBlur={() => setAddressFocus(false)}
                        />
                        <p id="uidnote" className={addressFocus && address && !validAddress ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <br />
                           Your address!
                            
                        </p>


                         <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="description">
                                    Description:
                                    <FontAwesomeIcon icon={faCheck} className={description ? "valid" : "hide"} />
                                    <FontAwesomeIcon icon={faTimes} className={validDescription || !description ? "hide" : "invalid"} />
                                    </label>
                                    <input
                                    type="text"
                                    id="description"
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                    required
                                    aria-invalid={validDescription ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={() => setDescriptionFocus(true)}
                                    onBlur={() => setDescriptionFocus(false)}
                                    />
                                    <p id="uidnote" className={descriptionFocus && description && !validDescription ? "instructions" : "offscreen"}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <br />
                                    Your description!
                                    </p>

                             <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="type">
                                        Type:
                                        <FontAwesomeIcon icon={faCheck} className={type ? "valid" : "hide"} />
                                        <FontAwesomeIcon icon={faTimes} className={validType || !type ? "hide" : "invalid"} />
                                        </label>
                                        <input
                                        type="text"
                                        id="type"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setType(e.target.value)}
                                        value={type}
                                        required
                                        aria-invalid={validType ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setTypeFocus(true)}
                                        onBlur={() => setTypeFocus(false)}
                                        />
                                        <p id="uidnote" className={typeFocus && type && !validType ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        <br />
                                        Your type!
                                        </p>
                                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="pet">
                                        Pet-friendly:
                                        <FontAwesomeIcon icon={faCheck} className={pet ? "valid" : "hide"} />
                                        <FontAwesomeIcon icon={faTimes} className={validPet || pet  ? "hide" : "invalid"} />
                                        </label>
                                        <input
                                        type="checkbox"
                                        id="pet"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={() => setPet(!pet)}
                                        checked={pet}
                                        aria-invalid={validPet === undefined ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setPetFocus(true)}
                                        onBlur={() => setPetFocus(false)}
                                        />
                                        <p id="uidnote" className={petFocus && pet === undefined && validPet === undefined ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        <br />
                                        Pet-friendly?
                                        </p>
                            <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="smoke">
                                        Smoking:
                                        <FontAwesomeIcon icon={faCheck} className={smoke ? "valid" : "hide"} />
                                        <FontAwesomeIcon icon={faTimes} className={validSmoke || smoke ? "hide" : "invalid"} />
                                        </label>
                                        <input
                                        type="checkbox"
                                        id="smoke"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={() => setSmoke(!smoke)}
                                        checked={smoke}
                                        aria-invalid={validSmoke === undefined ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setSmokeFocus(true)}
                                        onBlur={() => setSmokeFocus(false)}
                                        />
                                        <p id="uidnote" className={smokeFocus && smoke === undefined && validSmoke === undefined ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                        <br />
                                        Do you smoke?
                                        </p>
          



        



                        

                        <button style={{marginTop:'15px'}} disabled={!validName || !validPwd || !validMatch || !valid ||  !validEmail||
                 !validDescription || !validType  ? true : false}>Sign Up</button>
                    </form>
                    <p className='fontLog' style={{color:'#f0f0f7'}}>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <Link style={{color:'#941103'}} to ="/LogIn">Sign In</Link>
                        </span>
                    </p>
                   

                </section>
            )}
        </>
    )
            }


export default SignUpObjekat
