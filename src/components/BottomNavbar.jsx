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

function BottomNavbar() {
    const navigate = useNavigate();
    const [value, setValue] = useState(4);
    const handleClickCart = () =>{
        navigate("/cart");
    }
    const handleClickOrder = () =>{
        navigate("/order");
    }
    const handleClickProfile = () =>{
        navigate("/profile");
    }
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            >
                
            <BottomNavigationAction label="Cart" icon={<AddShoppingCartIcon />} onClick={handleClickCart}/>
            <BottomNavigationAction label="Orders" icon={<ShoppingBagIcon />} onClick={handleClickOrder} />
            <BottomNavigationAction label="Profile" icon={<AccountCircle />} onClick={handleClickProfile} />
        </BottomNavigation>
    </Paper>
  )
}

export default BottomNavbar

