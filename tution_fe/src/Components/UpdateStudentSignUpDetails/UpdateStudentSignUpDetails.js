import React, { useState, useEffect } from 'react';
// import './StudentSignUp.css';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
// import Cookies from 'js-cookie'; 
import { updateStudentSignUpDetails } from '../../Services/ApiService';

const UpdateStudentSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.data;

  const [formData, setFormData] = useState({
    id: '',
    teacher_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    console.log(initialData,"---------this is intitial student data")
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateField = (name, value) => {
    switch (name) {
      case 'teacher_id':
        if (!value.trim()) return 'Please enter teacher ID';
        break;
      case 'first_name':
      case 'last_name':
        if (!value.trim()) return `Please enter ${name.replace('_', ' ')}`;
        break;
      case 'email':
        if (!value.trim()) return 'Please enter email';
        break;
      case 'phone_number':
        if (!value.trim()) return 'Please enter phone number';
        if (!/^[0-9]{10,13}$/.test(value)) return 'Phone number must be 10-13 digits';
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
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
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
      teacher_id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone_number: true,
      gender: true,
    });

    if (validateAll()) {
      try {
        console.log(formData,"--this is student signup update")
        const result = await updateStudentSignUpDetails(formData);
        if (result?.status_code === 200) {
          toast.success('Student profile updated successfully!');
          setTimeout(() => navigate('/'), 1000);
        } else {
          toast.error('Failed to update profile.');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.error || 'Something went wrong!');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Update Student Profile</h2>

        {[{ label: 'Teacher ID', name: 'teacher_id' },
          { label: 'First Name', name: 'first_name' },
          { label: 'Last Name', name: 'last_name' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone Number', name: 'phone_number', type: 'tel' }
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

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateStudentSignUp;
