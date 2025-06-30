import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PanelPage from './pages/PanelPage.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/' element={<ProductPage />} />
        <Route path='/producto/:id' element={<ProductDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/panel' element={<PrivateRoute roles={["administrador", "moderador"]}> <PanelPage /> </PrivateRoute>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
