import React from 'react'
import { Header, Table, Rating } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import {useRef, useState, useEffect, useContext} from 'react';
import axios from '../api/axios';
import { useCallback } from 'react';
import Navbar from './Navbar';
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


function UrediStolove() {
    const navigate = useNavigate();
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
    
        const objekat= localStorage.getItem('objekat');
        if(!isLoggedIn||!objekat) navigate('/', { replace: true });
      }, [])
   
       const[type,setType]=useState('');
       const[capacity,setCapacity]=useState(0);

       const[object,setObject]=useState({});
       const[tables,setTables]=useState([]);
       const [showForm, setShowForm] = useState(false);

       const [selectedType, setSelectedType] = useState('');

       const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
      };
      console.log("Selektovani tip je " +selectedType);
      const handleCapacityChange = useCallback((event) => {
        console.log("Setuje kapacitet" + event.target.value);
        setCapacity(event.target.value);
      },[setCapacity]);
      console.log("Kapacitet je "+capacity);
       

       useEffect(()=>{
        const objekat= JSON.parse(localStorage.getItem('objekat'));
      
        object !=={} && setObject(objekat);

        
         
          
    },[setObject])
    
     console.log(object.iD_Korisnik);




       const vratistolove=useCallback(async()=>{
           try{
           const url=`https://localhost:7193/Sto/VratiStolove/${object.iD_Korisnik}`;
           const response=await axios.get(url); 
          const stolovi=response.data;
           console.log(response.data);
            setTables(stolovi);
            
           }
           
           catch(error)
           {
            console.log('Neuspesno');

           }     


       },[setTables,object])


       useEffect(()=>{
           if(tables.length==0 && object.iD_Korisnik)
            vratistolove();
       })
       

       console.log(tables);
       
       const handleAddTableClick =useCallback( () => {
        setShowForm(true);
      });

      const handleOk=useCallback(async () =>{
        try{
             console.log("Axios"+selectedType);
                if(selectedType==0)
                {
                     const url=`https://localhost:7193/Sto/DodajBarski/${capacity}/${object.iD_Korisnik}`;
                     const response=await axios.post(url);
                     console.log(response.data);
                      setTables((prev)=> [...prev, response.data])

                }
                if(selectedType==1)
                {
                     const url=`https://localhost:7193/Sto/DodajSepare/${capacity}/${object.iD_Korisnik}`;
                     const response=await axios.post(url);
                     console.log(response.data);
                      setTables((prev)=> [...prev, response.data])

                }
                if(selectedType==2)
                {
                     const url=`https://localhost:7193/Sto/DodajNiskiSto/${capacity}/${object.iD_Korisnik}`;
                     const response=await axios.post(url);
                     console.log(response.data);
                      setTables((prev)=> [...prev, response.data])

                }
                if(selectedType==3)
                {
                     const url=`https://localhost:7193/Sto/DodajSank/${capacity}/${object.iD_Korisnik}`;
                     const response=await axios.post(url);
                     console.log(response.data);
                      setTables((prev)=> [...prev, response.data])

                }
                

            }
         catch(error)
            {

            }
           setShowForm(false);  
      },[object,setShowForm,capacity]);


      const handleCancel=useCallback(()=>{
         setShowForm(false);
      },[setShowForm])

       const handleDelete=useCallback(async(id)=>{
                 try{
                            const url=`https://localhost:7193/Sto/ObrisiSto/${object.iD_Korisnik}/${id}`;
                            const response=await axios.delete(url);
                            console.log(response.data);
                            setTables((prev) => prev.filter((table) => table.id !== id))

                 }
                 catch(error)
                 {
                    console.log(error);
                 }

       })


    

  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar/>
    <div className="content-wrapper" style={{ flex: '1 0 auto' }}>
      <Table celled padded>
      <Table.Header>
      <Table.Row>
      
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Capacity</Table.HeaderCell>
        <Table.HeaderCell>Delete table</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
     
      {tables.map((sto) => (
            <Table.Row key={sto.id}>
            
              <Table.Cell>{TipStola[sto.tip]}</Table.Cell>
              <Table.Cell>{sto.kapacitet}</Table.Cell>
              <Table.Cell> <button type="button" className='DeleteTable' onClick={()=>handleDelete(sto.id)}>Delete table</button>   </Table.Cell>
            </Table.Row>
          ))}      
      </Table.Body> 
    </Table>
      <div className='tableButtons'>
      <button className='AddTable' onClick={handleAddTableClick}>Add table</button> 
      
         {showForm && (
            <form>
                <label>
                Select a table type!
                </label>
              <select id="tableType" value={selectedType} onChange={handleTypeChange}>
                {tipoviStola.map((tip)=>{
                    return <option id={tip.value} value={tip.value}>{tip.text}</option>
                })}
              </select>
              <label>
              Enter the capacity of the table.
              </label>
              <input
            type="number"
             id="tableCapacity"
             value={capacity}
             onChange={handleCapacityChange}
      />
             <button type="button" onClick={handleOk}>Ok</button>
             <button onClick={handleCancel}>Cancel</button>
            </form>
          )}

      
     
      </div>
        
      </div>
      <Footer />
    
    
  </div>
  
  )
}

export default UrediStolove;