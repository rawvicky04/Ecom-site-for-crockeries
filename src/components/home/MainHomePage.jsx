import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'
import photo1 from '../../crockeryImage1.jpg'
import photo2 from '../../pexels-cup-of-couple-7657610.jpg'
import photo3 from '../../crockeryImage3.jpg'
import photo4 from '../../pexels-mart-production-8217302.jpg'
import photo5 from '../../pexels-karolina-grabowska-4202328.jpg'
import photo6 from '../../white-g8e89e3edb_1920.jpg'
import './MainHomePage.css'
import { db } from '../firebase/firebase'
import { getDoc, doc, collection, getDocs } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function MainHomePage() {
    const navigate = useNavigate();
    const [productArray, setProductArray] = useState([]);
    const [productData, setProductData] = useState({});
    const [id, setId] = useState("");

    const imgArr = [
        {
            image: photo4,
        },
        {
            image: photo1,
        }, 
        {
            image: photo6,
        },
    ];

    const handleClick = async (e, id) =>{
        console.log(e.data, id);
        // setId(id);
        // await setProductData(e.data);
        navigate("/productPage", {
            state:{
                id: id,
                data: e.data,
            }
        })
    }

    const getProducts = () =>{
        setProductArray([]);
        getDocs(collection(db, "homePageProducts")).then((product)=>{
            product.forEach((prod)=>{
                console.log("Prod", prod.data().product);
                let newItem = prod.data().product;
                getDoc(doc(db, "products", newItem)).then((response)=>{
                    let item = {
                        id: response.id,
                        data: response.data()
                    }
                    console.log("Item", item);
                    setProductArray(prev => [...prev, item]);
                })
            })
            
        })
    }

    useEffect(()=>{
        getProducts();
    },[])

  return (
    <div>
        <Carousel className='main-home-page-carousel-main-component' indicators= {false} navButtonsAlwaysVisible={true}>
            {productArray.map((item, i) =>{
                return (
                    <Paper>
                        <div className='carousel-main-component' onClick={() => handleClick(item, item.id)}>
                            <div className="carousel-card" style={{"--bimg": `url(${item.data.thumbnail})`}}>
                                <div className="carousel-detail">
                                    <div className="carousel-img">
                                        <img src={item.data.thumbnail} alt="..." key={i}/>
                                        <h2 className='carousel-img-title'>{item.data.name}</h2>    
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                        
                    </Paper>
                )
                })
            }
            
        </Carousel>
    </div>
  )
}

export default MainHomePage