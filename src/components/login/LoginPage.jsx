import { Button } from '@mui/material';
import React, { useState } from 'react'
import Appbar from '../Appbar';
import './LoginPage.css'
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { userName } from '../redux/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function LoginPage() {

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) =>{
        if(event.target.name === "email"){
            setUser(event.target.value);
        }if(event.target.name === "password"){
            setPassword(event.target.value);
        }
    }

    const handleSubmit = e =>{
        e.preventDefault();
        signInWithEmailAndPassword(auth, user, password)
        .then((userCredential) => {
            const user = userCredential.user;
            dispatch(userName(user));
            navigate("/");
            
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    }
    
  return (
    
    <div>
        <Appbar />
        <div className='login-page-main-component'>
            <LockOutlinedIcon fontSize='large'/>
            <h2>Sign In</h2>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '28ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <TextField id="standard-basic" label="Email" variant="standard" name='email' onChange={handleChange}/>
                <br></br>
                <TextField id="standard-adornment-password" label="Password" variant="standard" type={"password"} name = 'password' onChange={handleChange}/>
                <br></br>
                <Button variant="contained" endIcon={<SendIcon />} onClick={e => handleSubmit(e)} sx={{width: "32ch !important"}}>
                    Sign In
                </Button>
                
            </Box>
            <Link to="/signUp" style={{textDecoration: "none", color: "blue"}}> <Typography sx={{marginLeft: 0.4}}>Don't have an account? Sign Up</Typography> </Link>
        </div>
    </div>
  )
}

export default LoginPage