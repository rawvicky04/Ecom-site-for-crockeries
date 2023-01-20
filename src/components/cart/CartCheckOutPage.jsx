import React, { useState } from 'react'
import Appbar from '../Appbar'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function CartCheckOutPage() {
    const[adderss, setAdderss] = useState("");
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const vertical = "top", horizontal = "center";
    const navigate = useNavigate();

    const handleChange = (e) =>{
        if(e.target.name === "adderss"){
            setAdderss(e.target.value);
        }
    }
    const handleSuccessSnackClose = () =>{
        setOpenSuccessSnackbar(false);
    }

    const handleSubmit = () =>{
        if(adderss.length < 30){
            alert("Please enter correct adderss..");
        }else{
            alert("Your order will be only placed, if the provided adderss is correct!");
            setOpenSuccessSnackbar(true);
            setTimeout(()=>{
                navigate("/");
            }, [2000]);
            
        }
    }
  return (
    <div>
        <Appbar/>
        {!openSuccessSnackbar && <div className='cart-checkout-page-main-component'>
            <div className='cart-checout-adderss-component'>
                <label>Enter Address</label>
                <textarea className = "cart-checkout-adderss-text-area"value={adderss} name='adderss' onChange={handleChange}/>
            </div>
            <p className='cart-checkout-message-component'>We are currently processing orders of Cash on Delivery Only.</p>
            <button className='cart-checkout-cofirm-button' onClick={handleSubmit}>Confirm Order</button>
        </div>}
        {openSuccessSnackbar && 
            <Snackbar open={openSuccessSnackbar} autoHideDuration={10000}  anchorOrigin={{ vertical , horizontal }} onClose={handleSuccessSnackClose}>
              <Alert onClose={handleSuccessSnackClose} severity="success" sx={{ width: '100%' }}>
                Your order has been successfully placed. Thanks for shopping with us.
              </Alert>
            </Snackbar>
          }
    </div>
  )
}

export default CartCheckOutPage