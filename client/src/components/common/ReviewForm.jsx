import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReviewForm = ({ 
  infoUser,
  onclick
}) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to handle form submission
    onclick({reviewText,rating});
    setReviewText('')
    setRating(null)
  };

  return (
    <form className="review-form" id="review-form-user" onSubmit={handleSubmit}>
      {infoUser && Object.keys(infoUser).length !== 0 ? (
          <>
          <i className="fa fa-user-o" style={{ marginBottom: '15px' }}></i> {infoUser.fullname}
          <textarea
            className="input"
            id="review-input"
            placeholder="Your Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <div className="input-rating" id="rating-container">
            <span>Your Rating: </span>
            <div className="stars">
              {[5, 4, 3, 2, 1].map((value) => (
                <React.Fragment key={value}>
                  <input
                    id={`star${value}`}
                    name="rating"
                    value={value}
                    type="radio"
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                  <label htmlFor={`star${value}`}></label>
                </React.Fragment>
              ))}
            </div>
          </div>
          <button type="submit" id="submit-review" className="primary-btn">
            Submit
          </button>
          <div className="alert alert-dismissible" id="review" style={{ marginTop: '15px' }} role="alert">
            {/* Add your alert content here */}
          </div>
          </>
      ) : (
        <React.Fragment>
          <p>
            <strong>Sign Up to comment </strong>
          </p>
          <Link to="/user/login">Click here</Link>
        </React.Fragment>
      )}
    </form>
  );
};

export default ReviewForm;
