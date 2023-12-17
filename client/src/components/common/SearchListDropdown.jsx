import React, { useEffect, useRef, useState } from 'react';
import productApi from '../../api/productApi';
import addDos from '../../functions/addDos'
import Loading from '../common/Loading'
import { Link } from 'react-router-dom';

const SearchListDropdown = ({ 
  fetchData 
}) => {
  const [limitedProducts, setLimitedProducts] = useState([]);
  const [isSearchInput , setSearchInput] = useState(false)
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false)

  const searchListRef = useRef(null);

  useEffect(() => {
    const searchData = async () => {
      try {
        if (!fetchData || !fetchData.infoProduct) {
          return;
        }

        setLoading(true)
        const { infoProduct,item,category } = fetchData;
        if(item.trim() !== '')
        {
          setIsVisible(true);
          setSearchInput(true)
          setLoading(false)

          if (infoProduct.length === 0) {
            setLimitedProducts([
              <div className="product-widget" key="not-found">
                <h3 id="not-found" className="not-found-item">
                  Not found products
                </h3>
              </div>,
            ]);
          }
          else 
          {
            const limited = infoProduct.slice(0, 2);
            const limitedProductsJSX = limited.map((item, idx) => (
              <div className="product-widget" key={idx}>
                <div className="product-img">
                  <img src={item.image.path} alt="" />
                </div>
                <div className="product-body">
                  <h3 id="product-name-dropdown" className="product-name">
                    <Link to={`/product/${item.name}`}  onClick={handleClickOnLink}>{item.name}</Link>
                  </h3>
                  <h4 id="product-price-dropdown" className="product-price">
                    ${addDos(item.price)}
                  </h4>
                </div>
              </div>
            ));

            if(infoProduct.length > 2)
            {
              limitedProductsJSX.push(
                <div className="product-widget" key="more-products">
                  <h3 id="not-found" className="not-found-item">
                    and {infoProduct.length - 2} more product
                  </h3>
                  <Link
                    to={`/search?item=${item}&category=${category}`}
                    id="search-product"
                    className="search-all-product"
                    onClick={handleClickOnLink}
                  >
                    (More here...)
                  </Link>
                </div>
              )
            }
            setLimitedProducts(limitedProductsJSX);
          }
        }
        else
        {
          setIsVisible(true);
          setSearchInput(false)
          setLoading(false)
        }
      } catch (error) {
        console.log(error);
      }
    };

    searchData();
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchListRef.current && !searchListRef.current.contains(event.target)) {
        // Click bên ngoài search-list, ẩn nó đi
        setIsVisible(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Cleanup để tránh memory leak
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOnLink = () => {
    // Khi click vào Link, ẩn search-list
    setIsVisible(false);
  };
  
  return (
    isSearchInput &&
    (
      <div ref={searchListRef} className='search-list' style={{ visibility: isVisible ? 'visible' : ''}}>
        <div className='search-list-dropdown'>
          {loading ? <Loading/> : limitedProducts}
        </div>
      </div>
    )
  );
};

export default SearchListDropdown;