import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import './Login.css'; 
import { login } from '../../Services/ApiService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    user_type: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);


  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        break;
      case 'password':
        if (!value.trim()) return 'Password is required';
        break;
      case 'user_type':
        if (!value.trim()) return 'Please select a user type';
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
      user_type: true,
    });

    if (validateAll()) {
        try {
            console.log(formData)
            const result = await login(formData);
            console.log(result,"-----this is response")
            
            if (result.status_code === 200){
              console.log("----------------")
                // Store cookies
                Cookies.set('id', result.id, { path: '/' });
                Cookies.set('token', result.token, { path: '/' });
                Cookies.set('userRole', result.user_type, { path: '/' });
                Cookies.set('isLogged', 'true', { path: '/' });

                if (result.user_type === 'student') {
                  Cookies.set('is_details_filled', result.is_user_details_filled, { path: '/' });
                  if (!result.is_user_details_filled) {
                    navigate('/student-details');
                  } else {
                    navigate('/student-dashboard');
                  }
                } else if (result.user_type === 'teacher') {
                  navigate('/teacher-dashboard');
                } else if (result.user_type === 'parent') {
                  navigate('/parent-dashboard');
                } else {
                  toast.error('Unknown user role');
                }
            }
          } catch (error) {
            console.log(error)
            toast.error(error.error || "Something went wrong!");
          }
          }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && <p className="error">{errors.email}</p>}
        </label>

        <label>
            Password:
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {touched.password && errors.password && <p className="error">{errors.password}</p>}
          </label>


        <label>
          User Type:
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">-- Select User Type --</option>
            <option value="student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Parent">Parent</option>
          </select>
          {touched.user_type && errors.user_type && <p className="error">{errors.user_type}</p>}
        </label>

        {/* <button type="submit">Login</button>
        <button type="button" onClick={() => navigate('/auth-roles')} style={{ marginLeft: '10px' }}>
          Sign Up
        </button> */}

        <div className="button-group">
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate('/auth-roles')}>Sign Up</button>
        </div>



      </form>
    </div>
  );
};

export default Login;
