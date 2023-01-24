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
        <h1 style={{marginTop: "70px"}}
        >Your Order</h1>
        <div>
          {ordersItemArray.map((orderId, i)=>{
            let sum = 0;
            return (
              <div className='order-page-orders'>
                <h3>Order {i+1}</h3>
                {console.log("Order Filter",(ordersArray.filter((item) => item.orderId === orderId)[0])?.data)}
                {ordersArray.filter((item) => item.orderId === orderId)[0]?.data?.orderItems.map((orderItem)=>{
                  let tempObj = productArray.filter((item)=> item.id === orderItem.productId)[0]?.data;
                  sum += orderItem?.price * orderItem?.quantity;
                  return (
                    <div className='order-page-order-items'>
                      <div className='order-page-order-items-image'>
                        <img src={tempObj?.thumbnail} alt={tempObj?.name} />
                      </div>
                      <div className='order-page-order-items-details'>
                        <h3>{tempObj?.name}</h3>
                        <p>Ordered Price : {orderItem.price}</p>
                        <p>Ordered Quantity: {orderItem.quantity}</p>
                      </div> 
                    </div>
                  )
                })}
                <div>
                  <h3>Total Order Price: {sum}</h3>
                </div>
              </div>
            )
          })}
        </div>

        {loading && <CircularProgress />}
    </div>
  )
}

export default OrderPage