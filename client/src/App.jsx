import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home"
import LgASup from "./components/layout/LgAndSup/LoginAndRegister";
import Store from "./pages/store/Store";
import Product from "./pages/product/Product";
import Checkout from "./pages/checkout/Checkout";
import Search from "./pages/search/Search";
import HomeAdmin from "./pages/admin/home/HomeAdmin";
import ProductAdmin from "./pages/admin/product/ProductAdmin";
import ListUser from "./pages/admin/user/ListUser";
import AddProduct from './pages/admin/product/add/AddProduct'
import DetailProduct from "./pages/admin/product/detail/DetailProduct";
import EditProduct from "./pages/admin/product/edit/EditProduct";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/product/:id' element={<Product />} />
        <Route path='/store' element={<Store/>}/>
        <Route path='/user/login' element={<LgASup />}/>
        <Route path='/user/check-out' element={<Checkout />}/>
        <Route path='/search' element={<Search />}/>
        <Route path='/admin' element={<HomeAdmin />}/>
        <Route path='/admin/list-user' element={<ListUser />}/>
        <Route path='/admin/list-product' element={<ProductAdmin />}/>
        <Route path='/admin/add-product' element={<AddProduct />}/>
        <Route path='/admin/detail-product/:id' element={<DetailProduct />}/>
        <Route path='/admin/edit-product/:id' element={<EditProduct />}/>
        {/* <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='boards' element={<Home />} />
          <Route path='boards/:boardId' element={<Board />} />
        </Route> */}
      </Routes>
    </Router>
    <ToastContainer/>
    </>
  );
}

export default App;
