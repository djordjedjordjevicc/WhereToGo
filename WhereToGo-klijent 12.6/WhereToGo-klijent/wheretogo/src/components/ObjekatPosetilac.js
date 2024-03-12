import React, { useEffect, useState, useCallback, useRef, useContext, useMemo } from 'react';
import '../card.css'
import '../image.css'
import '../objekatPosetilac.css'
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Table } from 'semantic-ui-react';
import { toByteArray } from 'base64-js';
import axios from '../api/axios';
import Navbar from '../components/Navbar'
import ObjekatCard from '../components/ObjekatCard'
import AuthContext from '../context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import StarRating from '../components/StarRating'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css'; 
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet';



mapboxgl.accessToken = 'pk.eyJ1IjoiZGpvbGxlZSIsImEiOiJjbGlhazVpbDQwNGk0M2xtbDg4bWhyMmRkIn0.ttjjCvdpCQq7STgYTSFvDA'

const TipStola = {
    0: "Bar",
    1: "Booth",
    2: "Low Table",
    3: "Counter"
};

const StatusStola = {
    0: "Free",
    1: "Reserved",
    2: "Taken",
};

const ObjekatPosetilac = () => {

    const [objekat, setObjekat] = useState(null);
    const [naziv, setNaziv] = useState(null);
    const [opis, setOpis] = useState(null);
    const [vrsta, setVrsta] = useState(null);
    const [ocena, setOcena] = useState(null);
    const [stolovi, setStolovi] = useState([]);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(21.3061);
    const [lat, setLat] = useState(44.2556);
    const [zoom, setZoom] = useState(6);

    const navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState(null);
    const [korisnik, setKorisnik] = useState({});

    const { objekatId } = useContext(AuthContext);

    const isLoggedIn = useMemo(() => localStorage.getItem("isLoggedIn"))

    useEffect(() => {
      if (map.current || !objekat || !mapContainer.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
      });

      const marker = new mapboxgl.Marker();
      marker.setLngLat({lat: objekat.mapY, lng: objekat.mapX}).addTo(map.current);

      },[objekat, map, mapContainer]);

    useEffect(() => {
      const objekat= localStorage.getItem('objekat');
      if(objekat)navigate('/UgostiteljskiObjekatHome', { replace: true })
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if(isLoggedIn) {
          const user= JSON.parse(localStorage.getItem('korisnik'));
          setKorisnik(user);
        }

        if(isLoggedIn && !objekatId) navigate('/', { replace: true });
      }, [objekatId])


    useEffect(() => {
        const fetchObjekti = async () => {
          try {
    
            
            const response = await axios.get(`https://localhost:7193/UgostiteljskiObjekat/VratiUgostiteljskiObjekatFULL/${objekatId}`);
            setObjekat(response.data);
            setNaziv(response.data.naziv);
            setOpis(response.data.opis);
            setVrsta(response.data.vrsta);
            setOcena(response.data.ocena);
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
        };
  
        objekatId && fetchObjekti();
      },[objekatId]);

      useEffect(() => {
        const fetchSviStolovi = async () => {
          try {
    
            
            const response = await axios.get(`https://localhost:7193/Sto/VratiStolove/${objekatId}`);
            setStolovi(response.data);
            console.log(response.data);
          } catch (error) {
            console.error(error);
          }
        };
  
        objekatId && fetchSviStolovi();
      },[objekatId]);


      const getPicture = useCallback(async () => {

        try {
          const response = await axios.get(`https://localhost:7193/FileUpload/GetPictureHostingObject/${objekatId}/`);
          // Handle response...
          const byteArray = toByteArray(response.data[0]);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
    
          setImageUrl(imageUrl)
        } catch (error) {
          console.error(error);
        }
      }, [objekatId, setImageUrl])
    
      useEffect(() => {
        objekatId && getPicture();
      }, [getPicture, objekatId])

      const rezervisiSto = useCallback(async (stoId) => {

        try {
          const response = await axios.post(`https://localhost:7193/Sto/RezervisiSto/${stoId}/${objekatId}/`);
          // Handle response...
    
          setStolovi((prev) => prev.map((sto) => sto.id === stoId ? {...sto, status: 1} : sto))
        } catch (error) {
          console.error(error);
        }
      }, [setStolovi, objekatId])

  if (!objekat) {
    return <div>Loading...</div>;
  }

  return (
    <div className='app' style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div className="content-wrapper" style={{ flex: '1 0 auto' }}>
        <div className='info'>
        <div>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Caveat&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Caveat&family=Foldit:wght@100&family=Fredericka+the+Great&family=Moirai+One&family=Orbitron:wght@400;500;600;700;800;900&family=Poppins&display=swap" rel="stylesheet"/>
          </Helmet>

            <h1 className='font-caveat'>{naziv}</h1>
        </div>
        <div>
            <h3 className='font-poppins'>{opis}</h3>
        </div>
        <div>
            <h4 className='font-fredericka'>{vrsta}</h4>
        </div>
        </div>
        <div className='slikaMapa'>
        
          <div className='left'>
          {imageUrl && <img className='slika' src={imageUrl} alt="Slika" />}
          </div>
        
          <div className='right'>
            <div ref={mapContainer} className="map-container" /></div>
          </div>
          
        
        
          <div>
            <StarRating user={korisnik?.id} objekat={objekatId}/>
          </div>

        <Table celled padded>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Table number</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Capacity</Table.HeaderCell>
        <Table.HeaderCell>Reserve</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
        {stolovi.length ? stolovi.map((sto, index) => (
            <Table.Row id={sto.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{TipStola[sto.tip]}</Table.Cell>
                <Table.Cell>{sto.kapacitet}</Table.Cell>
                <Table.Cell>{sto.status === 0 ? isLoggedIn ? <Button onClick={() => rezervisiSto(sto.id)}>Reserve</Button> : <Link to="/LogIn"><Button>Log in to Reserve</Button></Link> : sto.status === 1 ? "Reserved" : "Taken"}</Table.Cell>
            </Table.Row>
        )) : "Empty"}
  
    </Table.Body>

  </Table>
  </div>
  
    <Footer />
  </div>
    
    
  );
};


export default ObjekatPosetilac;