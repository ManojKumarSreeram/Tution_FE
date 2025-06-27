import React, { useState,useEffect } from 'react';
import './StudyPlanTable.css';
import { updateHomeWorkData } from '../../Services/ApiService';

const StudyPlanTable = ({ schedule, onHomeworkUpdate, resetTrigger }) => {
  const [rowInputs, setRowInputs] = useState({});

  // Reset rowInputs whenever resetTrigger (selectedDate) changes
  useEffect(() => {
    setRowInputs({});
  }, [resetTrigger]);
  console.log(rowInputs,"------this is row input")

  const handleInputChange = (index, field, value) => {
    setRowInputs(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (index) => {
    const item = schedule[index];
    const input = rowInputs[index] || {};
    const isCompleted = input.completed;
    const comment = input.comment;
    const file = input.file;

    // Validation
    if (!isCompleted) {
      alert('Please mark the homework as completed.');
      return;
    }

    if (!comment || comment.trim() === '') {
      alert('Please enter a comment before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('homework_status', true);
    formData.append('homework_id', item.homework_id);
    formData.append('comments', comment);
    formData.append('file_name', file ? file.name : '');
    if (file) formData.append('file', file);

    try {
      const response = await updateHomeWorkData(formData);
      if (response.status_code === 200) {
        alert('Homework updated successfully!');
        onHomeworkUpdate(); // Notify StudentDashboard to refresh data
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting homework.');
    }
  };

  const downloadFile = (base64Data, fileName) => {
    const link = document.createElement('a');
    link.href = `data:application/octet-stream;base64,${base64Data}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <div className="table-wrapper">
      <table className="study-plan-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Time Allocated</th>
            <th>Completed</th>
            <th>Upload File</th>
            <th>Comments</th>
            <th>Search</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => {
            console.log(item,index,"-----------this is item")
            const input = rowInputs[index] || {};
            console.log(input,"----------this is input")
            const isCompleted = item.is_homework_completed;

            return (
              <tr key={index}>
                <td>{item.subject}</td>
                <td>{item.time}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isCompleted || input.completed || false}
                      disabled={isCompleted}
                      onChange={() =>
                        handleInputChange(index, 'completed', !input.completed)
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                
                <td>
                  {isCompleted ? (
                    item.file_name && item.file_content ? (
                      <button
                        className="download-btn"
                        onClick={() => downloadFile(item.file_content, item.file_name)}
                        title="Download file"
                      >
                        {item.file_name}
                      </button>
                    ) : (
                      <p className="file-name">No file uploaded</p>
                    )
                  ) : (
                    <input
                      type="file"
                      onChange={(e) =>
                        handleInputChange(index, 'file', e.target.files[0])
                      }
                      className="file-input"
                    />
                  )}
                </td>


                <td>
                  {isCompleted ? (
                    <p className="file-name">{item.comments || 'No comments Entered'}</p>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter comments"
                      onChange={(e) =>
                        handleInputChange(index, 'comment', e.target.value)
                      }
                      className="comment-input"
                    />
                  )}
                </td>
                <td>
                  <div className="ask-ai-logo">
                    <img src="/ask_ai.jpg" alt="Ask_Ai" />
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleSubmit(index)}
                    disabled={isCompleted}
                    className="submit-btn"
                  >
                    Submit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudyPlanTable;
