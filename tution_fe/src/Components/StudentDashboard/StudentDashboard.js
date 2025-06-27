// StudentDashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './StudentDashboard.css';
import { getStudentStudyPlans, getStudentSelectedSubjects, getSubjectDifficultyLevels,insertHomeWorkData } from '../../Services/ApiService';
import StudyPlanTable from '../StudyPlanTable/StudyPlanTable';
import HomeworkForm from '../HomeWorkForm/HomeWorkForm'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';



const StudentDashboard = () => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [homeworkInputs, setHomeworkInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const studentId = Cookies.get('id');


  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getStudentStudyPlans({ student_id: studentId });
      if (res.status_code === 200) {
        const plans = res.data;
        setStudyPlans(plans);

        const today = new Date().toLocaleDateString('en-GB');
        const formattedToday = today.split('/').join('-');

        const todayPlan = plans.find(p => p.date === formattedToday);

        if (todayPlan && todayPlan.study_plan && todayPlan.study_plan.schedule?.length > 0) {
          setSelectedDate(todayPlan.date);
          setSelectedSchedule(todayPlan.study_plan.schedule);
        } else if (todayPlan && Object.keys(todayPlan.study_plan).length === 0) {
          setShowHomeworkForm(true);
          setSelectedDate(todayPlan.date);
          await fetchSubjectDetails();
        }
      }
    } catch (err) {
        toast.error('Failed to load study plans');
    } finally {
        setLoading(false);
    }
  };

  const fetchSubjectDetails = async () => {
    try {
      const subjectsRes = await getStudentSelectedSubjects({ student_id: studentId });
      const difficultyRes = await getSubjectDifficultyLevels();

      if (subjectsRes.status_code === 200) {
        setSelectedSubjects(subjectsRes.data);
      }

      if (difficultyRes.status_code === 200) {
        setDifficultyLevels(difficultyRes.data.subject_difficulty_level_details);
      }
    } catch (error) {
      toast.error('Failed to fetch subjects or difficulty levels');
    }
  };

useEffect(() => {
  fetchPlans();
}, []);


  const handleInputChange = (subjectId, value) => {
    setHomeworkInputs(prev => ({ ...prev, [subjectId]: value }));
    if (value) setErrors(prev => ({ ...prev, [subjectId]: '' }));
  };

  const handleSubmit = async () => {
    let hasError = false;
    const newErrors = {};

    selectedSubjects.forEach(sub => {
      if (!homeworkInputs[sub.sub_id]) {
        newErrors[sub.sub_id] = 'Please select difficulty';
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const subjectDetails = selectedSubjects.map(sub => ({
      subject_id: sub.sub_id,
      subject_difficulty_level: Number(homeworkInputs[sub.sub_id])
    }));

    try {
      setSubmitting(true);

      const res = await insertHomeWorkData({
        student_id: studentId,
        subject_details: subjectDetails
      });

      if (res.status_code === 200) {
          toast.success('Homework submitted successfully');
          setShowHomeworkForm(false);
          fetchPlans()
        }
      
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDateClick = (date, schedule) => {
  const today = new Date().toLocaleDateString('en-GB').split('/').join('-');

  if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
    if (date === today) {
      // today's plan is empty
      setShowHomeworkForm(true);
      setSelectedDate(date);
      fetchSubjectDetails();
    } else {
      // other date with no schedule
      setShowHomeworkForm(false);
      setSelectedDate(date);
      setSelectedSchedule([]); // empty array
    }
  } else {
    setShowHomeworkForm(false);
    setSelectedDate(date);
    setSelectedSchedule(schedule);
  }
};


  return (
    <div className="dashboard-container">
      <Navbar/>
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <h3>Study Plan History</h3>
          {studyPlans.map(plan => (
            <div
              key={plan.date}
              className={`date-item ${plan.date === selectedDate ? 'active' : ''}`}
              onClick={() => handleDateClick(plan.date, plan.study_plan.schedule)}
            >
              {plan.date}
            </div>
          ))}
        </aside>

        <main className="dashboard-main"> 
          {loading ? (
            <div className="spinner-overlay">
              <div className="spinner"></div>
            </div>
          ) : showHomeworkForm ? (
            <>
              <h2>Enter Homework Details for: {selectedDate}</h2>
              <HomeworkForm
                selectedSubjects={selectedSubjects}
                difficultyLevels={difficultyLevels}
                homeworkInputs={homeworkInputs}
                errors={errors}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
              />
            </>
            
          ) : (
            <>
              <h2>Study Plan for: {selectedDate}</h2>
              <StudyPlanTable 
                  schedule={selectedSchedule}
                  onHomeworkUpdate={fetchPlans}
                  resetTrigger={selectedDate}
                />
            </>
            
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
