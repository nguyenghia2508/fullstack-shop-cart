import React from 'react';

const ProductRating = ({integerPart, decimalPart }) => {
  const stars = Array.from({ length: 5 }).map((_, index) => {
    const starValue = index + 1;

    if (starValue <= integerPart) {
      if (decimalPart) {
        if (starValue < integerPart) {
          return <i key={index} className="fa fa-star"></i>;
        } else {
          if (decimalPart > 0.0) {
            return <i key={index} className="fa fa-star-half-o"></i>;
          } else {
            return <i key={index} className="fa fa-star"></i>;
          }
        }
      }
    }

    return <i key={index} className="fa fa-star-o"></i>;
  });

  return <>{stars}</>;
};

export default ProductRating
