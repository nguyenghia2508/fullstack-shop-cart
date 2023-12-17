import React,{ useState, useEffect } from "react";
import "./styles.scss";
import SignInForm from "../../../pages/SignInForm/SignInForm";
import SignUpForm from "../../../pages/SignUpForm/SignUpForm";
import { Container, Box } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../../utils/authUtils'
import Loading from "../../common/Loading";
import { Helmet } from 'react-helmet';

export default function LgASup() {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setTimeout(() =>{
          setLoading(false)
        },500)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
    
  return (
    <>
      <Helmet>
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap" rel="stylesheet" />
        
        {/* Font Awesome CSS */}
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
      </Helmet>

      { loading ? (
        <Loading fullHeight />
      ) : 
      (
        <div className="login-register">
        <h2>{type === 'signUp' ? 'Sign Up' : 'Sign In'}</h2>
        <div className={containerClass} id="container">
          <SignUpForm onSignUpSuccess={() => setType('signIn')}/>
          <SignInForm />
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={() => handleOnClick("signIn")}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button
                  className="ghost "
                  id="signUp"
                  onClick={() => handleOnClick("signUp")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
