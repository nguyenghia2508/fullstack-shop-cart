import { useNavigate,useLocation } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import addDos from "../../functions/addDos"
import AddCartButton from "../../components/common/AddCartButton"
import useAddCartProduct from "../../functions/addCartProduct"
import { Helmet } from "react-helmet"
import { Input } from "@mui/material"
import { useState,useEffect } from "react"
import MainLayout from "../../components/layout/main/MainLayout"
import ProductLink from "../../components/common/ProductLink"
import Pagination from "../../components/common/Pagination"
import ProductRating from "../../components/common/ProductRating"
import searchApi from "../../api/searchApi"

const Search = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value)
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [currentPage, setCurrentPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [infoProduct, setinfoProduct] = useState([]);
    const [nextPage, setNextPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [pageTotal, setPageTotal] = useState(1); // Giả sử giá trị ban đầu là 1
    const [prevPage, setPrevPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [totalPages, setTotalPages] = useState([1]);
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(18);
    const [message, setMessage] = useState(null);
    const { addCartProduct } = useAddCartProduct();

    useEffect(() => {
        const getListProduct= async () => {
            try {
                const category = searchParams.get('category');
                const item = searchParams.get('item');
                const data = await searchApi.getSearchItem({page,item:item,category:category})
                setMessage(data.message)
                setinfoProduct(data.infoProduct)
                setPageTotal(data.pageTotal)
                setPrevPage(data.prevPage)
                setTotalPages(data.totalPages)
                setNextPage(data.nextPage)
                setCurrentPage(data.currentpage)
            } catch (err) {
                console.log(err)
            }
        }
        getListProduct();
    }, [navigate,location]);

    const handleAdd = async ({item,e}) => {
        e.preventDefault()
        const userInfor = user.username
        await addCartProduct({ userInfor, item });
    }

    const handleSwitchPage = async ({e,page}) =>{
        try {
            const category = searchParams.get('category');
            const item = searchParams.get('item');
            const data = await searchApi.getSearchItem({page,item:item,category:category})
            setCurrentPage(data.currentpage)
            setinfoProduct(data.infoProduct)
            setNextPage(data.nextPage)
            setPageTotal(data.pageTotal)
            setPrevPage(data.prevPage)
            setTotalPages(data.totalPages)
            setPage(page)
        }
        catch (err) {
          console.log(err)
        }
      }

    return (
        <MainLayout id={3} add={
            <>
            <div id="breadcrumb" className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="breadcrumb-tree">
                                <li><a href="/">Home</a></li>
                                <li><a href="/search">Search</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="container">
                    <div className="row" id="searchPage">
                        <div className='alert alert-dismissible' id="alert-dismissible" role='alert'></div>
                        <div id="store" className="col-md-9">
                            <h3 className="search-item">
                                <span>
                                    Your search: {searchParams.get('item')}
                                </span>
                            </h3>
                            <div className="row" id="row-list-product">
                                {infoProduct && infoProduct.length !== 0 
                                ? infoProduct.map((item,index) => (
                                    <div className="col-md-4 col-xs-6" key={index}>
                                        <div className="product">
                                            <div id="newItem" className="product-img">
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
                                                    <span className="totalSold">{item.totalSold} sold</span>
                                                    <span className="review-counting">{item.count} Reviews</span>
                                                </div>
                                            </div>
                                            <div className="add-to-cart">
                                                <AddCartButton
                                                text='quick add'
                                                onclick={(e) => handleAdd({ item, e })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                :
                                <span className="search-item-not-found">{message}</span>
                                }
                            </div>

                            <div className="store-filter clearfix">
                                {infoProduct && infoProduct.length && (
                                    <>
                                    <span className="store-qty">
                                    Showing {perPage * (page - 1) + 1}-{Math.min(perPage * page, infoProduct.length)} products
                                    </span>
                                    <ul className="store-pagination" id="pagination-product">
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        }>
        </MainLayout>
    )
}

export default Search