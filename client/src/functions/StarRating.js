function StarRating({ integerPart, decimalPart }) {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (i <= integerPart) {
        if (decimalPart) {
          if (i < integerPart) {
            stars.push(<i key={i} className="fa fa-star"></i>);
          } else {
            if (decimalPart > 0.0) {
              stars.push(<i key={i} className="fa fa-star-half-o"></i>);
            } else {
              stars.push(<i key={i} className="fa fa-star"></i>);
            }
          }
        } else {
          stars.push(<i key={i} className="fa fa-star"></i>);
        }
      } else {
        stars.push(<i key={i} className="fa fa-star-o"></i>);
      }
    }
  
    return <>{stars}</>;
  }

  export default StarRating