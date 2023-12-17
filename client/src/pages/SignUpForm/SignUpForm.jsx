import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import authApi from '../../api/authApi';
import { yupResolver } from "@hookform/resolvers/yup";
import {schema} from './data';
import CustomInput from "../../components/shared/CustomInput/CustomInput";
import "./styles.scss";
import { toast } from 'react-toastify';

function SignUpForm({ 
  onSignUpSuccess 
}) {
  
  const navigate = useNavigate()
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
    const {fullname,username,email,password} = form
    setLoading(true)
    try {
      const res = await authApi.register({fullname,username,email,password})
      if (res.state === 'success') {
        reset({
          fullname: "",
          username: "",
          email: "",
          password: ""
        })
        setLoading(false)
        onSignUpSuccess();
        toast.success(res.message, {
            position: 'top-left',
            autoClose: 3000,
            style: { color: '$color-default', backgroundColor: '#fff' },
        });
      }
    } catch (err) {
      const errors = err.data.msg
        toast.error(errors, {
          position: 'top-left',
          autoClose: 3000,
          style: { color: '$color-default', backgroundColor: '#fff' },
      });
      setLoading(false)
    }
  }

  return (
    <div className="form-container sign-up-container">
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
          <div className='fullname-input'>
            <CustomInput
              label='Full Name'
              id="fullname"
              type="text"
              placeholder="Nhập họ tên"
              className="fullname-login"
              setValue={setValue}
              register={register}
            >
            {errors.fullname?.message}
            </CustomInput>
          </div>
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
          <div className='email-input'>
            <CustomInput
              label='Email'
              id="email"
              type="email"
              placeholder="Nhập email"
              className="email-login"
              setValue={setValue}
              register={register}
            >
            {errors.email?.message}
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
            {errors.password?.message}
            </CustomInput>
          </div>
          <button onClick={handleSubmit(onSubmit)}>Sign Up</button>
        </div>
      }
    </div>
  );
}

export default SignUpForm;
