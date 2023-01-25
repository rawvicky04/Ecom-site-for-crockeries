import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import SendIcon from '@mui/icons-material/Send';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography } from '@mui/material';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Appbar from '../Appbar';
import { Button } from '@mui/material';
import { userName } from '../redux/userSlice';
import { Link } from 'react-router-dom';

function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) =>{
        if(event.target.name === "email"){
            setEmail(event.target.value);
        }else if(event.target.name === "password"){
            setPassword(event.target.value);
        }else if(event.target.name === "fname"){
            setFirstName(event.target.value);
        }else if(event.target.name === "lname"){
            setLastName(event.target.value);
        }
    }

    const handleSubmit = e =>{
        e.preventDefault();
        if(firstName.length <= 0){
            alert("Please Enter your first name..")
            return;
        }else if(lastName.length <= 0){
            alert("Please Enter your last name..")
            return;
        }else if(email.length <= 0){
            alert("Please Enter your email first..")
            return;
        }else if(lastName.length <= 0){
            alert("Please Enter your password. So that you can login at later stage")
            return;
        }
        createUserWithEmailAndPassword(auth, email, password).
        then((userCredential) => {
            console.log("User credential", userCredential.user);
            console.log("Uid", userCredential.user.uid);
            setDoc(doc(db, "users", userCredential.user.uid), {
                first_name: firstName,
                last_name: lastName,
                email: email,
                gender: "",
                orders: [],
                cart_items: [],
                address: [],
            });
            let userObj = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                accessToken: userCredential.user.accessToken,
                uid: userCredential.user.uid
            }
            dispatch(userName(userObj));
            navigate("/");
        })
        .catch((error) => {
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + errorMessage);
          });
    }

  return (
    <div>
        <Appbar />
        <div className='signup-page-main-component'>
            <LockOutlinedIcon fontSize='large'/>
            <h2>Sign Up</h2>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '28ch' },
                }}
                noValidate
                autoComplete="off"
                
                >
                <TextField label="First Name" variant="standard" name='fname' onChange={handleChange} required/>
                <br></br>  
                <TextField label="Last Name" variant="standard" name='lname' onChange={handleChange} required/>
                {/* <br></br> 
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Age
                </InputLabel>
                <NativeSelect
                    defaultValue={30}
                    inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                    }}
                >
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                </NativeSelect> */}
                <br></br>
                <TextField id="standard-basic" label="Email" variant="standard" name='email' onChange={handleChange} required/>
                <br></br>
                <TextField id="standard-adornment-password" label="Password" variant="standard" type={"password"} name = 'password' onChange={handleChange} required/>
                <br></br>
                <Button variant="contained" onClick={e => handleSubmit(e)} endIcon={<SendIcon />} sx={{width: "32ch !important"}}>
                    Sign Up
                </Button>   
            </Box>
            <Link to="/login" style={{textDecoration: "none", color: "blue"}}> <Typography sx={{marginLeft: 0.4}}>Already have an account? Sign In</Typography></Link>
        </div>
    </div>
  )
}

export default SignUpPage