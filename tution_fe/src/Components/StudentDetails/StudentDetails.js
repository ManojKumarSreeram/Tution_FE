import React, { useState } from 'react';

const StudentDetails = () => {
  const [details, setDetails] = useState({
    grade: '',
    school: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Student Details:', details);
    // You can add backend API submission logic here
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fill Student Details</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Grade:
          <input type="text" name="grade" value={details.grade} onChange={handleChange} />
        </label>
        <br />
        <label>
          School:
          <input type="text" name="school" value={details.school} onChange={handleChange} />
        </label>
        <br />
        <label>
          Address:
          <input type="text" name="address" value={details.address} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit Details</button>
      </form>
    </div>
  );
};

export default StudentDetails;
