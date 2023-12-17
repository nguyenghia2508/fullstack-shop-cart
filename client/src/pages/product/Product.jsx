import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useState,useEffect, useRef } from "react"
import MainLayout from "../../components/layout/main/MainLayout"
import productApi from "../../api/productApi"
import addDos from "../../functions/addDos"
import Slider from 'react-slick'; // Import the React slick library
import Loading from "../../components/common/Loading"
import AddCartButton from "../../components/common/AddCartButton"
import useAddCartProduct from "../../functions/addCartProduct"
import StarRating from "../../functions/StarRating"
import ProductRating from "../../components/common/ProductRating"
import { Input } from "@mui/material"
import downLine from "../../functions/downLine"
import Pagination from "../../components/common/Pagination"
import ReviewForm from "../../components/common/ReviewForm"
import { toast } from 'react-toastify';

const Product = () => {
  const user = useSelector((state) => state.user.value)
  const product = useParams()
  const { addCartProduct } = useAddCartProduct();

  const reviewLinkRef = useRef(null);
  const tab3LinkRef = useRef(null);

  const [loading, setLoading] = useState(false)
  const [averageRating, setAverageRating] = useState(0);
  const [count, setCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Giả sử giá trị ban đầu là 1
  const [decimalPart, setDecimalPart] = useState('');
  const [infoItem, setInfoItem] = useState([]);
  const [integerPart, setIntegerPart] = useState(0);
  const [listReview, setListReview] = useState([]);
  const [nextPage, setNextPage] = useState(1); // Giả sử giá trị ban đầu là 1
  const [pageTotal, setPageTotal] = useState(1); // Giả sử giá trị ban đầu là 1
  const [prevPage, setPrevPage] = useState(1); // Giả sử giá trị ban đầu là 1
  const [totalPages, setTotalPages] = useState([1]);
  const [totalRating, setTotalRating] = useState([]);
  
  const [isTab3Active, setIsTab3Active] = useState(false);
  const [tabNav, setTabNav] = useState(0)
  const [quantity, setQuantity] = useState(1);
  const [expandedStates, setExpandedStates] = useState({});

  useEffect(() => {
    const getProduct= async () => {
      try {
        const data = await productApi.getProduct(product.id,user.username)
        setAverageRating(data.averageRating)
        setCount(data.count)
        setCurrentPage(data.currentpage)
        setDecimalPart(data.decimalPart)
        setInfoItem(data.infoItem[0])
        setIntegerPart(data.integerPart)
        setListReview(data.listReview)
        setNextPage(data.nextPage)
        setPageTotal(data.pageTotal)
        setPrevPage(data.prevPage)
        setTotalPages(data.totalPages)
        setTotalRating(data.totalRating)
      } catch (err) {
        console.log(err)
      }
    }
    getProduct();
  }, [product.id]);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 999));
  };
  
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleAdd = async ({item,e}) => {
    e.preventDefault()
    const userInfor = user.username
    await addCartProduct({ userInfor, item,productNumber: quantity});
  }

  const handleTab = (tab,event) =>{
    event.preventDefault();
    if (tab === tabNav) {
      return;
    }
    setTabNav(tab);
  }

  const handleSwitchPage = async ({e,page}) =>{
    try {
      const data = await productApi.getProduct(product.id,user.username,page)
      setCurrentPage(data.currentpage)
      setListReview(data.listReview)
      setNextPage(data.nextPage)
      setPageTotal(data.pageTotal)
      setPrevPage(data.prevPage)
      setTotalPages(data.totalPages)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleSubmitReview = async ({reviewText,rating}) =>{
    try {
      const data = await productApi.submitReview(product.id,user.username,reviewText,rating)
      if (data.state === 'success') {
        setListReview(data.listReviewSlice)
        setAverageRating(data.averageRating)
        setDecimalPart(data.decimalPart)
        setIntegerPart(data.integerPart)
        setTotalRating(data.totalRating)
        setTotalPages(data.totalPages)
        setCount(data.count)
        toast.success(data.message, {
          position: 'top-left',
          autoClose: 3000,
          style: { color: '$color-default', backgroundColor: '#fff' },
        });
      } else {
        toast.error(data.message, {
          position: 'top-left',
          autoClose: 3000,
          style: { color: '$color-default', backgroundColor: '#fff' },
        });
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleToggleExpand = (index) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  const handleReviewLinkClick = (event) => {
    event.preventDefault();
    if (isTab3Active) {
      // Kéo xuống review-form nếu đã switch qua tab 3
      tab3LinkRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Chuyển sang tab 3
      tab3LinkRef.current.click();

      // Xác định khi tab 3 đã hoàn thành hiệu ứng chuyển đổi
      tab3LinkRef.current.addEventListener('transitionend', () => {
        // Kéo xuống review-form
        document.getElementById('product-tab').scrollIntoView({ behavior: 'smooth' });
      }, { once: true });

      // Đánh dấu là đã switch qua tab 3
      setIsTab3Active(true);
      setTabNav(2); // Cập nhật giá trị của tabNav khi chuyển sang tab 3
    }
  };

  return (
    <>
    <MainLayout add={
      <>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li><Link to="/">Home</Link></li>
                <li>Product</li>
                <li className="active">{product.id}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
            <div className="container">
              <div className="row">
                <div className="col-md-5 col-md-push-2">
                  <div id="product-main-img">
                    <div className="product-preview">
                      <img src={`${infoItem.length !== 0 && infoItem.image.path}`} alt=""/>
                    </div>
                  </div>
                </div>

                <div className="col-md-2  col-md-pull-5">
                  <div id="product-imgs">
                    <div className="product-preview">
                    <img src={`${infoItem.length !== 0 && infoItem.image.path}`} alt=""/>
                    </div>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="product-details">
                    <h2 className="product-name">{`${infoItem.length !== 0 && infoItem.name}`}</h2>
                    <div>
                      <div className="product-rating">
                        <ProductRating 
                        integerPart={integerPart}
                        decimalPart={decimalPart}
                        />
                      </div>
                      <a className="review-link" id="review-link-comment"
                      onClick={handleReviewLinkClick}
                      >{count} Review(s) | Add your review</a>
                    </div>
                    <div>
                      <h3 className="product-price">${infoItem.length !== 0 && addDos(infoItem.price)} <del className="product-old-price">$990.00</del></h3>
                      <p className="product-stock">{infoItem.length !== 0 && infoItem.number}</p>
                      <span className="product-available">In Stock</span>
                    </div>
                    <p>The iPhone 14 Pro Max is a top-of-the-line smartphone from Apple. It boasts a large and immersive 6.7-inch Super Retina XDR display, a powerful A18 Bionic chip, and a triple-camera system with improved low-light performance. It also features 5G connectivity, MagSafe charging, and a durable Ceramic Shield front cover. With its sleek design and advanced features, the iPhone 14 Pro Max is a great choice for those seeking a high-end mobile device.</p>

                    <div className="add-to-cart">
                      <div className="qty-label">
                        Qty
                        <div className="input-number" id="input-quatity">
                          <Input
                            className="qty-number"
                            type="number"
                            placeholder="0"
                            value={quantity}
                            max="999"
                            onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, 999)))}
                          />
                          <span className="qty-up" onClick={increaseQuantity}>+</span>
                          <span className="qty-down" onClick={decreaseQuantity}>-</span>
                        </div>
                      </div>
                      <AddCartButton 
                        text='Add to cart'
                        onclick={(e) => handleAdd({item:infoItem, e })}
                      />
                    </div>
                    <div className='alert alert-dismissible' role='alert'>
                    </div>
                    <ul className="product-btns">
                      <li><a href="#"><i className="fa fa-heart-o"></i> add to wishlist</a></li>
                      <li><a href="#"><i className="fa fa-exchange"></i> add to compare</a></li>
                    </ul>

                    <ul className="product-links">
                      <li>Category:</li>
                      <li><a href="#">{infoItem.length !== 0 && infoItem.category}</a></li>
                    </ul>

                    <ul className="product-links">
                      <li>Share:</li>
                      <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                      <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                      <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                      <li><a href="#"><i className="fa fa-envelope"></i></a></li>
                    </ul>

                  </div>
                </div>

                <div className="col-md-12">
                  <div id="product-tab">
                    <ul className="tab-nav" ref={tab3LinkRef}>
                      <li className={tabNav === 0 ? "active" : ""} onClick={(event) => handleTab(0, event)}>
                        <a data-toggle="tab" href="#tab1">Description
                        </a></li>
                      <li className={tabNav === 1 ? "active" : ""} onClick={(event) => handleTab(1, event)}>
                        <a data-toggle="tab" href="#tab2">Details</a>
                      </li>
                      <li className={tabNav === 2 ? "active" : ""} onClick={(event) => handleTab(2, event)}>
                        <a data-toggle="tab" href="#tab3">Reviews ({count})</a>
                        </li>
                    </ul>

                    <div className="tab-content">
                      <div id="tab1" className={tabNav === 0 ? "tab-pane fade in active" : "tab-pane fade in"}>
                        <div className="row">
                          <div className="col-md-12">
                            <p>{infoItem.length !== 0 && infoItem.desc}</p>											
                          </div>
                        </div>
                      </div>

                      <div id="tab2" className={tabNav === 1 ? "tab-pane fade in active" : "tab-pane fade in"}>
                        <div className="row">
                          <div className="col-md-12">
                            <h3 className="title">Information</h3>
                            <p dangerouslySetInnerHTML={{ __html: downLine(infoItem.detail) }}/>
                          </div>
                        </div>
                      </div>

                      <div id="tab3" className={tabNav === 2 ? "tab-pane fade in active" : "tab-pane fade in"}>
                        <div className="row">
                          <div className="col-md-3">
                            <div id="rating">
                              <div className="rating-avg">
                                <span>{averageRating}</span>
                                <div className="rating-stars">
                                <ProductRating 
                                  integerPart={integerPart}
                                  decimalPart={decimalPart}
                                  />
                                </div>
                              </div>
                              <ul className="rating">
                              {totalRating && totalRating.length !== 0 && totalRating.map((rating, index) => (
                                <li key={index}>
                                  <div className="rating-stars">
                                    {[...Array(5)].map((_, starIndex) => (
                                      <i
                                        key={starIndex}
                                        className={`fa fa-star${starIndex < rating.rating ? '' : '-o'}`}
                                      ></i>
                                    ))}
                                  </div>
                                  <div className="rating-progress">
                                    {rating.percent ? (
                                      <div style={{ width: `${rating.percent}%` }}></div>
                                    ) : (
                                      <div></div>
                                    )}
                                  </div>
                                  <span className="sum">{rating.count}</span>
                                </li>
                              ))}
                                </ul>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div id="reviews">
                              <ul className="reviews" id="row-list-review">
                              {listReview && listReview.length !== 0 && listReview.map((review, index) => (
                                <li key={index}>
                                  <div className="review-heading">
                                    <h5 className="name">{review.userReview}</h5>
                                    <p className="date">{review.date}</p>
                                    <div className="review-rating">
                                      {[...Array(5)].map((_, starIndex) => (
                                        <i
                                          key={starIndex}
                                          className={`fa fa-star${starIndex < review.rating ? '' : '-o'}`}
                                        ></i>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="review-body">
                                    <p className={expandedStates[index] ? 'expanded' : ''}>
                                          {expandedStates[index]
                                        ? review.reviewPost
                                        : review.reviewPost?.length > 100
                                        ? `${review.reviewPost.slice(0, 100)}...`
                                        : review.reviewPost}
                                    </p>
                                    {review.reviewPost?.length > 100 && (
                                      <button className="read-more" onClick={() => handleToggleExpand(index)}>
                                        {expandedStates[index] ? 'Hide' : 'Continue'}
                                      </button>
                                    )}
                                  </div>
                                </li>
                              ))}
                              </ul>
                              <ul className="reviews-pagination" id="pagination-review">
                              <Pagination
                                onclick = {handleSwitchPage}
                                currentpage = {currentPage}
                                prevP = {1}
                                prevPage = {prevPage} 
                                totalPages = {totalPages}
                                nextP = {pageTotal ? pageTotal : 1}
                                nextPage = {nextPage}
                              />
                              </ul>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div id="review-form">
                              <ReviewForm
                                onclick={handleSubmitReview}
                                infoUser={user}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
      </>
    }>
    </MainLayout>
    </>
  )
}

export default Product