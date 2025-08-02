import { useEffect } from "react";
import { fetchCsrfToken } from "./api/csrf.api.js";
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import AllProductsPage from './pages/AllProductsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PanelPage from './pages/PanelPage.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Checkout from './components/Checkout.jsx';

import ProductsPage from './pages/ProductsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import CatalogsPage from './pages/CatalogsPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ShippingsPage from './pages/ShippingsPage.jsx';

import AboutUsPage from './pages/AboutUsPage.jsx';
import TermsOfServicePage from './pages/TermsOfServicePage.jsx';
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx';

function App() {
    useEffect(() => {
      fetchCsrfToken();
    }, []);
    
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/' element={<ProductPage />} />
        <Route path='/producto/:id' element={<ProductDetail />} />
        <Route path='/productos' element={<AllProductsPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/about-us' element={<AboutUsPage />} />
        <Route path='/terms-of-service' element={<TermsOfServicePage />} />
        <Route path='/shipping-policy' element={<ShippingPolicyPage />} />

        <Route 
          path='/panel' 
          element={
            <PrivateRoute roles={["administrador", "moderador"]}> 
              <PanelPage /> 
            </PrivateRoute>
          }
        >
          <Route path='products' element={<ProductsPage />} />
          <Route path='users' element={<UsersPage />} />
          <Route path='catalogs' element={<CatalogsPage />} />
          <Route path='orders' element={<OrdersPage />} />
          <Route path='shippings'element={<ShippingsPage />} />
        </Route>

      </Routes>
      <Footer />
    </>
  );
}

export default App;
