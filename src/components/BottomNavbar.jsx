import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircle from "@mui/icons-material/AccountCircle";
import React from 'react'
import { useNavigate } from 'react-router-dom';
import HomeIcon from "@mui/icons-material/Home";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function BottomNavbar(props) {
    const navigate = useNavigate();
    const user = useSelector((state)=> state.user.name);
    const [value, setValue] = useState(props?.value || 0);
    const handleClickHome = () =>{
        setValue(0);
        navigate("/");
    }
    const handleClickCart = () =>{
        setValue(1);
        navigate("/cart");
    }
    const handleClickOrder = () =>{
        setValue(2);
        navigate("/order");
    }
    const handleClickProfile = () =>{
        setValue(3);
        if(user) navigate("/profile");
        else navigate("/login");
    }
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
            showLabels
            value={value}
            // onChange={(event, newValue) => {
            //     setValue(newValue);
            // }}
            >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} onClick={handleClickHome}/>
            <BottomNavigationAction label="Cart" icon={<AddShoppingCartIcon />}  onClick={handleClickCart} />
            <BottomNavigationAction label="Orders" icon={<ShoppingBagIcon />} onClick={handleClickOrder} />
            <BottomNavigationAction label="Profile" icon={<AccountCircle />} onClick={handleClickProfile} />
        </BottomNavigation>
    </Paper>
  )
}

export default BottomNavbar

