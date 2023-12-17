import React from 'react';
import { Link } from 'react-router-dom';

const PayStatus = ({message,state}) => {
  return (
    <div className="wrapper">
        {state === 'success' ? 
            <div className="alert_wrap success">
                <div className="alert_icon">
                    <ion-icon className="icon" name="checkmark"></ion-icon>
                </div>
                <div className="content">
                    <p className="title">Woohoo, Order success!</p>
                    <p className="info">
                        {message}
                    </p>
                </div>
                <Link to="/">
                    <button>Continue</button>
                </Link>
            </div>
        :
            <div className="alert_wrap error">
                <div className="alert_icon">
                    <ion-icon className="icon"  name="close"></ion-icon>
                </div>
                <div className="content">
                    <p className="title">Uh, oh!</p>
                    <p className="info">
                    We could not find information about your order. Please check the information again
                    </p>
                </div>
                <Link to="/">
                    <button>Retry</button>
                </Link>
            </div>
        }
    </div>
  );
};

export default PayStatus;
