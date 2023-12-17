import React from 'react';
import { useEffect,useState } from 'react';
import productApi from '../../api/productApi';
import searchApi from '../../api/searchApi';
import SearchListDropDown from './SearchListDropdown'
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {

  const navigate = useNavigate()

  const [typeList , setTypeList] = useState([])
  const [itemInput , setItemInput] = useState('')
  const [selectedType , setSelectedType] = useState('all')
  const [fetchData , setFetchData] = useState([])

  useEffect(() => {
    const getTypeProduct = async () => {
        try {
            const data = await productApi.getTypeProduct()
            setTypeList(data.typeList)
        } catch (err) {
            console.log(err)
        }
    }
    getTypeProduct();
  }, []);

  useEffect(() => {
    const searchItemResult = async () => {
      try {
          const data = await searchApi.searchItem({item:itemInput,category:selectedType});
          setFetchData(data)
      } catch (err) {
        console.log(err);
      }
    };
    searchItemResult();
  }, [itemInput,selectedType]); // Thêm itemInput vào danh sách dependency

  const handleInputChange = (event) => {
    setItemInput(event.target.value);
  };
  
  const handleSelectedType = (event) => {
    const selectedTypeName = event.target.options[event.target.selectedIndex].text;
    setSelectedType(selectedTypeName);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/search?item=${itemInput}&category=${selectedType}`)
  };
  
  return (
    <div className="col-md-6">
      <div className="header-search">
        <form id="searchBarForm" onSubmit={submitSearch}>
          <select className="input-select" name="category" id="searchItem" 
          onChange={handleSelectedType}
          >
            <option defaultValue={0}>All</option>
            {typeList.map((item, index) => (
              <option key={index} value={index + 1}>{item.type}</option>
            ))}
          </select>
          <input className="input" type="text" id="searchItemText" name="item" placeholder="Search here" 
           value={itemInput}
           onChange={handleInputChange}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
        <SearchListDropDown fetchData={fetchData}/>
      </div>
    </div>
  );
};

export default SearchBar;
