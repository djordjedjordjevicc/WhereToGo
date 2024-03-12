import React from 'react'

import {useRef, useState, useEffect, useContext} from 'react';
import Navbar from '../components/Navbar'
import '../index.css'
import {Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from 'semantic-ui-react';
import { useCallback } from 'react';
import { toByteArray } from 'base64-js';


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-Z][a-zA-Z\s]{0,28}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const CITY_REGEX=/^[A-Z][a-zA-Z]{1,29}$/;
const ADDRESS_REGEX = /^[A-Za-z0-9\s\.,'-]{1,100}$/;
const COORDINATE_REGEX = /^-?\d+(\.\d+)?$/;
const DESCRIPTION_REGEX = /^[\s\S]{1,200}$/;
const OBJECT_TYPE_REGEX = /^[A-Za-z\s'-]{1,50}$/; 


 const  UgostiteljskiObjekatProfile=()=> {
    const navigate = useNavigate();
    
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const objekat= localStorage.getItem('objekat');
        if(!isLoggedIn||!objekat) navigate('/', { replace: true });
      }, [])

    
    const userRef = useRef();
    const errRef = useRef();
      
   
    const [validName, setValidName] = useState(false)  
   
     const [valid,setValid]=useState(false);
     const[object,setObject]=useState({});

     
     const [isEditing, setIsEditing] = useState(false);
    
    
     const[validEmail,setValidEmail]=useState(false)

     
     const[validAddress,setValidAddress]=useState(false);
     
     const[validDescription,setValidDescription]=useState(false);
        const[validType,setValidType]=useState(false);
       const[validPet,setValidPet]=useState(false);
     

    
     const[validSmoke,setValidSmoke]=useState(false);
  


    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
       object.userName && setValidName(USER_REGEX.test(object.userName));
    }, [object])

    
    useEffect(()=>{
         object.naziv &&   setValid(NAME_REGEX.test(object.naziv));
    }, [object]

    )

    useEffect(() => {
      object.email &&  setValidEmail(EMAIL_REGEX.test(object.email));
    }, [object])

   

    useEffect(() => {
       object.opis && setValidDescription(DESCRIPTION_REGEX.test(object.opis));
    }, [object])

    useEffect(() => {
        object.vrsta && setValidType(OBJECT_TYPE_REGEX.test(object.vrsta));
    }, [object])

    useEffect(() => {
        object.adresa && setValidAddress(ADDRESS_REGEX.test(object.adresa));
    }, [object])


    useEffect(()=>{
        const objekat= JSON.parse(localStorage.getItem('objekat'));
      
        object !=={} && setObject(objekat);
         
          
    },[setObject])

    console.log(object);

    const handleEdit = useCallback(() => {
        
        setIsEditing(true);
      },[setIsEditing])
       
    const handleSave = useCallback(async () => {
        try{
            const url=`https://localhost:7193/UgostiteljskiObjekat/IzmeniPodatkePet/${object.iD_Korisnik}/${object.naziv}/${object.opis}/${object.vrsta}/${object.userName}/${object.petFriendly}/${object.dozvoljenoPusenje}`;


            const response=await axios.put(url);
            console.log(response.data);
            setIsEditing(false);
        }
        catch(err)
       {
            setErrMsg("No server response");
       }
        
      },[setIsEditing,object])
      
     
      const handleCancel = useCallback(() => {
        const objekat= JSON.parse(localStorage.getItem('objekat'));
 
        setObject(objekat);
        setIsEditing(false);
      },[setIsEditing])

      
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    
   const handleFileChange = async  (event) => {
    setSelectedFile(event.target.files[0]);
   };

  const handleUpload = async () => {
    
    try {
      if (!selectedFile) {
        console.log("Niste izabrali sliku");
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(`https://localhost:7193/FileUpload/PostPictureHostingObject/${object.iD_Korisnik}`, formData);
      console.log(response.data);
      
      getPicture();
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const getPicture = useCallback(async () => {


    try {
      const response = await axios.get(`https://localhost:7193/FileUpload/GetPictureHostingObject/${object.iD_Korisnik}/`);
      // Handle response...
      const byteArray = toByteArray(response.data[0]);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      setImageUrl(imageUrl)
    } catch (error) {
      console.error(error);
    }
  }, [object.iD_Korisnik, setImageUrl])

  useEffect(() => {
    object.iD_Korisnik && getPicture();
  }, [getPicture, object.iD_Korisnik])

      
    
  return (
    <>
      <Navbar />
      
      <section style={{backgroundColor:'#2f2f33'}}>
                    <h1 className='font-poppins' style={{color:'#941103'}}>Profile</h1>
                      <div>
                        <input type="file" id="fileInput" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload</button>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                          {imageUrl && <img className='imageProfile' src={imageUrl} alt="Slika" />}
                      </div>
           
                    <label className='fontLog' style={{color:'#f0f0f7'}}>
                            Username:
                           
                        </label>
                        <Input 
                            name="username"
                            value={object && object.userName}
                            onChange={(ev, { value }) => setObject((prev) => ({...prev, userName: value}))}
                            required
                            disabled={!isEditing}
                            
                        />
                        
                         <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="name">
                           Name:
                           
                        </label>
                        <Input 
                            name="ime"
                            value={object && object.naziv}
                            onChange={(ev, { value }) => setObject((prev) => ({...prev, naziv: value}))}
                            required
                            disabled={!isEditing}
                        />
                         <label style={{color:'#f0f0f7', fontFamily: 'Crafty Girls'}} className="emailLabel">
                           Email:
                            
                        </label>

                        <Input 
                            name="email"
                            value={object && object.email}
                            disabled={true}
                        />
                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="address">
                           Address:
                           
                        </label>
                        <Input 
                            name="adresa"
                            value={object && object.adresa}
                            onChange={(ev, { value }) => setObject((prev) => ({...prev, adresa: value}))}
                            required
                            disabled={!isEditing}
                        />
                       
                         <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="description">
                                    Description:
                                  
                       </label>
                       <Input 
                            name="opis"
                            value={object && object.opis}
                            onChange={(ev, { value }) => setObject((prev) => ({...prev, opis: value}))}
                            required
                            disabled={!isEditing}
                        />
                                   <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="type">
                                        Type:
                                        </label>
                                        <Input 
                            name="vrsta"
                            value={object && object.vrsta}
                            onChange={(ev, { value }) => setObject((prev) => ({...prev, vrsta: value}))}
                            required
                            disabled={!isEditing}
                        />
                                        <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="pet">
                                        Pet-friendly:
                                        
                                        </label>
                                        <input
                                        type="checkbox"
                                        id="pet"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(ev) => setObject((prev) => ({ ...prev, petFriendly: ev.target.checked }))}
                                        checked={object.petFriendly}
                                        aria-invalid={validPet === undefined ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        disabled={!isEditing}
                                        />  
                                   <label className='fontLog' style={{color:'#f0f0f7'}} htmlFor="smoke">
                                        Smoking:
                                       
                                        </label>
                                        <input
                                        type="checkbox"
                                        id="smoke"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(ev) => setObject((prev) => ({ ...prev, dozvoljenoPusenje: ev.target.checked }))}
                                        checked={object.dozvoljenoPusenje}
                                        aria-invalid={validSmoke === undefined ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        disabled={!isEditing}
                                        
                                        />      
                 
                            <button onClick={handleEdit}>Edit</button>
                              {isEditing && (
                                <>
                                    <button style={{color:'black'}} onClick={handleSave}>Save</button>
                                    <button onClick={handleCancel}>Cancel</button>
                                </>
                                )}      

                <button >
                        <Link style={{color:'black'}} to="/UgostiteljskiObjekatPassword">Change Your Password</Link>
                        

                </button>  

                <button>
                        <Link style={{color:'black'}} to="/UrediStolove">Organize Tables</Link>
                    
                </button> 


                                    
                           
      </section>

      
      </>


   
  )
}

export default UgostiteljskiObjekatProfile;