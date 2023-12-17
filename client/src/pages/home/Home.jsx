import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useState,useEffect } from "react"
import MainLayout from "../../components/layout/main/MainLayout"
import productApi from "../../api/productApi"
import addDos from "../../functions/addDos"
import Slider from 'react-slick'; // Import the React slick library
import Loading from "../../components/common/Loading"
import AddCartButton from "../../components/common/AddCartButton"
import useAddCartProduct from "../../functions/addCartProduct"
import ProductLink from "../../components/common/ProductLink"
import ProductRating from "../../components/common/ProductRating"

const Home = () => {
  const user = useSelector((state) => state.user.value)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [newLap, setNewLap] = useState([])
  const [newPhone, setNewPhone] = useState([])
  const [newCam, setNewCam] = useState([])
  const [tabList, setTabList] = useState(0)
  const [tabNav, setTabNav] = useState(0)

  const { addCartProduct } = useAddCartProduct();

  useEffect(() => {
    const getFirst5Product = async () => {
      try {
        const data = await productApi.getFirstProduct()
        setNewLap(data.newLap)
        setNewPhone(data.newPhone)
        setNewCam(data.newCam)
      } catch (err) {
        console.log(err)
      }
    }
    getFirst5Product();
  }, []);
  
  const lapSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    initialSlide: 0,
    infinite: newLap.length > 4,
    speed: 500,
    dots: false,
    arrows: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const phoneSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    initialSlide: 0,
    infinite: newPhone.length > 4,
    speed: 500,
    dots: false,
    arrows: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const camSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    initialSlide: 0,
    infinite: newCam.length > 4,
    speed: 500,
    dots: false,
    arrows: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleTab = (tab,event) =>{
    event.preventDefault();
    if (tab === tabNav) {
      return;
    }
  
    setLoading(true);
  
    setTabList(tab);

  
    setTabNav(tab);
  }

  const handleAdd = async ({item,e}) => {
    e.preventDefault()
    const userInfor = user.username
    await addCartProduct({ userInfor, item });
  }
  
  useEffect(() =>{  
    setLoading(false)
  },[tabList])

  return (
    <MainLayout id={0} add={
    <>
    <div className="section" id="listType">
          <div className="container">
              <div className="row">
              <div className="col-md-4 col-xs-6">
                  <div className="shop">
                  <div className="shop-img">
                      <img src="./img/shop01.png" alt="Shop 1" />
                  </div>
                  <div className="shop-body">
                      <h3>Laptop<br />Collection</h3>
                      <a href="#" className="cta-btn">
                      Shop now <i className="fa fa-arrow-circle-right"></i>
                      </a>
                  </div>
                  </div>
              </div>

              <div className="col-md-4 col-xs-6">
                  <div className="shop">
                  <div className="shop-img">
                      <img src="./img/shop03.png" alt="Shop 2" />
                  </div>
                  <div className="shop-body">
                      <h3>Accessories<br />Collection</h3>
                      <a href="#" className="cta-btn">
                      Shop now <i className="fa fa-arrow-circle-right"></i>
                      </a>
                  </div>
                  </div>
              </div>

              <div className="col-md-4 col-xs-6">
                  <div className="shop">
                  <div className="shop-img">
                      <img src="./img/shop02.png" alt="Shop 3" />
                  </div>
                  <div className="shop-body">
                      <h3>Cameras<br />Collection</h3>
                      <a href="#" className="cta-btn">
                      Shop now <i className="fa fa-arrow-circle-right"></i>
                      </a>
                  </div>
                  </div>
              </div>
              </div>
          </div>
      </div>
      <div className="section">
			<div className="container" id="listProduct">
				<div className="row">
					<div className='alert alert-dismissible' id="alert-dismissible" role='alert'></div>
					<div className="col-md-12">
						<div className="section-title">
							<h3 className="title">New Products</h3>
							<div className="section-nav">
              <ul className="section-tab-nav tab-nav">
                <li className={tabNav === 0 ? "active" : ""} onClick={(event) => handleTab(0, event)}>
                  <a href="#" data-name="Laptop" data-toggle="tab">
                    Laptops
                  </a>
                </li>
                <li className={tabNav === 1 ? "active" : ""} onClick={(event) => handleTab(1, event)}>
                  <a href="#" data-name="Phone" data-toggle="tab">
                    Smartphones
                  </a>
                </li>
                <li className={tabNav === 2 ? "active" : ""} onClick={(event) => handleTab(2, event)}>
                  <a href="#" data-name="Camera" data-toggle="tab">
                    Cameras
                  </a>
                </li>
              </ul>
							</div>
						</div>
					</div>

					<div className="col-md-12">
						<div className="row">
							<div className="products-tabs">
                {loading ? <Loading/> : tabList === 0 ? 
                <div id="Laptop" className="tab-pane active">
                  <Slider className="products-slick" {...lapSliderSettings}>
                    {newLap.map((item, index) => (
                      <div className="product" key={index}>
                        <div className="product-img" id="newItem">
                          <img src={`${item.image.path}`} alt=""/>
                          <div className="product-label">
                            <span className="sale">-30%</span>
                            <span className="new">NEW</span>
                          </div>
                        </div>
                        <div className="product-body">
                          <p className="product-category">{item.category}</p>
                          <h3 className="product-name"><ProductLink 
                          item={item}
                          /></h3>
                          <h4 className="product-price">${addDos(item.price)} <del className="product-old-price">$990.00</del></h4>
                          <div className="product-rating">
                            <ProductRating 
                              integerPart={item.integerPart}
                              decimalPart={item.decimalPart}
                            />
                          </div>
                          <div className="product-btns">
                            <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">add to wishlist</span></button>
                            <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                            <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                          </div>
                          <div className="product-calculate">
                            <span className="totalSold">{item.totalSold ? item.totalSold : 0 } sold</span>
                            <span className="review-counting">{item.count ? item.count : 0} Reviews</span>
                            </div>
                        </div>
                        <div className="add-to-cart">
                          <AddCartButton
                            text='quick add'
                            onclick={(e) => handleAdd({ item, e })}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
									<div id="slick-nav-1" className="products-slick-nav"></div>
								</div>
                : tabList === 1 ? 
                <div id="Phone" className="tab-pane active">
                  <Slider className="products-slick" {...phoneSliderSettings}>
                    {newPhone.map((item, index) => (
                      <div className="product" key={index}>
                        <div className="product-img" id="newItem">
                          <img src={`${item.image.path}`} alt=""/>
                          <div className="product-label">
                            <span className="sale">-30%</span>
                            <span className="new">NEW</span>
                          </div>
                        </div>
                        <div className="product-body">
                          <p className="product-category">{item.category}</p>
                          <h3 className="product-name"><ProductLink 
                          item={item}
                          /></h3>
                          <h4 className="product-price">${addDos(item.price)} <del className="product-old-price">$990.00</del></h4>
                          <div className="product-rating">
                            <ProductRating 
                              integerPart={item.integerPart}
                              decimalPart={item.decimalPart}
                            />
                          </div>
                          <div className="product-btns">
                            <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">add to wishlist</span></button>
                            <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                            <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                          </div>
                          <div className="product-calculate">
                            <span className="totalSold">{item.totalSold ? item.totalSold : 0 }</span>
                            <span className="review-counting">{item.count ? item.count : 0} Reviews</span>
                            </div>
                        </div>
                        <div className="add-to-cart">
                          <AddCartButton
                            text='quick add'
                            onclick={(e) => handleAdd({ item, e })}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
									<div id="slick-nav-1" className="products-slick-nav"></div>
								</div>
                :
                <div id="Camera" className="tab-pane active">
                <Slider className="products-slick" {...camSliderSettings}>
                  {newCam.map((item, index) => (
                    <div className="product" key={index}>
                      <div className="product-img" id="newItem">
                        <img src={`${item.image.path}`} alt=""/>
                        <div className="product-label">
                          <span className="sale">-30%</span>
                          <span className="new">NEW</span>
                        </div>
                      </div>
                      <div className="product-body">
                        <p className="product-category">{item.category}</p>
                        <h3 className="product-name"><ProductLink 
                        item={item}
                        /></h3>
                        <h4 className="product-price">${addDos(item.price)} <del className="product-old-price">$990.00</del></h4>
                        <div className="product-rating">
                          <ProductRating 
                            integerPart={item.integerPart}
                            decimalPart={item.decimalPart}
                          />
                        </div>
                        <div className="product-btns">
                          <button className="add-to-wishlist"><i className="fa fa-heart-o"></i><span className="tooltipp">add to wishlist</span></button>
                          <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                          <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                        </div>
                        <div className="product-calculate">
                          <span className="totalSold">{item.totalSold ? item.totalSold : 0 }</span>
                          <span className="review-counting">{item.count ? item.count : 0} Reviews</span>
                        </div>
                      </div>
                      <div className="add-to-cart">
                        <AddCartButton
                          text='quick add'
                          onclick={(e) => handleAdd({ item, e })}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
                <div id="slick-nav-1" className="products-slick-nav"></div>
              </div>
                }
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
    <div id="hot-deal" className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="hot-deal">
              {/* Countdown Timer */}
              <ul className="hot-deal-countdown">
                <li>
                  <div>
                    <h3>02</h3>
                    <span>Days</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>10</h3>
                    <span>Hours</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>34</h3>
                    <span>Mins</span>
                  </div>
                </li>
                <li>
                  <div>
                    <h3>60</h3>
                    <span>Secs</span>
                  </div>
                </li>
              </ul>

              {/* Hot Deal Info */}
              <h2 className="text-uppercase">hot deal this week</h2>
              <p>New Collection Up to 50% OFF</p>
              <a className="primary-btn cta-btn" href="#">
                Shop now
              </a>
            </div>
          </div>
        </div>
        {/* /row */}
      </div>
      {/* /container */}
    </div>
    </>
    }>
    </MainLayout>
  )
}

export default Home