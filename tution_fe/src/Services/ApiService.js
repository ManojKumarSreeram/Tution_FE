
import makeApiCall from '../Client/Api'
export const teacherSignUp =  async (teacherData) => {

    const config = {
      url: 'http://127.0.0.1:5000/registerTeacher', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: teacherData,
    }

    const result = await makeApiCall(config)

    return result
};

export const studentSignUp =  async (studentData) => {

    const config = {
      url: 'http://127.0.0.1:5000/registerStudent', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: studentData,
    }

    const result = await makeApiCall(config)

    return result
};

export const login =  async (loginDetails) => {

    const config = {
      url: 'http://127.0.0.1:5000/login', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: loginDetails,
    }

    const result = await makeApiCall(config)

    return result
};


