import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux';

const ProductLink = ({
    item,
}) => {
    // const dispatch = useDispatch();

    // const handleClick = () =>{
    //     // e.preventDefault()x`
    //     dispatch(setProduct(item))
    // }
    return (
        <Link to={`/product/${(item.name ? item.name : item.productName)}`}>{item.name ? item.name : item.productName}</Link>
    )
}

export default ProductLink