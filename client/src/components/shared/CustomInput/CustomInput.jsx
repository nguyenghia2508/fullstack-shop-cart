import React, { useEffect } from 'react';
import './styles.scss';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

const CustomInput = ({
  label,
  id,
  type,
  placeholder,
  children,
  register,
  check = false,
  requirementField = true,
  visibility = false,
  disabled = false,
  className,
  radius,
  height,
  border,
  icon,
  setValue,
  subtitle,
  width,
  defaultValue,
  checkNumber = false,
  onChange = false,
  value,
}) => {
  const [isHide, setIsHide] = useState(false);

  const handleHide = () => {
    setIsHide(!isHide);
  };

  useEffect(() => {
    if (disabled) {
      setValue(id, defaultValue);
    }
  }, [disabled]);

  const isErrorMessage = (children) => {
    if (typeof children === 'object') {
      return (
        (children[0] === undefined || children[1] !== undefined) &&
        (children[0] !== undefined || children[1] === undefined)
      );
    } else {
      return children === undefined;
    }
  };
  return (
    <div
      className={`custom-input ${className ? className : ''} `}
      style={{ width: width ? width : '100%' }}
    >
      <label htmlFor={id} className='custom-input__label'>
        {label}
        {requirementField && <span className='field-requirment'>*</span>}
      </label>
      {onChange ? (
        <input
          style={{
            borderRadius: radius ? radius : '',
            height: height ? height : '',
            border: border ? border : '',
          }}
          type={
            checkNumber
              ? 'tel'
              : type === 'password'
              ? isHide
                ? 'text'
                : 'password'
              : type
          }
          pattern={checkNumber ? '[0-9]{10}' : '(.*)'}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          {...register(id)}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          style={{
            borderRadius: radius ? radius : '',
            height: height ? height : '',
            border: border ? border : '',
          }}
          type={
            checkNumber
              ? 'tel'
              : type === 'password'
              ? isHide
                ? 'text'
                : 'password'
              : type
          }
          pattern={checkNumber ? '[0-9]{10}' : '(.*)'}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          {...register(id)}
          defaultValue={defaultValue}
          value={value}
        />
      )}
      {!check && (
        <p className='custom-input__error' id={id}>
          {isErrorMessage(children) ? (
            <span
              style={{
                marginTop: '2px',
                fontSize: '12px',
                fontStyle: 'italic',
                color: '#999',
              }}
            >
              {subtitle}
            </span>
          ) : (
            children
          )}
        </p>
      )}
      {visibility && (
        <div className='visibility-icon' onClick={handleHide}>
          {isHide ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
