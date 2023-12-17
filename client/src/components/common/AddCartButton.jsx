const AddCartButton = ({
    item,
    text,
    onclick
}) => {
    const handleClick = (e) =>{
        onclick(e)
    }
    return (

        <a href="/">
            <button className="add-to-cart-btn" onClick={e => handleClick(e)}>
            <i className="fa fa-shopping-cart"></i> 
            {text}
            </button>
        </a>
    )
}

export default AddCartButton