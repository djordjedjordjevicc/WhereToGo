import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import '../card.css'
import '../image.css'
import '../objekatPosetilac.css'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from 'semantic-ui-react';
import { toByteArray } from 'base64-js';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import {FaStar} from 'react-icons/fa';

const StarRating=({user, objekat})=>{
    console.log("User je "+user);
    console.log("Objekat je "+objekat);

    const [rating, setRating]=useState(null);
    const [hover, setHover]=useState(null);
   
    const [flag, setFlag]=useState(false);
    const [trenutna, setTrenutna]=useState(false);



    const trenutnaProsecnaOcena=useCallback(async()=>{
                // const url=`https://localhost:7193/UgostiteljskiObjekat/VratiTrenutnuProsecnuOcenu/${objekat}`;
                const response = await axios.get(`https://localhost:7193/UgostiteljskiObjekat/VratiTrenutnuProsecnuOcenu/${objekat}/${user || 0}`);
                setTrenutna(response.data.prosecnaOcena);
                setRating(response.data.ocenaPosetioca);
    },[setTrenutna,setRating,objekat,user]);

    useEffect(()=>{
          trenutnaProsecnaOcena();
    },[trenutnaProsecnaOcena])


    const sendRating = useCallback(async (rating) => {
         {
           // Pretpostavljam da postoji user objekat sa ID-jem korisnika
           setRating(rating);
            console.log("Rating je "+rating );

      
          try {
            
            const response = await axios.get(`https://localhost:7193/UgostiteljskiObjekat/VratiProsecnuOcenu/${objekat}/${user}/${rating}`);
            if (response.data!==null) {
                setTrenutna(response.data);
                setFlag(false);
                
              // Ažuriranje prosečne ocene na frontendu
              // Implementirajte logiku za ažuriranje prosečne ocene na osnovu odgovora sa servera
            } else {
                
                setFlag(true);
             
            }
          } catch (error) {
            // Prikazivanje greške ako se dogodila greška prilikom izvršavanja fetch zahteva
          }
        }
      }, [rating, objekat, user, flag]);

      const resetHover = () => {
        if (!flag) {
          setHover(null);
        }
      };
        console.log(trenutna);
        console.log(rating);
        console.log(JSON.stringify(objekat));
        console.log("User je "+user);
        // useEffect(() => {
        //     sendRating(rating)
        //   }, [sendRating])

    return(
        <div className='stars'>
          
          <p className='top'>Rating: {Number(trenutna).toFixed(2)}</p>
          <div className='zvezdice'>
            {[...Array(5)].map((star, i) =>{
                const ratingValue=i + 1;

                return(
                    <label>
                        <input disabled={rating || !user} className='starInput' type="radio" name="rating" value={ratingValue} onClick={()=>sendRating(ratingValue)}/>
                        <FaStar className="star" size={20} 
                            color={flag || ratingValue <= (hover || rating) ? "#ffc107" : "e4e5e9"}
                            onMouseEnter={!flag && !rating && user  ? () => setHover(ratingValue) : null}
                            onMouseLeave={!flag && !rating && user ? () => setHover(null) : null}/>
                    </label>
                )
            })}
            </div>
            
        </div>
    )
}

export default StarRating;