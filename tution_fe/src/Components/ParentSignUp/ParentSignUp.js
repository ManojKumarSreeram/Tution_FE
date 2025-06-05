import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import './ParentSignUp.css';
import { parentSignUp } from '../../Services/ApiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ParentSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    gender: '',
    student_ids: ['']
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [studentIdTouched, setStudentIdTouched] = useState([false]);


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
          return 'Password must be 8+ chars, include uppercase, lowercase, number, and special char';
        }
        break;
      case 'confirm_password':
        if (!value.trim()) return 'Please confirm password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'phone_number':
        if (!value.trim()) return 'Please enter phone number';
        if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleStudentIdChange = (index, value) => {
    const updated = [...formData.student_ids];
    updated[index] = value;
    setFormData(prev => ({ ...prev, student_ids: updated }));
  };

  const addStudentIdField = () => {
    setFormData(prev => ({
      ...prev,
      student_ids: [...prev.student_ids, '']
    }));
    setStudentIdTouched(prev => [...prev, false]);
};


  const removeStudentIdField = (index) => {
    const updatedIds = [...formData.student_ids];
    updatedIds.splice(index, 1);

    const updatedTouched = [...studentIdTouched];
    updatedTouched.splice(index, 1);

    setFormData(prev => ({ ...prev, student_ids: updatedIds }));
    setStudentIdTouched(updatedTouched);
};

const handleStudentIdBlur = (index) => {
  const updatedTouched = [...studentIdTouched];
  updatedTouched[index] = true;
  setStudentIdTouched(updatedTouched);
};


  const validateAll = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'student_ids') {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      confirm_password: true,
      phone_number: true,
      gender: true
    });

    if (!validateAll()) {
      // 👇 This is the fix
      setStudentIdTouched(Array(formData.student_ids.length).fill(true));
      return;
    }

    try {
      const payload = {
        ...formData,
        student_ids: formData.student_ids.map(id => id.trim())
      };

      const result = await parentSignUp(payload);
      const status_code = result?.status_code;

      if (status_code === 200) {
        const parentId = result?.data?.parent_id;
        toast.success(`Registration successful! Your Parent ID: ${parentId}`, { autoClose: 7000 });

        Cookies.set('userRole', 'parent', { path: '/' });
        Cookies.set('isLogged', false, { path: '/' });
        Cookies.set('id',parentId,{path:'/'});

        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          confirm_password: '',
          phone_number: '',
          gender: '',
          student_ids: ['']
        });
        setTouched({});
        setErrors({});
        setStudentIdTouched([false]); // Reset touched state

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error("Something went wrong!");
      }

    } catch (error) {
      toast.error(error.error || "Something went wrong!");
      setTimeout(() => navigate('/login'), 1000);
    }
  };


  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Parent Sign Up</h2>

        {[{ label: 'First Name', name: 'first_name' },
          { label: 'Last Name', name: 'last_name' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone Number', name: 'phone_number', type: 'tel' }]
          .map(({ label, name, type = 'text' }) => (
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

        {/* Password */}
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

        {/* Confirm Password */}
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
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="eye-icon">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {touched.confirm_password && errors.confirm_password && (
            <p className="error">{errors.confirm_password}</p>
          )}
        </label>

        {/* Gender */}
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

        {/* Student IDs */}
        <label>
          Student ID(s) <span className="required">*</span>
          {formData.student_ids.map((id, idx) => (
            <div key={idx} className="student-id-wrapper">
              <input
                type="text"
                value={id}
                placeholder={`Student ID ${idx + 1}`}
                onChange={(e) => handleStudentIdChange(idx, e.target.value)}
                onBlur={() => handleStudentIdBlur(idx)}
                className="student-id-input"
              />
              {formData.student_ids.length > 1 && (
                <MdDelete
                  className="delete-student-id"
                  onClick={() => removeStudentIdField(idx)}
                  title="Remove"
                />
              )}
              {studentIdTouched[idx] && !id.trim() && (
                <p className="error">Student ID is required</p>
              )}
            </div>
          ))}


          {/* {errors.student_ids && <p className="error">{errors.student_ids}</p>} */}
        </label>

        <p className="add-more" onClick={addStudentIdField}>
          + Add one more student
        </p>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default ParentSignUp;
