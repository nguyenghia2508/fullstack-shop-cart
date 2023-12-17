const DeleteCartButton = ({
    item,
    onclick
}) => {
    const handleClick = (e) =>{
        onclick(e)
    }
    return (

        <button id="delete-product-cart" className="delete"  onClick={e => handleClick(e)}>
            <i id="delete-product-icon" className="fa fa-close"></i>
        </button>
    )
}

export default DeleteCartButton