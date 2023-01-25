import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import NextIcon from "@mui/icons-material/ArrowRight";
import PrevIcon from "@mui/icons-material/ArrowLeft";
import Fab from "@mui/material/Fab";
import { CardActionArea } from "@mui/material";
import photo1 from "../crockeryImage1.jpg";
import photo2 from "../crockeryImage2.jpg";
import photo3 from "../crockeryImage3.jpg";
import disPhoto1 from "../displayPhoto1.jpg";
import disPhoto2 from "../displayPhoto2.jpg";
import disPhoto3 from "../displayPhoto3.jpg";
import Appbar from "./Appbar";
import "./Home.css";
import ProductDrawer from "./ProductDrawer";
import { collection, getDocs, addDoc, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { incrementByAmount } from "./redux/CounterSlice";
import MainHomePage from "./home/MainHomePage";
import BottomNavbar from "./BottomNavbar";

const imgArr = [photo1, photo2, photo3];

function MainPage() {
  const storage = getStorage();
  const [photoName, setPhotoName] = useState(0);
  const [openProductDrawer, setOpenProductDrawer] = useState(false);
  const [title, setTitle] = useState("");
  const [drawerPhoto, setDrawerPhoto] = useState("");
  const [desc, setDesc] = useState("");
  const [products, setProducts] = useState([]);
  const [productPrice, setProductPrice] = useState("");
  const [productId, setProductId] = useState("");
  const [productDetails, setProductDetails] = useState({});
  const userUid = useSelector((state) => state.user.uid);
  const dispatch = useDispatch();

  useEffect(() => {
    setProducts([]);
    getDocs(collection(db, "products")).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data());
        let val = {
          id: doc.id,
          data: doc.data(),
        };
        // setProducts(prev => [...prev, doc.data()]);
        setProducts((prev) => [...prev, val]);
      });
    });
    console.log("Use Product", products);
  }, []);

  const handleProductDrawer = (title, photo, desc, price, id, prodDetails) => {
    setTitle(title);
    setDrawerPhoto(photo);
    setDesc(desc);
    setOpenProductDrawer(true);
    setProductPrice(price);
    setProductId(id);
    setProductDetails(prodDetails);
  };

  const handleNext = () => {
    if (photoName === imgArr.length - 1) {
      setPhotoName(0);
    } else {
      setPhotoName(photoName + 1);
    }
  };

  const handlePrev = () => {
    if (photoName === 0) {
      setPhotoName(2);
    } else {
      setPhotoName(photoName - 1);
    }
  };

  const querySnap = async () => {
    await getDocs(collection(db, "products")).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        console.log(doc.id);
        console.log(doc.data());
      });
    });
  };

  return (
    <div>
      <Appbar />
      <MainHomePage />
      <div className="mainpage-main-component">
        <div className="mainpage-products-component">
          {(products.length === 0 ? [] : products).map((product, index) => {
            const list = (
              <Card
                onClick={(e) =>
                  handleProductDrawer(
                    product.data.name,
                    product.data.thumbnail,
                    product.data.description,
                    product.data.price,
                    product.id,
                    product
                  )
                }
                key={index}
                className="mainpage-card-component"
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.data.thumbnail}
                    alt="green iguana"
                  />

                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.data.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.data.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
            return list;
          })}
        </div>
        {openProductDrawer && (
          <ProductDrawer
            title={title}
            photo={drawerPhoto}
            description={desc}
            open={true}
            price={productPrice}
            id={productId}
            productDetails={productDetails}
            setOpenProductDrawer={setOpenProductDrawer}
          />
        )}
      </div>
      <div className="bottom-navbar-component">
      <BottomNavbar/>
      </div>
      
    </div>
  );
}

export default MainPage;
