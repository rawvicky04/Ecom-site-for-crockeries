import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
        createUserWithEmailAndPassword(auth, email, password).
        then((userCredential) => {
            console.log("User credential", userCredential.user);
            console.log("Uid", userCredential.user.uid);
            setDoc(doc(db, "users", userCredential.user.uid), {
                first_name: firstName,
                last_name: lastName,
                email: email,
                gender: "",
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
                <TextField id="standard-basic" label="First Name" variant="standard" name='fname' onChange={handleChange}/>
                <br></br>  
                <TextField id="standard-basic" label="Last Name" variant="standard" name='lname' onChange={handleChange}/>
                <br></br> 
                <TextField id="standard-basic" label="Email" variant="standard" name='email' onChange={handleChange}/>
                <br></br>
                <TextField id="standard-adornment-password" label="Password" variant="standard" type={"password"} name = 'password' onChange={handleChange}/>
                <br></br>
                <Button variant="contained" endIcon={<SendIcon />} onClick={e => handleSubmit(e)} sx={{width: "32ch !important"}}>
                    Sign Up
                </Button>
                
            </Box>
            <Link to="/login" style={{textDecoration: "none", color: "blue"}}> <Typography sx={{marginLeft: 0.4}}>Already have an account? Sign In</Typography></Link>
        </div>
    </div>
  )
}

export default SignUpPage