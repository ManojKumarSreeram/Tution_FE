import React, { useState, useEffect } from 'react';
// import './TeacherSignUp.css';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateTeacherSignUpDetails } from '../../Services/ApiService';

const UpdateTeacherSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    teacher_id: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (data) {
      const { first_name, last_name, email, phone_number, gender, id } = data;
      setFormData({
        first_name,
        last_name,
        email,
        phone_number,
        gender,
        teacher_id: id
      });
    }
  }, [data]);

  const validateField = (name, value) => {
    switch (name) {
      case 'first_name':
      case 'last_name':
        if (!value.trim()) return `Please enter ${name.replace('_', ' ')}`;
        break;
      case 'email':
        if (!value.trim()) return 'Please enter email';
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
      if (key !== 'teacher_id') {
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
      phone_number: true,
      gender: true
    });

    if (validateAll()) {
      try {
        const result = await updateTeacherSignUpDetails(formData);
        if (result?.status_code === 200) {
          toast.success('Profile updated successfully!');
          setTimeout(() => navigate('/'), 1000); // or navigate to dashboard
        } else {
          toast.error('Failed to update profile');
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.error || 'Something went wrong!');
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Update Teacher Profile</h2>

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

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateTeacherSignup;
