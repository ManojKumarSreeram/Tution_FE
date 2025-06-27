import React from 'react';
import './StudyPlanTable.css';

const StudyPlanTable = ({ schedule }) => {
  return (
    <table className="study-plan-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Tag</th>
          <th>Time</th>
          <th>Hours</th>
          <th>Type</th>
          <th>Search</th>
          <th>Complete</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((item, index) => (
          <tr key={index}>
            <td>{item.subject}</td>
            <td>{item.tag}</td>
            <td>{item.time}</td>
            <td>{item.hour}</td>
            <td>{item.type}</td>
            <td>
              <button onClick={() => window.open(`https://www.google.com/search?q=${item.subject}`, '_blank')}>
                🔍
              </button>
            </td>
            <td>
              <button onClick={() => alert('Mark as complete logic here')}>✅</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudyPlanTable;
