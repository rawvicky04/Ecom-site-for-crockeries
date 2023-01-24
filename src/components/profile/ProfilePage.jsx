import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import Appbar from '../Appbar'
import './profilePage.css'
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const navigate = useNavigate();
    const email = useSelector((state) => state.user.email);
    const uid = useSelector((state) => state.user.uid);
    const firstName = useSelector((state) => state.user.name);
    const lastName = useSelector((state) => state.user.surname);

    
    console.log(uid);
    console.log(firstName);
    const[fname, setFname] = useState(firstName);
    const[lname, setLname] = useState(lastName);
    const[gender, setGender] = useState("Male");

    useEffect(()=>{
        setFname(firstName);
        setLname(lastName);
    },[firstName, lastName])

    const handleChange = (e) =>{
        if(e.target.name === "fname"){
            setFname(e.target.value);
        }else if(e.target.name === "lname"){
            setLname(e.target.value);
        }else if(e.target.name === "gender"){
            setGender(e.target.value);
        }
    }

    // const handleAddProduct = () =>{
    //     navigate("/addProduct")
    // }
    
  return (
    <div>
        <Appbar />
        <div className='profile-page-main-component'>
            <input className='profile-page-logo' type="text" value={fname[0].toUpperCase()+ lname[0].toUpperCase()}/>
            <div className='profile-page-details'>
                <label>First Name</label>
                <input type="text" name='fname' value={fname} onChange={handleChange}/>
            </div>
            <div className='profile-page-details'>
                <label>Last Name</label>
                <input type="text" name='lname' value={lname} onChange={handleChange} />
            </div>
            <div className='profile-page-details'>
                <label>Email</label>
                <input type="text" value={email} readOnly/>
            </div>
            <div className='profile-page-details'>
                <label>Gender</label>
                <input type="text" name='gender' value={gender} onChange={handleChange}/>
            </div>
        </div>
        {/* <button onClick={handleAddProduct}>Add Product</button> */}
    </div>
  )
}

export default ProfilePage