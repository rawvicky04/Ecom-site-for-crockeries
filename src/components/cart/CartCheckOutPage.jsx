import React, { useState, useEffect } from 'react'
import Appbar from '../Appbar'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { cities } from './StateAndCitites';
import { getDoc, doc, addDoc, collection, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';


const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const stateOfIndia = [ "","Andhra Pradesh", "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jammu and Kashmir",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttarakhand",
                "Uttar Pradesh",
                "West Bengal",
                "Andaman and Nicobar Islands",
                "Chandigarh",
                "Dadra and Nagar Haveli",
                "Daman and Diu",
                "Delhi",
                "Lakshadweep",
                "Puducherry"]


function CartCheckOutPage() {

    const userUid = useSelector((state)=> state.user.uid);
    const[landmark, setLandmark] = useState("");
    const[houseNumber, setHouseNumber] = useState("");
    const[state, setState] = useState("");
    const[city, setCity] = useState("");
    const[cityArray, setCityArray] = useState([]);
    const[addressl1, setAddressL1] = useState("");
    const[addressl2, setAddressL2] = useState("");
    const[orderItem, setOrderItem] = useState([]);
    const[cartIdsOfUser, setCartIdsOfUser] = useState([]);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const vertical = "top", horizontal = "center";
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pincode, setPincode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    useEffect(()=>{
      setOrderItem([]);
      setCartIdsOfUser([]);
      getDoc(doc(db,"users", userUid)).then((userDetails)=>{
        userDetails.data().cart_items.forEach(item => {
          console.log(item);
          setCartIdsOfUser(prev => [...prev, item]);
          getDoc(doc(db,"cart", item)).then((cartItem)=>{
            console.log("cart item", cartItem.data());
            getDoc(doc(db,"products", cartItem.data().productId)).then((productDetails) => {
              let orderObj = {
                productId: cartItem.data().productId,
                quantity : cartItem.data().quantity,
                price : productDetails.data().price,
                date: new Date().getDate() + "-" + ((new Date()).getMonth()+1) + "-" + (new Date()).getFullYear(),
              }
              setOrderItem((prev) => [...prev, orderObj]);
            },
            )
          })
        })   
      })
    },[])


    const handleChange = (e) =>{
        if(e.target.name === "landmark"){
          setLandmark(e.target.value);
        }else if(e.target.name === "houseNumber"){
          setHouseNumber(e.target.value);
        }else if(e.target.name === "city"){
          setCity(e.target.value);
        }else if(e.target.name === "state"){
          setCityArray(cities[e.target.value]);
          setState(e.target.value);
          if(cities[e.target.value]) {
            setCity((cities[e.target.value])[0].city)
          }else{
            setCity("");
          }
        }else if(e.target.name === "addressl1"){
          setAddressL1(e.target.value);
        }else if(e.target.name === "addressl2"){
          setAddressL2(e.target.value);
        }else if(e.target.name === "pincode"){
          setPincode(e.target.value);
        }else if(e.target.name === "phoneNumber"){
          setPhoneNumber(e.target.value);
        }
    }
    const handleSuccessSnackClose = () =>{
        setOpenSuccessSnackbar(false);
    }

    const saveAddress = (e) =>{
      e.preventDefault();
      const userRef = doc(db, "users", userUid);
      addDoc(collection(db, "address"),{
        houseNumber: houseNumber,
        addressLine1: addressl1,
        addressLine2: addressl2,
        city: city,
        state: state,
        pincode: pincode,
        landmark: landmark,
        phoneNumber: phoneNumber,
      }).then((addressResponse)=>{
        updateDoc(userRef, {
          address: arrayUnion(addressResponse.id)
        });
      })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(houseNumber.length === 0 || state.length < 3 || city.length < 2){
          console.log(houseNumber, city, state);
            alert("Please enter correct adderss..");
        }else{
            setLoading(true);
            const userRef = doc(db, "users", userUid);
            console.log("Order Item after await", orderItem);
            addDoc(collection(db, "orders"), {
              orderItems : orderItem
            }).then((orderRef) => {
              updateDoc(userRef,{
                orders: arrayUnion(orderRef.id),
              }).then(()=>{
                cartIdsOfUser?.forEach((cartId)=>{
                  updateDoc(userRef, {
                    cart_items: arrayRemove(cartId)
                  });
                  deleteDoc(doc(db, "cart", cartId));
                })
                  setLoading(false);
                  setOpenSuccessSnackbar(true);
                  setTimeout(()=>{
                        navigate("/");
                  }, [2000])
                
              })   
          })
            
        }
    }
  return (
    <div>
        <Appbar/>
        {!openSuccessSnackbar && <form className='cart-checkout-page-main-component' onSubmit={saveAddress}>
            <h3>Enter Address Details</h3>
            <div>
              <div className='cart-checout-adderss-component'>
                <label>Flat/House No.</label>
                <input type="text" className = "cart-checkout-adderss-text-area"value={houseNumber} name='houseNumber' onChange={handleChange} required/>
              </div>
              <div className='cart-checout-adderss-component'>
                <label>Address Line 1</label>
                <input type="text" className = "cart-checkout-adderss-text-area"value={addressl1} name='addressl1' onChange={handleChange} required/>
              </div>
              <div className='cart-checout-adderss-component'>
                <label>Address Line 2</label>
                <input type="text" className = "cart-checkout-adderss-text-area"value={addressl2} name='addressl2' onChange={handleChange}/>
              </div>
              <div className='cart-checout-adderss-component'>
                <label>State</label>
                <select type="text" className = "cart-checkout-adderss-text-area"value={state} name='state' onChange={handleChange} required>
                  {stateOfIndia.map((obj)=>{
                    let temp = (
                      <option value={obj}>{obj}</option>
                    )
                    return temp;
                  }
                  )
                  }
                </select>
              </div>
              <div className='cart-checout-adderss-component'>
                <label>City</label>
                <select type="text" className = "cart-checkout-adderss-text-area"value={city} name='city' onChange={handleChange} required disabled={cityArray ? cityArray?.length === 0 : true}>
                  
                  {cityArray?.map((obj) => {
                    let temp = (
                      <option key={obj.id} value={obj.city}>{obj.city}</option>
                    )
                    return temp;
                  })}
                </select>
              </div>
              <div className='cart-checout-adderss-component'>
                <label>Pincode</label>
                <input type="text" className = "cart-checkout-adderss-text-area"value={pincode} name='pincode' onChange={handleChange} required/>
              </div>
              <div className='cart-checout-adderss-component'>
                <label>Phone Number</label>
                <input type="text" className = "cart-checkout-adderss-text-area"value={phoneNumber} name='phoneNumber' onChange={handleChange} required minLength={10} maxLength={10}/>
              </div>
              <div className='cart-checout-adderss-component'>
                <label>Landmark</label>
                <input type="text" className = "cart-checkout-adderss-text-area"value={landmark} name='landmark' onChange={handleChange}/>
              </div>
            </div>
            <p className='cart-checkout-message-component'>Note: We are currently processing orders of Cash on Delivery Only.</p>
            <button className='cart-checkout-cofirm-button'  >Save Address</button>
            <button className='cart-checkout-cofirm-button' onClick={handleSubmit} >Confirm Order</button>
        </form>}
        {openSuccessSnackbar && 
            <Snackbar open={openSuccessSnackbar} autoHideDuration={10000}  anchorOrigin={{ vertical , horizontal }} onClose={handleSuccessSnackClose}>
              <Alert onClose={handleSuccessSnackClose} severity="success" sx={{ width: '100%' }}>
                Your order has been successfully placed. Thanks for shopping with us.
              </Alert>
            </Snackbar>
        }
        {loading && <CircularProgress />}
    </div>
  )
}

export default CartCheckOutPage