import React, { useEffect, useState } from 'react'
import Appbar from '../Appbar'
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc, arrayRemove, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { getValue } from '@mui/system';
import '../cart/cartPage.css';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css';
import BottomNavbar from '../BottomNavbar';

function OrderPage() {
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cartProduct.product);
    const user = useSelector((state) => state.user.name);
    console.log("Cart Items", cartItems);
    const userUid = useSelector((state) => state.user.uid);
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ordersArray, setOrderArray] = useState([]);
    const [ordersItemArray, setOrdersItemArray] = useState([]);
    const [productArray, setProductArray] = useState([]);
    let sum = 0;

    let sumOfCart = 0;

    useEffect(()=>{
      if(user){
        setOrdersItemArray([]);
        setLoading(true);
        setOrderArray([]);
        getDoc(doc(db,"users", userUid)).then((userDetails)=>{
          if(userDetails.data().orders.length === 0){
            setLoading(false);
          }
          userDetails.data().orders.forEach(item => {
            setOrdersItemArray(prev => [...prev, item]);
            getDoc(doc(db,"orders", item)).then((orderItem)=>{
              console.log("Order item", orderItem.data());
              let tempOrder = {
                orderId: orderItem.id,
                data: orderItem.data()
              }
              setOrderArray(prev => [...prev, tempOrder]);
              console.log("Order Array", ordersArray);
              console.log("Order Items Array", ordersItemArray);
              // setLoading(false);
              orderItem.data().orderItems.forEach((orderProduct) => {
                getDoc(doc(db,"products", orderProduct.productId)).then((productDetails) => {
                    let orderProductDetails = {
                      id: productDetails.id,
                      data: productDetails.data(),
                    }
                    setProductArray(prev => [...prev, orderProductDetails]);
                    setLoading(false);
                  })
              })
              
            })
            
          })
        })
        
      }
      
    },[flag])
  
  return (
    <div>
        <Appbar />
        {user ? <><h1 style={{marginTop: "70px"}}
        >Your Order</h1>
        <div>
          {ordersItemArray.length === 0 ? <p>You have not ordered anything yet. Please <Link to="/" style={{textDecoration: "none"}}> Order </Link>  to view your orders history.</p> : ordersItemArray.map((orderId, i)=>{
            let sum = 0;
            return (
              <div className='order-page-orders'>
                {console.log("Order Filter",(ordersArray.filter((item) => item.orderId === orderId)[0])?.data)}
                {ordersArray.filter((item) => item.orderId === orderId)[0]?.data?.orderItems.map((orderItem)=>{
                  let tempObj = productArray.filter((item)=> item.id === orderItem.productId)[0]?.data;
                  sum += orderItem?.price * orderItem?.quantity;
                  return (
                    <div className='order-page-order-items'>
                      <div className='order-page-order-items-image'>
                        <img src={tempObj?.thumbnail} alt={tempObj?.name} />
                      </div>
                      {/* <div className='order-page-order-items-details'>
                        <h3>{tempObj?.name}</h3>
                        <p>Ordered Price : {orderItem.price}</p>
                        <p>Ordered Quantity: {orderItem.quantity}</p>
                      </div> */}
                      <div className='order-page-order-items-details'>
                        <h3>{tempObj?.name}</h3>
                        <div style={{display: "flex",}} >
                          <p style={{marginTop: "14px"}}><b>Ordered Price</b> -</p> 
                          <p> <CurrencyRupeeIcon fontSize='small'/> </p>
                        <p style={{marginTop: "14px"}}>{orderItem.price} </p>
                        </div> 
                        <p style={{margin: 0}}><b>Ordered Quantity</b> - {orderItem.quantity} unit/s</p>
                      </div> 
                      <div className='order-page-buy-view-button'>
                        <button className='order-page-buy-button'>Buy it again</button>
                        <button className='order-page-view-button'>View more details</button>
                      </div>
                    </div>
                  )
                })}
                {/* <div className='order-page-total-sum'>
                  <h3>Total Order Price: <span style={{marginTop: "105px"}}><CurrencyRupeeIcon fontSize='small'/></span> {sum}</h3>
                </div> */}
                <div className='order-page-total-sum'>
                          <h3 style={{marginTop: "14px"}}><b>Total Order Price</b> -</h3> 
                          <p> <CurrencyRupeeIcon fontSize='small'/> </p>
                        <p style={{marginTop: "14px"}}>{sum} </p>
                        </div> 
              </div>
            )
          })}
        </div>
        </>:
        <p style={{marginTop: "75px"}}>Please <Link to="/login">Login</Link> to view your Order</p>
        }
        {user && <div className="bottom-navbar-component">
          <BottomNavbar/>
        </div>}
        {loading && <CircularProgress />}
    </div>
  )
}

export default OrderPage