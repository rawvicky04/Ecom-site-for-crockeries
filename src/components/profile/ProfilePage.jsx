import React, { useState, forwardRef } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import Appbar from '../Appbar'
import './profilePage.css'
import { useNavigate, Link } from 'react-router-dom';
import BottomNavbar from '../BottomNavbar';
import { db } from '../firebase/firebase';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from 'react-redux';
import { reset } from '../redux/CounterSlice';
import { userLogout } from '../redux/userSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

function ProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const email = useSelector((state) => state.user.email);
    const uid = useSelector((state) => state.user.uid);
    const firstName = useSelector((state) => state.user.name);
    const lastName = useSelector((state) => state.user.surname);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openLogoutSuccessSnackbar, setOpenLogoutSuccessSnackbar] = useState(false);
    const[fname, setFname] = useState(firstName);
    const[lname, setLname] = useState(lastName);
    const[gender, setGender] = useState("");
    const [loading, setLoading] = useState(false);
    const vertical = "top",
    horizontal = "center";
    const handleSuccessSnackClose = () => {
        setOpenSuccessSnackbar(false);
      };

    useEffect(()=>{
        getUser();
    },[])

    const getUser = () =>{
        getDoc(doc(db, "users", uid)).then((userDetails) => {
            setFname(userDetails.data().first_name);
            setLname(userDetails.data().last_name);
            setGender(userDetails.data().gender);    
        })
    }

    const handleChange = (e) =>{
        if(e.target.name === "fname"){
            setFname(e.target.value);
        }else if(e.target.name === "lname"){
            setLname(e.target.value);
        }else if(e.target.name === "gender"){
            setGender(e.target.value);
        }
    }

    const handleUpadteProfile = () =>{
        setLoading(true);
        updateDoc(doc(db, "users", uid), {
            first_name: fname,
            last_name: lname,
            email: email,
            gender: gender,
        }).then(()=>{
            setOpenSuccessSnackbar(true);
            setLoading(false);
        })
    }

    const handleLogout = () =>{
        dispatch(reset());
        dispatch(userLogout());
        
        setOpenLogoutSuccessSnackbar(true);
        setTimeout(()=>{
            navigate("/");
        }, 3000);
    }

    // const handleAddProduct = () =>{
    //     navigate("/addProduct")
    // }
    
  return (
    <div>
        <Appbar />
        {firstName ?
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
            <button className = "profile-page-button" onClick={handleUpadteProfile}>Update Profile</button>
            <br></br>
            <button className = "profile-page-logout-button" onClick={handleLogout}>Logout</button>
        </div> : 
        <p style={{marginTop: "75px"}}>Please <Link to="/login">Login</Link> to view your profile</p>
        }
        <div className="bottom-navbar-component">
          <BottomNavbar  value={3} />
        </div>
        {openSuccessSnackbar && (
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={10000}
          anchorOrigin={{ vertical, horizontal }}
          onClose={handleSuccessSnackClose}
        >
          <Alert
            onClose={handleSuccessSnackClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Your profile has been successfully updated.
          </Alert>
        </Snackbar>
      )}
      {openLogoutSuccessSnackbar && (
        <Snackbar
          open={openLogoutSuccessSnackbar}
          autoHideDuration={10000}
          anchorOrigin={{ vertical, horizontal }}
          onClose={() => setOpenLogoutSuccessSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenLogoutSuccessSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Your have been successfully logout.
          </Alert>
        </Snackbar>
      )}
      {loading && <CircularProgress />}
    </div>
  )
}

export default ProfilePage