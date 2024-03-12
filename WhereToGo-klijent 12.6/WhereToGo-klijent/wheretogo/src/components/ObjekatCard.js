import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import '../card.css'
import '../image.css'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from 'semantic-ui-react';
import { toByteArray } from 'base64-js';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import {FaStar} from 'react-icons/fa';

const ObjekatCard = ({ id }) => {
  const [objekat, setObjekat] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const { setObjekatId } = useContext(AuthContext);
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7193/UgostiteljskiObjekat/VratiUgostiteljskiObjekat/${id}`);
        const data = await response.json();
        setObjekat(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const getPicture = useCallback(async () => {

    try {
      const response = await axios.get(`https://localhost:7193/FileUpload/GetPictureHostingObject/${id}/`);
      // Handle response...
      const byteArray = toByteArray(response.data[0]);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      setImageUrl(imageUrl)
    } catch (error) {
      console.error(error);
    }
  }, [id, setImageUrl])

  useEffect(() => {
    id && getPicture();
  }, [getPicture, id])

  const handleClickCard = useCallback(() => {
    setObjekatId(id);
    navigate("/ObjekatPosetilac");
    localStorage.setItem("lastVisitedObject", id)
  },[])

  if (!objekat) {
    return <div>Loading...</div>;
  }
  

  return (
      <div className="Card" onClick={handleClickCard} >

        <div className='image'>
          <div>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            {imageUrl && <img className='imageProfile' src={imageUrl} alt="Slika" />}
          </div>
        </div>
        <div className='SecondColumn'>
          <div className='naziv'>
            <h1>{objekat.naziv}</h1>
          </div>
          <div className='opis'>
            <h3>{objekat.opis}</h3>
          </div>
          <div className='vrsta'>
            <h4>{objekat.vrsta}</h4>
          </div>
          <div className='adresa'>
            <h5>{objekat.adresa}</h5>
          </div>
          <div className='Ocena' style={{display:'flex',flexDirection:'row'}}>
            <FaStar style={{marginTop:'20px'}} className="star" size={20} color={"#ffc107"}/>
            <h3 style={{fontSize:'13px',marginBottom:'35px',  marginLeft:'8px'}}>Rating: {objekat.prosecnaOcena.toFixed(2)}</h3>
          </div>
        </div>

      </div>
  );
};


export default ObjekatCard;
