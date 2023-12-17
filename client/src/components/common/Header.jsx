import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useState,useEffect,useRef } from "react"
import { resetUser } from "../../redux/features/userSlice";
import { setUserCart,resetUserCart} from "../../redux/features/useCartSlice";
import SearchBar from "./SearchBar";
import userApi from "../../api/userApi";
import addDos from "../../functions/addDos";
import DeleteCartButton from "../../components/common/DeleteCartButton"
import useDeleteCartProduct from "../../functions/deleteCartProduct";
import ProductLink from "../common/ProductLink"

const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const location = useLocation()
    
    const user = useSelector((state) => state.user.value)
    const actionProduct = useSelector((state) => state.actionProduct.value)
    const cart = useSelector((state) => state.userCart.value)

    const [inforProduct , setInforProduct] = useState([])
    const [totalNumber , setTotalNumber] = useState('')
    const [totalPrice , setTotalPrice ] = useState('')
    const [dropdownState, setDropdownState ] = useState(false)
    const dropdownRef = useRef(null);

    const {deleteCartProduct} = useDeleteCartProduct()

    useEffect(() => {
        const getUserCartInfor = async () => {
            try {
                if (user && user.username) {
                    const data = await userApi.getUserCart(user.username);
                    let result = data.result;  
                    if(result)
                    {
                        // Kiểm tra xem dữ liệu từ server có thay đổi không
                        if (!isSameCart(result, cart)) {
                            setInforProduct(result.infoProduct);
                            setTotalNumber(result.totalNumber);
                            setTotalPrice(result.totalPrice);
                            if (!isSameCart(result, cart)) {
                                dispatch(setUserCart(result));
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    
        getUserCartInfor();
    }, [dispatch, user,actionProduct]);
    
    const isSameCart = (newCart, currentCart) => {
        return (
            newCart.infoProduct === currentCart.infoProduct &&
            newCart.totalNumber === currentCart.totalNumber &&
            newCart.totalPrice === currentCart.totalPrice
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownState(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDropdown = (e) =>{
        e.preventDefault()
        setDropdownState((prevState) => !prevState);
    }
    
    const handleDelete = async ({item,e}) => {
        e.preventDefault()
        const userInfor = user.username
        await deleteCartProduct({ userInfor, item });
    }

    const logout = (e) => { 
        e.preventDefault() 
        localStorage.removeItem('token')
        localStorage.setItem('previousPage', location.pathname)
        dispatch(resetUser());
        dispatch(resetUserCart());
        navigate(0)
    }

    return (
        <>
        <div id="top-header">
            <div className="container">
                <ul className="header-links pull-left">
                    <li><a href="#"><i className="fa fa-phone"></i> +84-932069XXX</a></li>
                    <li><a href="#"><i className="fa fa-envelope-o"></i> nguyennghiaXXXXX@email.com</a></li>
                    <li><a href="#"><i className="fa fa-map-marker"></i> Binh Chanh TPHCM</a></li>
                </ul>
                <ul className="header-links pull-right">
                    <li><a href="#"><i className="fa fa-dollar"></i> USD</a></li>
                    {Object.keys(user).length !== 0 ? (
                        <>
                        <li><a href=""><i className="fa fa-user-o"></i>{user.fullname}</a></li>
                        <li><a href="" onClick={e => logout(e)}><i className="fa fa-sign-out"></i> Logout</a></li>
                        </>
                    ) :
                    (<li><Link to={"/user/login"}><i className="fa fa-user-o"></i> My Account</Link></li>)}
                </ul>
            </div>
        </div>

        <div id="header">
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <div className="header-logo">
                            <a href="/" className="logo">
                                <img src="./img/logo.png" alt=""/>
                            </a>
                        </div>
                    </div>
                    <SearchBar/>
                    <div className="col-md-3 clearfix">
                        <div className="header-ctn">
                            {Object.keys(user).length !== 0 && (
                                <div>
                                    <a href="">
                                        <i className="fa fa-heart-o"></i>
                                        <span>Your Wishlist</span>
                                        <div className="qty">2</div>
                                    </a>
                                </div>
                            )}

                            <div ref={dropdownRef} className={dropdownState ? "dropdown open" : "dropdown"}>
                                {Object.keys(user).length !== 0 && (
                                    <a className="dropdown-toggle" onClick={(e) => handleDropdown(e)} data-toggle="dropdown" aria-expanded="true" href="" id="list-cart-dropdown">
                                        <i className="fa fa-shopping-cart"></i>
                                        <span>Your Cart</span>
                                        {totalNumber > 0 && <div className="qty" id="qty-dropdown">{totalNumber}</div>}
                                    </a>
                                )}
                                <div className="cart-dropdown">
                                    <div className="cart-list" id="cart-list-dropdown">
                                        {Object.keys(user).length !== 0 && inforProduct && inforProduct.length > 0 &&
                                            inforProduct.map((item,index) => (
                                            <div className="product-widget" key={index}>
                                                <div className="product-img">
                                                <img src={`${item.productImage.path}`} alt="" />
                                                </div>
                                                <div className="product-body">
                                                <h3 id="product-name-dropdown" className="product-name">
                                                    <ProductLink item={item}/>
                                                </h3>
                                                <h4 id="product-price-dropdown" className="product-price">
                                                    <span id="qty-dropdown" className="qty">{item.productNumber}x</span>${addDos(item.productPrice)}
                                                </h4>
                                                </div>
                                                <DeleteCartButton 
                                                onclick={(e) => handleDelete({ item, e })}
                                                />
                                            </div>
                                            ))}
                                        </div>
                                    <div className="cart-summary">
                                        {Object.keys(user).length !== 0 && (
                                            Object.keys(inforProduct).length !== 0 ? (
                                                <>
                                                    <small id="cart-summary-totalNumber">{totalNumber} Item(s) selected</small>
                                                    <h5 id="cart-summary-totalPrice">SUBTOTAL: ${addDos(totalPrice)}</h5>
                                                </>
                                            ) : (
                                                <>
                                                    <small id="cart-summary-totalNumber">0 Item(s) selected</small>
                                                    <h5 id="cart-summary-totalPrice">SUBTOTAL: $0</h5>
                                                </>
                                            )
                                        )}
                                    </div>
                                    <div className="cart-btns">
                                        <a href="#">View Cart</a>
                                        <Link to="/user/check-out">Checkout  <i className="fa fa-arrow-circle-right"></i></Link>
                                    </div>
                                </div>
                            </div>

                            <div className="menu-toggle">
                                <a href="#">
                                    <i className="fa fa-bars"></i>
                                    <span>Menu</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Header;