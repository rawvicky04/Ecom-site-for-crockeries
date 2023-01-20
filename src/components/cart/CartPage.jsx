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
import './cartPage.css';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cartProduct.product);
    const user = useSelector((state) => state.user.name);
    console.log("Cart Items", cartItems);
    const userUid = useSelector((state) => state.user.uid);
    const [cartArray, setCartArray] = useState([]);
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    let sumOfCart = 0;
    useEffect(()=>{
      if(user !== ""){
        setLoading(true);
        setCartArray([]);
        getDoc(doc(db,"users", userUid)).then((userDetails)=>{
          if(userDetails.data().cart_items.length === 0){
            setLoading(false);
          }
          userDetails.data().cart_items.forEach(item => {
            
            console.log(item);
            getDoc(doc(db,"cart", item)).then((cartItem)=>{
              console.log("cart item", cartItem.data());
              getDoc(doc(db,"products", cartItem.data().productId)).then((productDetails) => {
                sumOfCart += (productDetails.data().price * cartItem.data().quantity);
                let cartDetails = {
                  productName : productDetails.data().name,
                  productDescription : productDetails.data().description,
                  productImage : productDetails.data().imageUrl,
                  productPrice : productDetails.data().price,
                  productQty : cartItem.data().quantity,
                  totalPrice : productDetails.data().price * cartItem.data().quantity,
                  cartId: item,
                  productId: cartItem.data().productId,

                }
                setTotalCartPrice(sumOfCart);
                setCartArray(prev => [...prev, cartDetails]);
                setLoading(false);
              })
            })
            
          })
        })
        
      }
      
    },[flag])

    const fetchUser = async () => {
      const userDetails = await getDoc(doc(db,"users", "iuShFoFRRXNk2bx9wsgSYXrebE73"));
      console.log("userDetails", userDetails.data());
    }

    const handleCartItemRemove = (e) =>{
      console.log(e);
      const userRef = doc(db, "users", userUid);
      deleteDoc(doc(db, "cart", e));

      updateDoc(userRef, {
        cart_items: arrayRemove(e)
      })
      setCartArray([]);
      setFlag(!flag);
      setLoading(false);
    }

    const handleCartCheckout = () =>{
      navigate("/checkout");
    }

    const handleRemoveCartItem = (e, id) =>{
      
      console.log(e);
      getDoc(doc(db, "cart", e)).then(item => {
        if(item.data().quantity === 1){
          handleCartItemRemove(e);
        }else{
          setDoc(doc(db, "cart", e), {
            productId: id,
            quantity : item.data().quantity-1
          })
        }
        setCartArray([]);
        setFlag(!flag);
        setLoading(false);
      })
    }

    const handleAddCartItem = (e, id) =>{
      console.log(e);
      getDoc(doc(db, "cart", e)).then(item => {
        setDoc(doc(db, "cart", e), {
          productId: id,
          quantity : item.data().quantity+1
        }) 
        setCartArray([]);
        setFlag(!flag);
        setLoading(false);
      })
    }

    const docRef = () =>
      cartItems.map((product) =>(
        addDoc(collection(db, "products"), {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl
        }
      )));
  
    const querySnap = async () => {
      await getDocs(collection(db,"products")).then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          console.log(doc.id);
          console.log(doc.data())
        });
      }); 
    }
  
  return (
    <div>
        <Appbar />
        <h1 style={{marginTop: "70px"}} 
          // onClick={fetchUser}
        >Cart Items</h1>
        {
        user === "" 
          ? 
            <p>Please <Link to="/login">Login</Link> to view items in your cart</p> 
          :
            cartArray.map((product) => {
              console.log(product);
              const list = (
                <div className="cartPage-product-list">
                  <div className = 'cartPage-image'>
                      <img src={product.productImage} alt={product.productName} />
                  </div>
                  <div className='cartPage-product-details'>
                    <h2>
                        {product.productName}
                    </h2>
                    <p className='cartPage-product-desc'>
                        {product.productDescription}
                    </p>
                    
                    <div style={{display: "flex"}}>
                      <p style={{marginTop: "14px"}}>Price Per Unit - </p>
                      <p><CurrencyRupeeIcon fontSize='small'/></p>  
                      <p style={{marginTop: "14px"}}>{product.productPrice}</p>
                    </div>
                  </div>
                  <div className='cartPage-price-details'>
                    <div className='cartPage-fab-button-circle'>
                      <h3 className='cartPage-fab-button-title'><b>{product.productName}</b></h3>
                      <p>
                          <b>Quantity In Cart </b>
                      </p>
                      <div >
                      <Fab className='cartPage-add-remove-fab-button' color="primary" aria-label="remove" sx={{marginLeft: "10px"}}
                              onClick={() => handleRemoveCartItem(product.cartId, product.productId)} 
                              >
                          <RemoveIcon />
                      </Fab>
                      <Fab className='cartPage-add-remove-fab-button'  aria-label="count" sx={{marginLeft: "10px", cursor: "default"}}
                              >
                          {product.productQty}
                      </Fab>
                      <Fab className='cartPage-add-remove-fab-button' color="primary" aria-label="add" sx={{marginLeft: "10px"}}
                              onClick={() => handleAddCartItem(product.cartId, product.productId)} 
                              >
                          <AddIcon />
                      </Fab>
                      </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <p style={{marginTop: "14px"}}><b>Price</b> -</p> 
                        <p> <CurrencyRupeeIcon fontSize='small'/> </p>
                        <p style={{marginTop: "14px"}}>{product.totalPrice}</p>
                    </div>
                    <Button variant='contained' sx={{margin: "10px"}}
                      onClick={() => handleCartItemRemove(product.cartId)}
                    >Remove</Button>
                  </div>
                </div>
              );
              return list;
            })
        }
        {
          user === "" || cartArray.length === 0
            ?
              <></>
            :
              <div className='cart-page-checkout-component'>
                <div className='cart-page-total-cart-price-component'>
                  <p>Total Cart Value</p>
                  <p> <CurrencyRupeeIcon fontSize='small'/> </p>
                  <p>{totalCartPrice}</p>
                </div>
                <button className='cart-page-checkout-final-button' onClick={handleCartCheckout}>Proceed To Checkout</button>
              </div>
        }
        {loading && <CircularProgress />}
    </div>
  )
}

export default CartPage