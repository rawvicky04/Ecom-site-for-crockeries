import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Appbar from './components/Appbar';
import MainPage from './components/MainPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CartPage from './components/cart/CartPage';
import { useDispatch, useSelector } from 'react-redux';
import LoginPage from './components/login/LoginPage';
import SignUpPage from './components/login/SignUpPage';
import { useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './components/firebase/firebase';
import { incrementByAmount } from './components/redux/CounterSlice';
import ProfilePage from './components/profile/ProfilePage';
import CartCheckOutPage from './components/cart/CartCheckOutPage';
import OrderPage from './components/orders/OrderPage';
import MainHomePage from './components/home/MainHomePage';
import AddProduct from './components/addProduct/AddProduct';
import ProductPage from './components/productPage/ProductPage';
import AdminPage from './components/admin/AdminPage';
import AdminHandler from './components/admin/AdminHandler';

function App() {
  const admin = useSelector((state) => state.user.name);
  const accessToken = useSelector((state) => state.user.accessToken);
  const userUid = useSelector((state)=> state.user.uid);
  const dispatch = useDispatch();

  // useEffect(()=>{
  //   let cartCount = 0;
  //   if(userUid !== ""){
  //       getDoc(doc(db, "users", userUid)).then(user =>{
  //           user.data().cart_items.forEach((item)=>{
  //               getDoc(doc(db, "cart", item)).then((obj)=>{
  //                   console.log("cartCount", cartCount, obj.data().quantity);
  //                   cartCount += obj.data().quantity
  //               })
  //           }).then(()=>{
  //             dispatch(incrementByAmount(cartCount));
  //             console.log("cartCount after dispatch", cartCount);
  //         })
  //       })
  //   }
  // }, [userUid])

  console.log("User", admin);
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route path= '/' element={<MainPage />} />
          {/* <Route path= '/' element={<MainHomePage />} /> */}
          <Route path= '/cart' element={<CartPage />} />
          <Route path = '/signUp' element={<SignUpPage />} />
          <Route path= '/login' element={<LoginPage />} />
          <Route path= '/profile' element={<ProfilePage />} />
          <Route path= '/checkout' element={<CartCheckOutPage />} />
          <Route path= '/order' element={<OrderPage />} />
          <Route path= '/addProduct' element={<AddProduct />} />
          <Route path= '/productPage' element={<ProductPage />} />
          <Route path= '/admin' element={<AdminHandler />} />
        </Routes>
      </BrowserRouter>
      
      {/* <MainPage /> */}
    </div>
  );
}

export default App;
