import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './TeacherSignUp.css';
import { teacherSignUp } from '../../Services/ApiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie'; 


const TeacherSignUp = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'first_name':
      case 'last_name':
        if (!value.trim()) return `Please enter ${name.replace('_', ' ')}`;
        break;
      case 'email':
        if (!value.trim()) return 'Please enter email';
        break;
      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\S]{8,}$/;
        if (!value.trim()) return 'Please enter password';
        if (!passwordRegex.test(value)) {
          return 'Password must be 8+ characters, include uppercase, lowercase, number, special character and no spaces';
        }
        break;
      case 'confirm_password':
        if (!value.trim()) return 'Please confirm password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'phone_number':
        if (!value.trim()) return 'Please enter phone number';
        if (!/^\d{10}$/.test(value)) {
          return 'Phone number must be exactly 10 digits';
        }
        break;
      case 'gender':
        if (!value.trim()) return 'Please select gender';
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
  // Object.entries is a built-in JavaScript method that returns an array of a given object's and here object is formdata
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    // Object.keys(obj) gives you just the keys (property names) of an object.
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      confirm_password: true,
      phone_number: true,
      gender: true,
    });


    if (validateAll()) {
        try {
          const result = await teacherSignUp(formData);
          const status_code = result?.status_code;

          if (status_code === 200) {
              console.log('Form submitted successfully:', result);
              const teacherId = result?.data?.teacher_id;
              // Show success toast
              if (teacherId) {
              toast.success(`Registration successful! Please Note Your ID: ${teacherId}`, { autoClose: 7000 });

              // ✅ Set cookies
                Cookies.set('userRole', 'teacher', { path: '/' });
                Cookies.set('isLogged', false, { path: '/' });

              // Clear form
              setFormData({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirm_password: '',
                phone_number: '',
                gender: '',
              });

              setTouched({});
              setErrors({});

              // Navigate to login after short delay (optional)
              setTimeout(() => {
                navigate('/'); //  Navigate to login page
            }, 1000);
              } else {
                toast.error("Something went wrong while retrieving ID!");
              }
          }


        } catch (error) {
          console.log(error)
          toast.error(error.error || "Something went wrong!");
          // Navigate to login page after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
    }

  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Teacher Sign Up</h2>

        {[
          { label: 'First Name', name: 'first_name' },
          { label: 'Last Name', name: 'last_name' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone Number', name: 'phone_number', type: 'tel' },
        ].map(({ label, name, type = 'text' }) => (
          <label key={name}>
            {label} <span className="required">*</span>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched[name] && errors[name] && <p className="error">{errors[name]}</p>}
          </label>
        ))}

        {/* Password Field with Eye */}
        <label>
          Password <span className="required">*</span>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {touched.password && errors.password && <p className="error">{errors.password}</p>}
        </label>

        {/* Confirm Password Field with Eye */}
        <label>
          Confirm Password <span className="required">*</span>
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="eye-icon"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {touched.confirm_password && errors.confirm_password && (
            <p className="error">{errors.confirm_password}</p>
          )}
        </label>

        {/* Gender Dropdown */}
        <label>
          Gender <span className="required">*</span>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {touched.gender && errors.gender && <p className="error">{errors.gender}</p>}
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default TeacherSignUp;
