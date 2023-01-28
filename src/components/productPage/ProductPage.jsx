import React, { useState } from "react";
import Appbar from "../Appbar";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./ProductPage.css";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SimilarProduct from "./SimilarProduct";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase";
import { setDoc, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { incrementByAmount } from "../redux/CounterSlice";
import BottomNavbar from "../BottomNavbar";

function ProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [count, setCount] = useState(1);
  const user = useSelector((state)=> state.user.name);
  const userUid = useSelector((state)=> state.user.uid);
  console.log("Location", location.state.data);

  const handleAdd = () =>{
    setCount(count+1);
  }

  const handleRemove = () =>{
      if(count !== 1){
          setCount(count-1);
      }
  }

  const handleCart = async () =>{
    if(user === ""){
        navigate("/login");
    }else{
        const uniqId = userUid + location.state.id;
        const cartRef = await getDoc(doc(db, "cart", uniqId));
        const userRef = doc(db, "users", userUid);
        if(cartRef.exists()){
            let qty= cartRef.data().quantity;
            setDoc(doc(db, "cart", uniqId), {
                productId: location.state.id,
                quantity: count+qty,
            })
        }else{
            setDoc(doc(db, "cart", uniqId), {
                productId: location.state.id,
                quantity: count,
            }).then(()=>{
                updateDoc(userRef,{
                    cart_items: arrayUnion(uniqId),
                });
            })
        }
        dispatch(incrementByAmount(count));
    }
    
}

  return (
    <div>
      <Appbar />
      <div className="product-page-main-component">
        <div className="product-page-top-component">
          <div className="product-page-image-component">
            <Carousel indicators={false} navButtonsAlwaysVisible={true}>
              {location.state.data.imageUrl.map((item, i) => {
                return (
                  <Paper>
                    <div className="product-page-paper-image">
                      <img src={item} alt={location.state.data.name} />
                    </div>
                  </Paper>
                );
              })}
            </Carousel>
          </div>

          <Paper className="product-page-details-component">
            <div className="product-page-title">
              <h2>{location.state.data.name}</h2>
            </div>
            <div className="product-page-sublabel">
              <b>
                <p>{location.state.data.subLabel}</p>
              </b>
            </div>
            <div className="product-page-description">
              <p>{location.state.data.description}</p>
            </div>
            <div className="product-page-price">
              <b>
                <p>
                  <CurrencyRupeeIcon fontSize="small" />
                </p>{" "}
              </b>
              <b>
                <p>{location.state.data.price} / unit</p>
              </b>
            </div>
            <div className="product-drawer-fab-button">
              <div>
                <Fab
                  className="product-drawer-fab-button-circle"
                  color="primary"
                  aria-label="remove"
                  onClick={handleRemove}
                >
                  <RemoveIcon />
                </Fab>
                <Fab
                  className="product-drawer-fab-button-circle"
                  aria-label="count"
                  sx={{ marginLeft: "10px" }}
                >
                  {count}
                </Fab>
                <Fab
                  className="product-drawer-fab-button-circle"
                  color="primary"
                  aria-label="add"
                  sx={{ marginLeft: "10px" }}
                  onClick={handleAdd}
                >
                  <AddIcon />
                </Fab>
              </div>
              <div className="product-drawer-cart-button">
                <Fab
                  color="primary"
                  aria-label="addToCart"
                  variant="extended"
                  sx={{ margin: "10px", marginTop: "4px" }}
                  onClick={handleCart}
                >
                  Add To Cart
                </Fab>
              </div>
            </div>
          </Paper>
        </div>
      </div>
      <SimilarProduct id={location.state.id} data={location.state.data} />
      <div className="bottom-navbar-component">
      <BottomNavbar value={0} /></div>
      {user && <div className="bottom-navbar-component">
          <BottomNavbar/>
        </div>}
    </div>
  );
}

export default ProductPage;
