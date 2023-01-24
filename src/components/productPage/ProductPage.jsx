import React from "react";
import Appbar from "../Appbar";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import "./ProductPage.css";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SimilarProduct from "./SimilarProduct";

function ProductPage() {
  const location = useLocation();
  console.log("Location", location.state.data);
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
              <b><p>{location.state.data.subLabel}</p></b>
            </div>
            <div className="product-page-description">
              <p>{location.state.data.description}</p>
            </div>
            <div className="product-page-price">
               <b><p><CurrencyRupeeIcon fontSize='small'/></p> </b>
               <b><p>{location.state.data.price} / unit</p></b>
            </div>
          </Paper>
        </div>
      </div>
      <SimilarProduct id={location.state.id} data={location.state.data} />
    </div>
  );
}

export default ProductPage;
