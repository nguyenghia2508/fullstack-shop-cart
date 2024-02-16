import { useNavigate, useParams,Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useState,useEffect } from "react"
import { GiShoppingCart } from "react-icons/gi";
import Loading from "../../components/common/Loading";
import MainLayout from "../../components/layout/main/MainLayout"
import addDos from "../../functions/addDos"
import userApi from "../../api/userApi";
import ProductLink from "../../components/common/ProductLink";
import DeleteCartButton from "../../components/common/DeleteCartButton";
import { toast } from "react-toastify";
import './cart.scss'
import { resetUserCart } from "../../redux/features/useCartSlice";


const CartView = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.value)
    const userCart = useSelector((state) => state.userCart.value)
    
    const [loading, setLoading] = useState(false)
    const [infoProduct, setInfoProduct] = useState([]);
    const [totalNumber, setTotalNumber] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    
    useEffect(() => {
        const getUserCart = async () => {
            try {
                if(user && user.username)
                {
                    setInfoProduct(userCart.infoProduct)
                    setTotalNumber(userCart.totalNumber)
                    setTotalPrice(userCart.totalPrice)
                    if(userCart.infoProduct.length > 0)
                    {
                        const res = await userApi.recommendProduct({id:user.username})
                    }
                }
                else {
                    navigate('/');
                }
            } 
            catch (err) {
                toast.error(err, {
                    position: 'top-left',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#fff' },
                });
            }
        }
        getUserCart();
    }, []);

    useEffect(() => {
        if(userCart.infoProduct.length === 0)
        {
            dispatch(resetUserCart())
            setInfoProduct(userCart.infoProduct)
            setTotalNumber(userCart.totalNumber)
            setTotalPrice(userCart.totalPrice)
        }
    }, [userCart]);

    return (
        <MainLayout
            add={
            <>
                {infoProduct && infoProduct.length > 0 ?
                    <div className="section">
                        <div className="container">
                            <div className="row">
                                <div className="col-m-7 order-details">
                                    <div className="section-title text-center">
                                        <h3 className="title">Your Cart</h3>
                                    </div>
                                    <div className="cart-summary">
                                        <div className="order-col">
                                            <div><strong>PRODUCT</strong></div>
                                            <div><strong>NUMBER</strong></div>
                                            <div><strong>PRICE</strong></div>
                                            <div><strong>ACTION</strong></div>
                                        </div>
                                        <div className="order-products">
                                            {infoProduct.length !== 0 && infoProduct.map((item,index) => (
                                                <div className="order-col" key={index}>
                                                    <div className="product-infor">
                                                        <div className="product-widget">
                                                            <div className="product-img">
                                                                <img src={`${item.productImage.path}`} alt="" />
                                                            </div>
                                                            <div className="product-body">
                                                                <h3 id="product-name-dropdown" className="product-name">
                                                                    <ProductLink item={item}/>
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div>x{item.productNumber}</div>
                                                        <div id="price-checkout">{addDos(item.productPrice)}</div>
                                                    </div>
                                                    <div className="product-action">
                                                        <DeleteCartButton 
                                                        // onclick={(e) => handleDelete({ item, e })}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="wrapper">
                        <div className="alert_wrap success">
                            <div className="alert_icon">
                                <ion-icon className="icon"  name="close"></ion-icon>
                            </div>
                            <div className="content">
                                <p className="title">Uh, oh!</p>
                                <GiShoppingCart style={{fontSize:'50px'}}/>
                                <p className="info">
                                Your Cart is empty !
                                </p>
                            </div>
                            <Link to="/">
                                <button>Continue Shopping</button>
                            </Link>
                        </div>
                    </div>
                }
            </>
            }
        />
    )
}

export default CartView