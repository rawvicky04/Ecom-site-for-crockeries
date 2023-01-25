import React, {useState} from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PrevIcon from '@mui/icons-material/ArrowLeft';
import Fab from '@mui/material/Fab';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from './redux/CounterSlice'
import { cart } from './redux/cartProductSlice';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase/firebase'
import { setDoc, doc, addDoc, collection, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

function ProductDrawer(props) {
    console.log(props.productDetails.id);
    console.log(props.productDetails.data);
    const cartItems = useSelector((state) => state.cartProduct.product);
    const user = useSelector((state) => state.user.name);
    const userUid = useSelector((state) => state.user.uid);
    const [open, setOpen] = useState(props.open);
    const [count, setCount] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCart = async () =>{
        if(user === ""){
            navigate("/login");
        }else{
            console.log("useruid", userUid);
            const uniqId = userUid+props.id;
            const cartRef = await getDoc(doc(db, "cart", uniqId));
            const userRef = doc(db, "users", userUid);
            if(cartRef.exists()){
                let qty= cartRef.data().quantity;
                setDoc(doc(db, "cart", uniqId), {
                    productId: props.id,
                    quantity: count+qty,
                }).then((item)=>{
                    // console.log(item.id);
                    console.log(item.data());
                    // const userRef = doc(db, "users", userUid);
                    // updateDoc(userRef,{
                    //     cart_items: arrayUnion(item.id)
                    // });
                })
            }else{
                setDoc(doc(db, "cart", uniqId), {
                    productId: props.id,
                    quantity: count,
                }).then(()=>{
                    // console.log(item.id);
                    // const userRef = getDoc(doc(db, "users", userUid));
                    updateDoc(userRef,{
                        cart_items: arrayUnion(uniqId),
                    });
                })
            }
            dispatch(incrementByAmount(count));

            // let value = cartItems.findIndex(o => o.data.id === props.id);
            // console.log("value", value);
            // if(value === -1){
            //     let cartItem = {
            //         data: props,
            //         qty: count,
            //     }
            //     dispatch(cart(cartItem));
            //     dispatch(incrementByAmount(count));
            // }else{
            //     cartItems[value].qty += count;
            //     dispatch(incrementByAmount(count));
            //     // setOpen(false);
            //     // props.setOpenProductDrawer(false);
            // }
        }
        
        setOpen(false);
        props.setOpenProductDrawer(false);
    }

    const hanndleClose = () =>{
        setOpen(false);
        props.setOpenProductDrawer(false);
    }
    const handleOpen = () =>{
        setOpen(true);
    }

    const handleAdd = () =>{
        setCount(count+1);
    }

    const handleRemove = () =>{
        if(count !== 1){
            setCount(count-1);
        }
    }

    const handleProductClick = () =>{
        navigate("/productPage", {
            state: {
                id: props.productDetails.id,
                data: props.productDetails.data,
            }
        });
    }

  return (
    <SwipeableDrawer
        anchor={"bottom"}
        open={open}
        onClose={hanndleClose}
        // onOpen={handleOpen}
    >
        <div className='product-draw-left-right'>
            <Card >
                <CardActionArea>
                    <CardMedia
                    component="img"
                    height="340"
                    image={props.photo}
                    alt="green iguana"
                    onClick={handleProductClick}
                    />
                </CardActionArea>
            </Card>
            <Card>
                <CardActionArea>
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.description + " " || props.title || ""}
                        <span className='product-drawer-more-items' onClick={handleProductClick}>...more</span>
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{marginTop: "10px"}}>
                        Price - Rs. {props.price}
                    </Typography>
                    </CardContent>
                    <div className='product-drawer-fab-button'>
                        <div >
                            <Fab className='product-drawer-fab-button-circle' color="primary" aria-label="remove" sx={{marginLeft: "10px"}}
                                    onClick={handleRemove} >
                                <RemoveIcon />
                            </Fab>
                            <Fab className='product-drawer-fab-button-circle' aria-label="count" sx={{marginLeft: "10px"}}
                                    >
                                {count}
                            </Fab>
                            <Fab className='product-drawer-fab-button-circle' color="primary" aria-label="add" sx={{marginLeft: "10px"}}
                                    onClick={handleAdd} >
                                <AddIcon />
                            </Fab>
                        </div>
                        <div className='product-drawer-cart-button'>
                            <Fab color="primary" aria-label="addToCart" variant="extended" sx={{margin: "10px", marginTop: "6px"}}
                                    onClick={handleCart}
                                >
                                Add To Cart
                            </Fab>
                        </div>
                    </div>
                </CardActionArea>
            </Card>
        </div>
    </SwipeableDrawer>
  )
}

export default ProductDrawer