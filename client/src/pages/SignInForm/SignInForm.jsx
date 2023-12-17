import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate   } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import authApi from '../../api/authApi';
import { yupResolver } from "@hookform/resolvers/yup";
import {schema} from './data';
import CustomInput from "../../components/shared/CustomInput/CustomInput";
import "./styles.scss";

function SignInForm() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    clearErrors,
    watch,
    register
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema()),
  });

  const onSubmit = async (form) => {
    const {username,password} = form
    setLoading(true)
    try {
      const res = await authApi.login({ username, password })
      localStorage.setItem('token', res.token)
      const previousPage = localStorage.getItem('previousPage')
      if (!previousPage) {
        navigate('/');
      } else {
        navigate(`${previousPage}`);
      }
      localStorage.removeItem('previousPage')
      setLoading(false)
      setMessage('')
    } catch (err) {
      const errors = err.data.msg
      setMessage(errors)
      setLoading(false)
    }
  }

  return (
    <div className="form-container sign-in-container">
      {loading ? (
      <Loading/>
      ) :
        <div className='form-login'>
          <div className="social-container">
            <a href="#" className="social">
              <i className="fab fa-facebook-f" />
            </a>
            <a href="#" className="social">
              <i className="fab fa-google-plus-g" />
            </a>
            <a href="#" className="social">
              <i className="fab fa-linkedin-in" />
            </a>
          </div>
          <span>or use your account</span>
          <div className='username-input'>
            <CustomInput
              label='username'
              id="username"
              type="text"
              placeholder="Nhập username"
              className="username-login"
              setValue={setValue}
              register={register}
            >
            {errors.username?.message}
            </CustomInput>
          </div>
          <div className='password-input'>
            <CustomInput
              label='Mật khẩu'
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="password-login"
              setValue={setValue}
              register={register}
            >
            {errors.password? errors.password.message : message}
            </CustomInput>
          </div>
          <button onClick={handleSubmit(onSubmit)}>Sign In</button>
        </div>
      }
    </div>
  );
}

export default SignInForm;
