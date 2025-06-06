import React, { useState, useEffect } from 'react';
import './StudentDetails.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// import Navbar from '../Navbar/Navbar'
import { submitStudentInformation, getStudentFormDropdownData } from '../../Services/ApiService';
import Select from 'react-select';


const StudentInformation = () => {
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState({
    education_board_details: [],
    classe_details: [],
    access_level_detail: [],
    subject_details: [],
  });

  console.log(dropdownData,"-----this is drop down data 0")

  const [formData, setFormData] = useState({
    student_id: Cookies.get('id') || '',
    board_id: '',
    class_id: '',
    favourate_subjects: '',
    toughest_subjects: '',
    no_of_hours_to_study: '',
    access_levels_id: '',
    selected_subjects_ids: [],
  });



  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (name === 'selected_subjects_ids' && value.length === 0)
      return 'Please select at least one subject';

    if (['favourate_subjects', 'toughest_subjects'].includes(name)) return '';

    if (name === 'no_of_hours_to_study') {
      if (!value || isNaN(value) || parseInt(value) <= 0)
        return 'Study hours must be greater than 0';
    }

    if (!value || value.toString().trim() === '')
      return `Please enter ${name.replace(/_/g, ' ')}`;

    return '';
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const id = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        selected_subjects_ids: checked
          ? [...prev.selected_subjects_ids, id]
          : prev.selected_subjects_ids.filter((subId) => subId !== id),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (touched[name]) {
      const error = validateField(
        name,
        type === 'checkbox' ? formData.selected_subjects_ids : value
      );
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };


  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      newTouched[key] = true; // Mark all fields as touched
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(newTouched); // Set all fields to touched
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const finalData = {
      ...formData,
      student_id:formData.student_id,
      board_id: parseInt(formData.board_id),
      class_id: parseInt(formData.class_id),
      access_levels_id: parseInt(formData.access_levels_id),
      no_of_hours_to_study: parseInt(formData.no_of_hours_to_study),
    };

    console.log(finalData,"--this is final data")

    if (validateAll()) {
      try {
        const res = await submitStudentInformation(finalData);
        if (res.status_code === 200) {
          toast.success('Information submitted successfully!');
          Cookies.set('is_details_filled', true);
          setTimeout(() => navigate('/'), 1000);
        }
      } catch (err) {
        toast.error(err.error || 'Failed to submit student info');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStudentFormDropdownData();
        console.log(res,"---------this is dropdown data")
        if (res.status_code === 200) {
          setDropdownData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load dropdown data');
      }
    };
    fetchData();
  }, []);

  const filteredSubjects = dropdownData.subject_details.filter(
    (sub) =>
      parseInt(sub.edu_board_id) === parseInt(formData.board_id) &&
      parseInt(sub.class_id) === parseInt(formData.class_id)
  );

  return (
    <>
    {/* <Navbar /> */}
    <div className="student-info-container">
      <form className="student-info-form" onSubmit={handleSubmit}>
        <h2>Student Information</h2>

        {/* Student ID (disabled field) */}
        <label>
          Student ID <span className="required">*</span>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={Cookies.get('id') ? true : false}
          />
          {!Cookies.get('id') && touched.student_id && errors.student_id && (
            <p className="error">{errors.student_id}</p>
          )}
        </label>


        {/* Board Dropdown */}
        <label>
          Board <span className="required">*</span>
          <select
            name="board_id"
            value={formData.board_id}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select Board</option>
            {dropdownData.education_board_details.map((board) => (
              <option key={board.id} value={board.id}>
                {board.board}
              </option>
            ))}
          </select>
          {touched.board_id && errors.board_id && <p className="error">{errors.board_id}</p>}
        </label>

        {/* Class Dropdown */}
        <label>
          Class <span className="required">*</span>
          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select Class</option>
            {dropdownData.classe_details.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class}
              </option>
            ))}
          </select>
          {touched.class_id && errors.class_id && <p className="error">{errors.class_id}</p>}
        </label>

        {/* Access Level Dropdown */}
        <label>
          Premium Type <span className="required">*</span>
          <select
            name="access_levels_id"
            value={formData.access_levels_id}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select Access Level</option>
            {dropdownData.access_level_detail.map((al) => (
              <option key={al.id} value={al.id}>
                {al.premium_type}
              </option>
            ))}
          </select>
          {touched.access_levels_id && errors.access_levels_id && (
            <p className="error">{errors.access_levels_id}</p>
          )}
        </label>

        {/* Optional Text Fields */}
        <label>
          Favourite Subjects
          <input
            type="text"
            name="favourate_subjects"
            value={formData.favourate_subjects}
            onChange={handleChange}
          />
        </label>

        <label>
          Toughest Subjects
          <input
            type="text"
            name="toughest_subjects"
            value={formData.toughest_subjects}
            onChange={handleChange}
          />
        </label>

        {/* Study Hours */}
        <label>
          Study Hours <span className="required">*</span>
          <input
            type="number"
            name="no_of_hours_to_study"
            value={formData.no_of_hours_to_study}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.no_of_hours_to_study && errors.no_of_hours_to_study && (
            <p className="error">{errors.no_of_hours_to_study}</p>
          )}
        </label>

        {/* Subject Multi-Select Dropdown */}
        {formData.board_id && formData.class_id && (
          <>
            <label>
                Select Subjects <span className="required">*</span>
                <Select
                  isMulti
                  name="selected_subjects_ids"
                  options={filteredSubjects.map((sub) => ({
                    value: sub.id,
                    label: sub.subject,
                  }))}
                  value={filteredSubjects
                    .filter((sub) => formData.selected_subjects_ids.includes(sub.id))
                    .map((sub) => ({
                      value: sub.id,
                      label: sub.subject,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedIds = selectedOptions.map((option) => option.value);
                      setFormData((prev) => ({
                        ...prev,
                        selected_subjects_ids: selectedIds,
                      }));

                      setTouched((prev) => ({ ...prev, selected_subjects_ids: true }));

                      const error = validateField('selected_subjects_ids', selectedIds);
                      setErrors((prev) => ({ ...prev, selected_subjects_ids: error }));
                    }}

                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </label>
              {touched.selected_subjects_ids && errors.selected_subjects_ids && (
                <p className="error">{errors.selected_subjects_ids}</p>
              )}

            
          </>
        )}


        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
};

export default StudentInformation;
