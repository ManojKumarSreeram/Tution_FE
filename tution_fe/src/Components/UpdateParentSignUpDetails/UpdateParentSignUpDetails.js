import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
// import './ParentSignUp.css';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateParentSignUpDetails } from '../../Services/ApiService';

const UpdateParentSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    student_ids: [],
    parent_id: ''
  });

  const [errors, setErrors] = useState({});
  const [studentIdTouched, setStudentIdTouched] = useState([]);
  const [originalStudentIds, setOriginalStudentIds] = useState([]);

  useEffect(() => {

    if (data) {
      const { first_name, last_name, email, phone_number, gender, student_ids, id } = data;
      setFormData({
        first_name,
        last_name,
        email,
        phone_number,
        gender: gender || '',
        student_ids: [...student_ids],
        parent_id: id
      });
      setOriginalStudentIds([...student_ids]);
      setStudentIdTouched(Array(student_ids.length).fill(false));
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        if (!/^\d{10}$/.test(value)) return 'Phone number must be 10 digits';
        break;
      case 'gender':
        if (!value.trim()) return 'Please select gender';
        break;
      default:
        break;
    }
    return '';
  };

  const validateAll = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'student_ids' && key !== 'parent_id') {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      setStudentIdTouched(Array(formData.student_ids.length).fill(true));
      return;
    }

    const trimmedStudentIds = formData.student_ids.map(id => id.trim()).filter(id => id !== '');

    const add_student_ids = trimmedStudentIds.filter(id => !originalStudentIds.includes(id));
    const remove_student_ids = originalStudentIds.filter(id => !trimmedStudentIds.includes(id));

    const payload = {
      ...formData,
      student_ids: trimmedStudentIds,
      add_student_ids,
      remove_student_ids
    };

    try {
        console.log(payload,"------this is payload for update teacher")
      const result = await updateParentSignUpDetails(payload);
      if (result.status_code === 200) {
        toast.success("Details updated successfully");
        navigate('/'); // or redirect to dashboard
      } else {
        toast.error("Failed to update details");
      }
    } catch (error) {
      toast.error(error.error || "Error updating details");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Update Parent Details</h2>

        {[{ label: 'First Name', name: 'first_name' },
          { label: 'Last Name', name: 'last_name' },
          { label: 'Email', name: 'email' },
          { label: 'Phone Number', name: 'phone_number' }]
          .map(({ label, name }) => (
            <label key={name}>
              {label} <span className="required">*</span>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && <p className="error">{errors[name]}</p>}
            </label>
        ))}

        <label>
          Gender <span className="required">*</span>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </label>

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
        </label>

        <p className="add-more" onClick={addStudentIdField}>
          + Add one more student
        </p>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateParentSignup;
