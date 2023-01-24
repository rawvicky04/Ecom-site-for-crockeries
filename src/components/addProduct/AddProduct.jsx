import React, {useState} from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db } from '../firebase/firebase'
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { v4 } from "uuid"
import './AddProduct.css'
import Appbar from '../Appbar'

function AddProduct() {
  const[image, setImage] = useState(null);
  const[productName, setProductName] = useState("");
  const[productSubLabel, setProductSubLabel] = useState("");
  const[productCategory, setProductCategory] = useState("");
  const[productDescription, setProductDescription] = useState("");
  const[productPrice, setProductPrice] = useState(0);
  const[productThumbnailImage, setProductThumbnailImage] = useState(null);

  const handleChange = (e) =>{
    if(e.target.name === "image"){
      setImage(e.target.files);
    }else if(e.target.name === "productName"){
      setProductName(e.target.value);
    }else if(e.target.name === "productSubLabel"){
      setProductSubLabel(e.target.value);
    }else if(e.target.name === "productCategory"){
      setProductCategory(e.target.value);
    }else if(e.target.name === "productDescription"){
      setProductDescription(e.target.value);
    }else if(e.target.name === "productPrice"){
      setProductPrice(e.target.value);
    }else if(e.target.name === "thumbnail"){
      console.log(e.target.files);
      setProductThumbnailImage(e.target.files);
    }

  }

  const handleAddProduct = (e) =>{
    e.preventDefault();
    if(image === null || productName.length === 0 || productSubLabel.length === 0 
      || productCategory.length === 0 || productDescription.length === 0 || productPrice === 0){
      return alert("Please fill all the  required fields..")
    }

    addDoc(collection(db, "products"), {
      name: productName,
      description: productDescription,
      price: productPrice,
      subLabel: productSubLabel,
      category: productCategory,
      imageUrl: []
    }).then((productResponse) =>{
      const prodRef = doc(db, "products", productResponse.id);
      console.log(productResponse);
      const thumbRef = ref(storage, `Product Images/${productThumbnailImage[0].name + v4()}`);
      uploadBytes(thumbRef, productThumbnailImage[0]).then((thumbRes)=>{
        const thumbPathRef = ref(storage, thumbRes.metadata.fullPath);
        getDownloadURL(thumbPathRef).then((url)=>{
          // console.log("Download url", url);
          updateDoc(prodRef, {
            thumbnail: url,
          }).then(()=>{
            alert("Thumbnail Uploaded Successfully")
          })
        })
        
      })
      for(let i = 0; i < image?.length || 0; i++){
        const imageRef = ref(storage, `Product Images/${image[i].name + v4()}`);
        uploadBytes(imageRef, image[i]).then((response)=>{
          // console.log(response.metadata.fullPath);
          const pathRef = ref(storage, response.metadata.fullPath);
          getDownloadURL(pathRef).then((url)=>{
            // console.log("Download url", url);
            updateDoc(prodRef,{
              imageUrl: arrayUnion(url),
            })
          })
          alert("Image Uploaded");
        })
      }
    })

    
  }

  return (
    <div className='add-product-root'>
      <Appbar />
      <h3>Add Product</h3>
      <div className="add-product-main-component">
        <form className='add-product-form-component'>
          <div className='add-product-fields-component'>          
            <div className='add-product-fields-component-field'>
              <label>Product Name</label>
              <input type="text" name='productName' value={productName} onChange={handleChange} required/>
            </div>
            <div className='add-product-fields-component-field'>
              <label>Product Sub Label</label>
              <input type="text" name='productSubLabel' value={productSubLabel} onChange={handleChange} required/>
            </div>
            <div className='add-product-fields-component-field'>
              <label>Product Category</label>
              <input type="text" name='productCategory' value={productCategory}  onChange={handleChange} required/>
            </div>
            <div className='add-product-fields-component-field'>
              <label>Product Description</label>
              <input type="text" name='productDescription' value={productDescription}  onChange={handleChange} required/>
            </div>
            <div className='add-product-fields-component-field'>
              <label>Product Price</label>
              <input type="number" name='productPrice' value={productPrice}  onChange={handleChange} required/>
            </div>
            <div className='add-product-fields-component-field'>
              <label>Product Thumbnail Image</label>
              <input type="file" name='thumbnail' onChange={(e) => handleChange(e)} required/>
              
            </div> 
            <div className='add-product-fields-component-field'>
              <label>Product Images</label>
              <input type="file" name='image' onChange={(e) => handleChange(e)} multiple required/>
              
            </div> 
          </div>
          <button className='add-product-sumbit-button' onClick={handleAddProduct}>Add Product</button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct