import React, {useEffect} from 'react'
import {Link, useNavigate,  } from 'react-router-dom';
import Navbar from './Navbar';
import { Header, Table, Rating } from 'semantic-ui-react'
import {useRef, useState, useContext} from 'react';
import axios from '../api/axios';
import { useCallback } from 'react';
import Footer from './Footer';


const TipStola = {
  0: "Bar",
  1: "Booth",
  2: "Low Table",
  3: "Counter"
  }; 

  const tipoviStola = Object.keys(TipStola).map((key) => ({
    value: key,
    text: TipStola[key]
  }));

  const StatusStola ={
    0: "Available",
    1: "Reserved",
    2: "Occupied"

  };

  const statusiStola=Object.keys(TipStola).map((key)=>({
         value: key,
         text: StatusStola[key]
  }));

const UgostiteljskiObjekatHome=()=> {

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    const objekat= localStorage.getItem('objekat');
        if(!isLoggedIn||!objekat) navigate('/', { replace: true });
  }, [])

   const[object,setObject]=useState({});
   const[tables,setTables]=useState([]);
   const[capacity,setCapacity]=useState(0);
   const[statusi,setStatusi]=useState([]);
    

   useEffect(()=>{
    const objekat= JSON.parse(localStorage.getItem('objekat'));
  
    object !=={} && setObject(objekat);
},[setObject])

    const handleOccupy=useCallback(async (id)=>{
            try{    
                    const url=`https://localhost:7193/UgostiteljskiObjekat/PotvrdiRezervaciju/${id}/${object.iD_Korisnik}`;
                    const response=await axios.get(url); 
                    console.log(response.data);
                    setTables(prev => {
                      return prev.map(sto => {
                        if (sto.id === response.data.id) {
                          return { ...sto, status: response.data.status };
                        }
                        return sto;
                      });
                    });
                   

                      
            }
            catch(error)
            {
              console.log(error);
            }
            
              


    },[object,setTables])

    const handleRelease=useCallback(async (id)=>{
      try{    
              const url=`https://localhost:7193/UgostiteljskiObjekat/OslobodiSto/${id}/${object.iD_Korisnik}`;
              const response=await axios.get(url); 
              console.log(response.data);
              setTables(prev => {
                return prev.map(sto => {
                  if (sto.id === response.data.id) {
                    return { ...sto, status: response.data.status };
                  }
                  return sto;
                });
              });
              


                
      }
      catch(error)
      {
        console.log(error);
      }
      
        


},[object])

const vratistolove=useCallback(async()=>{
  try{
  const url=`https://localhost:7193/Sto/VratiStolove/${object.iD_Korisnik}`;
  const response=await axios.get(url); 
 const stolovi=response.data;
 const stoloviStatusi = stolovi.map(sto => sto.status);
  console.log(response.data);
  console.log("Statusi su"+stoloviStatusi);
   setTables(stolovi);
   setStatusi(stoloviStatusi);
   console.log()
   
  }
  
  catch(error)
  {
   console.log('Neuspesno');

  }     


},[setTables,object,setStatusi])


useEffect(()=>{
  if(tables.length==0 && object.iD_Korisnik && statusi.length==0)
   vratistolove();
})

  
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="content-wrapper" style={{ flex: '1 0 auto' }}>
      <Table celled padded>
      <Table.Header>
      <Table.Row>
      
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Capacity</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Manage</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {tables.map((sto) => (
            <Table.Row key={sto.id} value={sto.id} id={sto.id}>
            
              <Table.Cell>{TipStola[sto.tip]}</Table.Cell>
              <Table.Cell>{sto.kapacitet}</Table.Cell>      
              <Table.Cell >{StatusStola[sto.status]}</Table.Cell>
              <Table.Cell> 
              {sto.status === 0 || sto.status === 1 ? (
              <button type="button" onClick={()=>handleOccupy(sto.id)}>Occupy</button>
               ) : sto.status === 2 ? (
              <button type="button" onClick={()=>handleRelease(sto.id)}>Release</button>
                ) : null}
                 
              </Table.Cell>
            </Table.Row>
          ))}      
                 

    </Table.Body>
    </Table>
    </div>
    <Footer />
    </div>
  )
}

export default UgostiteljskiObjekatHome;