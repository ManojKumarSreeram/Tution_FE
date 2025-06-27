// HomeworkForm.js
import React from 'react';
import './HomeWorkForm.css';

const HomeWorkForm = ({
  selectedSubjects,
  difficultyLevels,
  homeworkInputs,
  errors,
  onInputChange,
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="homework-form-container">
      {isSubmitting && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="homework-form">
        <h3>Enter Today's Homework</h3>
        {selectedSubjects.map(sub => (
          <div key={sub.sub_id} className="form-row">
            <label>{sub.sub_name}</label>
            <select
              value={homeworkInputs[sub.sub_id] || ''}
              onChange={e => onInputChange(sub.sub_id, e.target.value)}
              onBlur={e => onInputChange(sub.sub_id, e.target.value)}
              className={errors[sub.sub_id] ? 'input-error' : ''}
            >
              <option value="">Select Difficulty</option>
              {difficultyLevels.map(diff => (
                <option key={diff.id} value={diff.id}>{diff.subject_difficulty}</option>
              ))}
            </select>
            {errors[sub.sub_id] && <p className="error-text">{errors[sub.sub_id]}</p>}
          </div>
        ))}
        <button onClick={onSubmit} className="submit-btn" disabled={isSubmitting}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default HomeWorkForm;
