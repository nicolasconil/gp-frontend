import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/' element={<ProductPage />} />
        <Route path='/producto/:id' element={<ProductDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
