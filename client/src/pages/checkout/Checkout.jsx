import { useNavigate, useParams,Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useState,useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GiShoppingCart } from "react-icons/gi";
import Loading from "../../components/common/Loading";
import PayStatus from "../../components/common/PayStatus";
import {schema} from './data';
import MainLayout from "../../components/layout/main/MainLayout"
import userApi from "../../api/userApi"
import addDos from "../../functions/addDos"
import billApi from "../../api/billApi";
import {setCheckoutStatus} from "../../redux/features/checkoutSlide"
import { toast } from "react-toastify";

import './checkout.scss'

const Checkout = () => {

    const [showEmailInput, setShowEmailInput] = useState(false);
    const [showCreditPayment, setshowCreditPayment] = useState(false);

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        clearErrors,
        watch,
        register,
        submit
      } = useForm({
        mode: 'all',
        resolver: yupResolver(schema(showEmailInput,showCreditPayment)),
      });

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.value)
    const userCart = useSelector((state) => state.userCart.value)
    
    const [loading, setLoading] = useState(false)
    const [infoProduct, setInfoProduct] = useState([]);
    const [totalNumber, setTotalNumber] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [errorPayment, setErrorPayment] = useState("");
    const [checkTerm, setCheckTerm] = useState(false)
    const [errorTerm, setErrorTerm] = useState("");
    const [payAction, setPayAction] = useState(false);
    const [payMessage, setPayMessage] = useState(null)

    useEffect(() => {
        const getUserCart = async () => {
            try {
                if(user && user.username)
                {
                    setInfoProduct(userCart.infoProduct)
                    setTotalNumber(userCart.totalNumber)
                    setTotalPrice(userCart.totalPrice)
                }
                else {
                    navigate('/');
                }
            } 
            catch (err) {
                const errors = err.data.msg
                toast.error(errors, {
                    position: 'top-left',
                    autoClose: 3000,
                    style: { color: '$color-default', backgroundColor: '#fff' },
                });
            }
        }
        getUserCart();
    }, []);

    const onSubmit = async (data) => {
        try {
            if(!showEmailInput)
            {
                delete data.emailBill;
            }
            if(!showCreditPayment)
            {
                delete data.creditCardBill;
                delete data.cvvBill;
                delete data.monthCreditBill;
                delete data.yearCreditBill;
            }
            if (selectedPayment.trim() === '') {
                setErrorPayment('* Please select payment method')
                return;
            }

            if (!checkTerm) {
            { // Hiển thị thông báo lỗi khi chưa chọn điều kiện
                setErrorTerm('* Please accept the terms & conditions');
                return;
            }
        }

            setErrorPayment('');
            setErrorTerm('');
            setLoading(true)
            const res = await billApi.submitBill(data,user.username)
            if(res.state === 'success')
            {
                setLoading(false)
                setPayAction(true)
                setPayMessage({message:res.msg,state:res.state})
                dispatch(setCheckoutStatus(true))
            }
        } 
        catch (err) {
            const errors = err.data.msg
            toast.error(errors, {
                position: 'top-left',
                autoClose: 3000,
                style: { color: '$color-default', backgroundColor: '#fff' },
            });
        }
    };

    const handlePlaceOrderClick = (e) => {
        e.preventDefault()
        handleSubmit(onSubmit)();
    };

    const handleCheckboxClick = () => {
        setShowEmailInput(!showEmailInput);
        setValue("emailBill", "", { shouldValidate: true });
    }

    const handleCheckCreditPay = () => {
        setshowCreditPayment(true);
        setSelectedPayment("Paypal System");
        setValue("creditCardBill", "", { shouldValidate: true });
        setValue("cvvBill", "", { shouldValidate: true });
        setValue("monthCreditBill", "", { shouldValidate: true });
        setValue("yearCreditBill", "", { shouldValidate: true });
    }

    const handleDirectPaymentChange = () => {
        // Đặt giá trị của showCreditPayment thành false khi chọn radio "Direct Payment"
        setshowCreditPayment(false);
        setSelectedPayment("Direct Payment");
    };
    
    return (
        <MainLayout
            add={
            <>
                {loading ? 
                    <Loading/>
                :
                    payAction ?
                        <PayStatus 
                        state={payMessage.state}
                        message={payMessage.message}
                        />
                    :
                    (
                        infoProduct && infoProduct.length > 0 ?
                            <div className="section">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="billing-details">
                                                <div className="section-title">
                                                    <h3 className="title">Billing address</h3>
                                                </div>
                                                <form id="bill-form" onSubmit={handleSubmit(onSubmit)}>
                                                    <div className="form-group">
                                                        <span id="country-sp" className="required">
                                                            <label htmlFor="LastName">Viet Nam only</label>
                                                        </span>
                                                    </div>
                                                    <div className="form-group">
                                                    <div className="input-checkbox">
                                                        <input
                                                        type="checkbox"
                                                        id="create-account"
                                                        onClick={handleCheckboxClick} 
                                                        />
                                                        <label htmlFor="create-account">
                                                        <span></span>
                                                        Use Another Email?
                                                        </label>
                                                        <div className="caption">
                                                            {showEmailInput && 
                                                            (
                                                            <>
                                                                <input
                                                                    className="input"
                                                                    type="email"
                                                                    name="emailBill"
                                                                    id="emailBill"
                                                                    placeholder="Enter your email"
                                                                    {...register("emailBill")}
                                                                />
                                                                {errors.emailBill && (
                                                                    <div className='error-infor' role='alert'>
                                                                        {errors.emailBill.message}
                                                                    </div>
                                                                )}
                                                            </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <input
                                                            className="input"
                                                            type="text"
                                                            id="addressBill"
                                                            name="addressBill"
                                                            placeholder="Address"
                                                            {...register('addressBill')}
                                                        />
                                                        {errors.addressBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.addressBill.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <select
                                                            className="input"
                                                            name="cityBill"
                                                            id="cityBill"
                                                            defaultValue=""
                                                            {...register('cityBill')}>
                                                            <option disabled value="">Choose city</option>
                                                            <option value="0">An Giang</option>
                                                            <option value="1">Bắc Giang</option>
                                                            <option value="2">Bắc Kan</option>
                                                            <option value="3">Bạc Lieu</option>
                                                            <option value="4">Bắc Ninh</option>
                                                            <option value="5">Bà Rịa-Vũng Tàu</option>
                                                            <option value="6">Bến Tre</option>
                                                            <option value="7">Bình Định</option>
                                                            <option value="8">Bình Dương</option>
                                                            <option value="9">Bình Phước</option>
                                                            <option value="10">Bình Thuận</option>
                                                            <option value="11">Cà Mau</option>
                                                            <option value="12">Cao Bằng</option>
                                                            <option value="13">Đắc Lắk</option>
                                                            <option value="14">Đắc Nông</option>
                                                            <option value="15">Điện Biên</option>
                                                            <option value="16">Đồng Nai</option>
                                                            <option value="17">Đồng Tháp</option>
                                                            <option value="18">Gia Lai</option>
                                                            <option value="19">Hà Giang</option>
                                                            <option value="20">Hải Dương</option>
                                                            <option value="21">Hà Nam</option>
                                                            <option value="22">Hà Tây</option>
                                                            <option value="23">Hà Tĩnh</option>
                                                            <option value="24">Hậu Giang</option>
                                                            <option value="25">Hòa Bình</option>
                                                            <option value="26">Hưng Yên</option>
                                                            <option value="27">Khánh Hòa</option>
                                                            <option value="28">Kiên Giang</option>
                                                            <option value="29">Kon Tum</option>
                                                            <option value="30">Lai Châu</option>
                                                            <option value="31">Lâm Đồng</option>
                                                            <option value="32">Lạng Sơn</option>
                                                            <option value="33">Lào Cai</option>
                                                            <option value="34">Long An</option>
                                                            <option value="35">Nam Định</option>
                                                            <option value="36">Nghệ An</option>
                                                            <option value="37">Ninh Bình</option>
                                                            <option value="38">Ninh Thuậnn</option>
                                                            <option value="39">Phú Thọ</option>
                                                            <option value="40">Phú Yên</option>
                                                            <option value="41">Quảng Bình</option>
                                                            <option value="42">Quảng Nam</option>
                                                            <option value="43">Quảng Ngải</option>
                                                            <option value="44">Quảng Ninh</option>
                                                            <option value="45">Quảng Trị</option>
                                                            <option value="46">Sóc Trăng</option>
                                                            <option value="47">Sơn La</option>
                                                            <option value="48">Tây Ninh</option>
                                                            <option value="49">Thái Bình</option>
                                                            <option value="50">Thái Nguyên</option>
                                                            <option value="51">Thanh Hóa</option>
                                                            <option value="52">Thừa Thiên-Huế</option>
                                                            <option value="53">Tiền Giang</option>
                                                            <option value="54">Trà Vinh</option>
                                                            <option value="55">Tuyên Quang</option>
                                                            <option value="56">Vĩnh Long</option>
                                                            <option value="57">Vĩnh Phúc</option>
                                                            <option value="58">Yên Bái</option>
                                                            <option value="59">Cần Thơ</option>
                                                            <option value="60">Đà Nẵng</option>
                                                            <option value="61">Hải Phòng</option>
                                                            <option value="62">Hà Nội</option>
                                                            <option value="63">Hồ Chí Minh</option>
                                                        </select>
                                                        {errors.cityBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.cityBill.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <input
                                                            className="input"
                                                            type="tel"
                                                            id="telBill"
                                                            name="telBill"
                                                            placeholder="Telephone"
                                                            {...register('telBill')}
                                                        />
                                                        <span>Exam: 84XXXXXXX</span>
                                                        {errors.telBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.telBill.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea
                                                            className="input"
                                                            id="notesBill"
                                                            name="notesBill"
                                                            placeholder="Order Notes"
                                                            {...register('notesBill')}
                                                        ></textarea>
                                                        {errors.notesBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.notesBill.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="col-md-5 order-details">
                                            <div className="section-title text-center">
                                                <h3 className="title">Your Order</h3>
                                            </div>
                                            <div className="order-summary">
                                                <div className="order-col">
                                                    <div><strong>PRODUCT</strong></div>
                                                    <div><strong>TOTAL</strong></div>
                                                </div>
                                                <div className="order-products">
                                                    {infoProduct.length !== 0 && infoProduct.map((item,index) => (
                                                        <div className="order-col" key={index}>
                                                            <div>{item.productNumber}x {item.productName}</div>
                                                            <div id="price-checkout">{addDos(item.productPrice)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-col">
                                                    <div>Shiping</div>
                                                    <div><strong>FREE</strong></div>
                                                </div>
                                                <div className="order-col">
                                                    <div><strong>TOTAL</strong></div>
                                                    <div><strong className="order-total">${addDos(totalPrice)}</strong></div>
                                                </div>
                                            </div>
                                            <div className="payment-method">
                                                <div className="input-radio">
                                                    <input type="radio" name="payment" className="payment" id="payment-1" 
                                                        onChange={handleDirectPaymentChange}
                                                    />
                                                    <label htmlFor="payment-1">
                                                        <span></span>
                                                        Direct Payment
                                                    </label>
                                                </div>
                                                <div className="input-radio">
                                                    <input type="radio" name="payment" className="payment" id="payment-2"
                                                        onChange={handleCheckCreditPay}
                                                    />
                                                    <label htmlFor="payment-2">
                                                        <span></span>
                                                        Paypal System
                                                    </label>
                                                    <div className="caption">
                                                        <input form="bill-form" className="input" type="text" name="creditCardBill" id= "creditCardBill" 
                                                        placeholder="Enter your credit card number"
                                                        {...register('creditCardBill')}
                                                        />
                                                        {errors.creditCardBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.creditCardBill.message}
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', marginTop: '10px' }}>
                                                            <input className="input" type="text" name="cvvBill" id="cvvBill" placeholder="Enter your cvv"
                                                            {...register('cvvBill')}
                                                            />
                                                            <div style={{ display: 'flex' }}>
                                                                <input form="bill-form" className="input" type="text" name="dateBill" id="monthCreditBill" placeholder="Month"
                                                                {...register('monthCreditBill')}
                                                                />
                                                                <input form="bill-form" className="input" type="text" name="dateBill" id="yearCreditBill" placeholder="Year"
                                                                {...register('yearCreditBill')}
                                                                />
                                                            </div>
                                                        </div>
                                                        {errors.cvvBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.cvvBill.message}
                                                            </div>
                                                        )}
                                                        {errors.monthCreditBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.monthCreditBill.message}
                                                            </div>
                                                        )}
                                                        {errors.yearCreditBill && (
                                                            <div className='error-infor' role='alert'>
                                                                {errors.yearCreditBill.message}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="input-checkbox">
                                                <input
                                                type="checkbox"
                                                id="terms"
                                                className="terms-checkout"
                                                onChange={() => setCheckTerm(!checkTerm)}
                                                />
                                                <label htmlFor="terms">
                                                    <span></span>
                                                    I've read and accept the <a href="#">terms & conditions</a>
                                                </label>
                                            </div>
                                            {!selectedPayment && errorPayment && (
                                                <div className='error-infor' role='alert'>
                                                    {errorPayment}
                                                </div>
                                            )}
                                            {!checkTerm && errorTerm && (
                                                <div className='error-infor' role='alert'>
                                                    {errorTerm}
                                                </div>
                                            )}
                                            <a href="" id="submit-bill-form" className="primary-btn order-submit" onClick={handlePlaceOrderClick}>
                                            Place order
                                            </a>
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
                    )
                }
            </>
            }
        />
    )
}

export default Checkout