import React, {useEffect, useState, useCallback} from 'react'
import{useNavigate} from 'react-router-dom' 
import Navbar from './Navbar';
import ObjekatCard from './ObjekatCard';
import axios from 'axios';
import { Dropdown, Form, Button, Checkbox } from "semantic-ui-react"


function UgostoteljskiObjekatiGrad({pet, smoking, grad}) {

    const [objekti, setObjekti] = useState([]);
    // const [Smoking, setSmoking] = useState(false);
    //const [Pet, setPet] = useState(false);
    // setSmoking(smoking);
    

    useEffect(() => {
        const fetchObjekti = async () => {
          try {
            
            const response = await axios.get(`https://localhost:7193/UgostiteljskiObjekat/Filter/${pet}/${smoking}/${grad}`);
            setObjekti(response.data);
            console.log(pet);
            console.log(smoking);
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
        };
  
        fetchObjekti();
      }, [grad, pet, smoking]);

      console.log(pet, smoking, grad);

  return (
    <div>
      {objekti.map((objekat) => (
        <ObjekatCard key={objekat.iD_Korisnik} id={objekat.iD_Korisnik} />
      ))}
    </div>
  )
}

export default UgostoteljskiObjekatiGrad
