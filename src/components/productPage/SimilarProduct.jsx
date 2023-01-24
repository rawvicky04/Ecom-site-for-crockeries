import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  QuerySnapshot,
} from "firebase/firestore";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import "./SimilarProduct.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function SimilarProduct({ id, data }) {
  const navigate = useNavigate();
  const [productArrayData, setProductArrayData] = useState([]);
  const category = data.category;

  const findByCategory = () => {
    setProductArrayData([]);
    const q = query(
      collection(db, "products"),
      where("category", "==", category)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot?.forEach((doc) => {
        console.log("Caterory = ", category, "data = ", doc.data());
        console.log("Id = ", doc.id);
        setProductArrayData((prev) => [...prev, doc]);
      });
    });
  };

  useEffect(() => {
    findByCategory();
  }, []);

  const handleProductClick = (item) => {
    navigate("/productPage", {
      state: {
        id: item.id,
        data: item.data(),
      },
    });
  };

  return (
    <div className="similar-product-main-component">
      {(productArrayData?.length > 1) && <h2 className="similar-product-heading-component">
        Products related to this item
      </h2>}
      <div className="similar-product-all-products">
        {productArrayData.map((item, i) => {
          if(item.id !== id)
          return (
            <Card  className="similar-product-card-component" key={i}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.data().thumbnail}
                  alt={item.data().name}
                  onClick={() => handleProductClick(item)}
                />

                <CardContent className="similar-product-item-details">
                  <Typography gutterBottom variant="body1" component="div">
                    {item.data().name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.data().description || item.data().title || ""}
                  </Typography>
                  <div className="similar-product-item-details-price">
                  <Typography gutterBottom variant="body2">
                    <CurrencyRupeeIcon fontSize="small" />
                  </Typography>
                  <Typography gutterBottom variant="body1">
                    {item.data().price} / unit
                  </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default SimilarProduct;
