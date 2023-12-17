import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import addDos from "../../functions/addDos"
import AddCartButton from "../../components/common/AddCartButton"
import useAddCartProduct from "../../functions/addCartProduct"
import { Helmet } from "react-helmet"
import { Input } from "@mui/material"
import { useState,useEffect } from "react"
import MainLayout from "../../components/layout/main/MainLayout"
import ProductLink from "../../components/common/ProductLink"
import productApi from "../../api/productApi"
import Pagination from "../../components/common/Pagination"
import ProductRating from "../../components/common/ProductRating"

const Store = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value)

    const [currentPage, setCurrentPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [infoProduct, setinfoProduct] = useState([]);
    const [nextPage, setNextPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [pageTotal, setPageTotal] = useState(1); // Giả sử giá trị ban đầu là 1
    const [prevPage, setPrevPage] = useState(1); // Giả sử giá trị ban đầu là 1
    const [totalPages, setTotalPages] = useState([1]);
    const [typeList ,setTypeList] = useState([]);
    const [page, setPage] = useState(1)
    const [sizeList ,setSizeList] = useState(0)
    const { addCartProduct } = useAddCartProduct();

    const MIN_PRICE = 0; // Giá trị tối thiểu
    const [sortBy, setSortBy] = useState(0);
    const [perPage, setPerPage] = useState(3);
    const [minPrice, setMinPrice] = useState(MIN_PRICE);
    const [maxPrice, setMaxPrice] = useState(MIN_PRICE);
    const [listType, setSelectedTypes] = useState([]);

    useEffect(() => {
        const getListProduct= async () => {
            try {
                const data = await productApi.getListProduct({page:page,sortBy:sortBy,perPage:perPage})
                setinfoProduct(data.infoProduct)
                setTypeList(data.setTypeList)
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
    }, []);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
      };
    
    const handlePerPageChange = (e) => {
        setPerPage((parseInt(e.target.value) === 0 ? 3 : 6));
    };

    const handleAdd = async ({item,e}) => {
        e.preventDefault()
        const userInfor = user.username
        await addCartProduct({ userInfor, item });
    }

    const handleQtyChange = (type, value) => {
        if (type === 'min') {
        setMinPrice(Math.max(MIN_PRICE, minPrice + value));
        } else if (type === 'max') {
        setMaxPrice(Math.max(MIN_PRICE, maxPrice + value));
        }
    };

    const handleInputChange = (type, event) => {
        const value = parseInt(event.target.value, 10) || MIN_PRICE;
        if (type === 'min') {
        setMinPrice(Math.max(MIN_PRICE, value));
        } else if (type === 'max') {
        setMaxPrice(Math.max(MIN_PRICE, value));
        }
    };

    const handleKeyDown = (type, event) => {
        if (event.key === 'ArrowUp') {
        handleQtyChange(type, 1);
        } else if (event.key === 'ArrowDown') {
        handleQtyChange(type, -1);
        }
    };

    const handleCheckboxChange = (item) => {
        const type = item.type;
        const updatedTypes = [...listType];
        const isChecked = updatedTypes.includes(type);
    
        if (isChecked) {
          const typeIndexToRemove = updatedTypes.indexOf(type);
          updatedTypes.splice(typeIndexToRemove, 1);
        } else {
          updatedTypes.push(type);
        }
    
        setSelectedTypes(updatedTypes);
    };
    
    const handleSwitchPage = async ({e,page}) =>{
        try {
            const data = await productApi.getListProduct({page,sortBy,perPage,listType,minPrice,maxPrice})
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

    useEffect(() => {
        const handleFilter = async () =>{
            try {
                const data = await productApi.filterListProduct({listType,minPrice,maxPrice,sortBy,perPage})
                setinfoProduct(data.listProduct)
                setPageTotal(data.pageTotal)
                setPrevPage(data.prevPage)
                setTotalPages(data.totalPages)
                setNextPage(data.nextPage)
                setCurrentPage(data.currentpage)
                setSizeList(data.sizeList)
                setPage(1)
            } catch (err) {
                console.log(err)
            }
        }
        handleFilter()
    },[listType,minPrice,maxPrice,sortBy,perPage])

    return (
        <MainLayout id={2} add={
            <>
            <div id="breadcrumb" className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="breadcrumb-tree">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/store">Store</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div id="aside" className="col-md-3">
                            <div className="aside">
                                <h3 className="aside-title">Categories</h3>
                                <div className="checkbox-filter">
                                    {typeList && typeList.length !== 0 && typeList.map((item, index) => (
                                        <div id="type-product" className="input-checkbox" key={index}>
                                        <input
                                            type="checkbox"
                                            id={`category-${index}`}
                                            checked={listType.includes(item.type)}
                                            onChange={() => handleCheckboxChange(item)}
                                        />
                                        <label htmlFor={`category-${index}`}>
                                            <span></span>
                                            {item.type}
                                            <small className="number-type">{`(${item.number})`}</small>
                                        </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="aside">
                                <h3 className="aside-title">Price</h3>
                                <div className="price-filter">
                                    <div id="price-slider"></div>
                                        <div className="input-number price-min">
                                            <Input
                                            id="price-min"
                                            type="number"
                                            placeholder="0"
                                            value={minPrice}
                                            onChange={(event) => handleInputChange('min', event)}
                                            onKeyDown={(event) => handleKeyDown('min', event)}
                                            />
                                            <span className="qty-up" onClick={() => handleQtyChange('min', 1)}>
                                            +
                                            </span>
                                            <span className="qty-down" onClick={() => handleQtyChange('min', -1)}>
                                            -
                                            </span>
                                        </div>
                                        <span>-</span>
                                        <div className="input-number price-max">
                                            <Input
                                            id="price-max"
                                            type="number"
                                            placeholder="0"
                                            value={maxPrice}
                                            onChange={(event) => handleInputChange('max', event)}
                                            onKeyDown={(event) => handleKeyDown('max', event)}
                                            />
                                            <span className="qty-up" onClick={() => handleQtyChange('max', 1)}>
                                            +
                                            </span>
                                            <span className="qty-down" onClick={() => handleQtyChange('max', -1)}>
                                            -
                                            </span>
                                        </div>
                                    </div>
                                <div className='alert alert-dismissible' id="filter" role='alert'></div>
                            </div>
                        </div>

                        <div id="store" className="col-md-9">
                            <div className="store-filter clearfix">
                            <div className="store-sort">
                                <label>
                                    {`Sort By: `}
                                    <select
                                    className="input-select"
                                    id="sortPage"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    >
                                    <option value="0">Newest</option>
                                    <option value="1">Popular</option>
                                    </select>
                                </label>

                                <label>
                                    {`Show: `}
                                    <select
                                    className="input-select"
                                    id="perPage"
                                    value={(perPage === 3 ? 0 : 1)}
                                    onChange={handlePerPageChange}
                                    >
                                    <option value="0">3</option>
                                    <option value="1">6</option>
                                    </select>
                                </label>
                                </div>
                                <ul className="store-grid">
                                    <li className="active"><i className="fa fa-th"></i></li>
                                    <li><a href="#"><i className="fa fa-th-list"></i></a></li>
                                </ul>
                            </div>
                            <div className="row" id="row-list-product">
                                {infoProduct && infoProduct.length !== 0 && infoProduct.map((item,index) => (
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
                                ))}
                            </div>

                            <div className="store-filter clearfix">
                                <span className="store-qty">Showing {perPage * (page - 1) + 1}-{Math.min(perPage * page, sizeList)} products</span>
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
export default Store