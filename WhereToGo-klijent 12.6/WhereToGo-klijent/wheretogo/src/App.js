import './App.css';
import React, {useEffect, useState, useCallback} from 'react'
import{useNavigate} from 'react-router-dom' 
import Navbar from './components/Navbar';
import axios from 'axios';
import { Dropdown, Form, Button, Checkbox } from "semantic-ui-react";
import UgostoteljskiObjekatiGrad from './components/UgostoteljskiObjekatiGrad';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from "./components/Footer"


const App = () => {
  const navigate = useNavigate();
  const [gradovi, setGradovi] = useState([]);
  const [selektovaniGrad, setSelektovaniGrad] = useState('');
  const [petFriendly, setPetFriendly] = useState(false);
  const [smoking, setSmoking] = useState(false);
  const [renderUgostoteljskiObjekatiGrad, setRenderUgostoteljskiObjekatiGrad] = useState(false);

  useEffect(() => {
    const searchFilters = JSON.parse(localStorage.getItem('searchFilters'));

    const city = searchFilters && searchFilters.city; 
    const pet = searchFilters && searchFilters.pet; 
    const smoking = searchFilters && searchFilters.smoking; 
    
    // const city = JSON.parse(localStorage.getItem('searchFilters')).city
    // const pet = JSON.parse(localStorage.getItem('searchFilters')).pet
    // const smoking = JSON.parse(localStorage.getItem('searchFilters')).smoking

    setSelektovaniGrad(city);
    setPetFriendly(pet);
    setSmoking(smoking);
  },[])

      useEffect(() => {
        const fetchGradovi = async () => {
          try {
            const response = await axios.get('https://localhost:7193/Grad/VratiGradove');
            setGradovi(response.data.map((el) => ({key: el.id, value: el.naziv, text: el.naziv})));
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
        };
  
        fetchGradovi();
      }, []);


  
      useEffect(() => {
        selektovaniGrad && setRenderUgostoteljskiObjekatiGrad(true);
      }, [selektovaniGrad, setRenderUgostoteljskiObjekatiGrad]);
  
      return (
      <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="content-wrapper" style={{ flex: '1 0 auto' }}>
        <Form >
          <Form.Field>
            <Dropdown
              placeholder='Choose city'
              fluid
              search
              selection
              value={selektovaniGrad}
              options={gradovi}
              onChange={(e, { value }) => {
                setSelektovaniGrad(value)
                localStorage.setItem('searchFilters', JSON.stringify({...JSON.parse(localStorage.getItem('searchFilters')), city:value}))
              }}
            />
            <div style={{display:'flex',flexDirection:'row'}}>
            <div className='pet' style={{marginLeft:'10px',marginRight:'10px'}}>
            <Checkbox label="Pet Friendly" checked={petFriendly} toggle onChange={(e, { checked }) => {
              setPetFriendly(checked)
              localStorage.setItem('searchFilters',  JSON.stringify({...JSON.parse(localStorage.getItem('searchFilters')), pet:checked}))
            }
            } /></div>
            <Checkbox label="Smoking allowed" checked={smoking} toggle onChange={(e, { checked }) => {
              setSmoking(checked)
              localStorage.setItem('searchFilters',  JSON.stringify({...JSON.parse(localStorage.getItem('searchFilters')), smoking:checked}))
            }
            } /></div>
          </Form.Field>
        </Form>
        {renderUgostoteljskiObjekatiGrad && (
        <UgostoteljskiObjekatiGrad pet={petFriendly} smoking={smoking} grad={selektovaniGrad} />
        )}
        </div>
        <Footer />
      </div>
        
      );

}

export default App;


