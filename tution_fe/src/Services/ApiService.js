
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

export const submitStudentInformation =  async (studentInformation) => {

    const config = {
      url: 'http://127.0.0.1:5000/insertStudentDetails', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: studentInformation,
    }

    const result = await makeApiCall(config)

    return result
};

export const getStudentFormDropdownData =  async (studentInformation) => {

    const config = {
      url: 'http://127.0.0.1:5000/studentRegMasterData', // full URL
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    const result = await makeApiCall(config)

    return result
};

export const parentSignUp =  async (parentData) => {

    const config = {
      url: 'http://127.0.0.1:5000/registerParent', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: parentData,
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

export const getStudentProfileDetails =  async (data) => {

    const config = {
      url: 'http://127.0.0.1:5000/getStudentProfileDetails', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    const result = await makeApiCall(config)

    return result
};

export const getTeacherProfileDetails =  async (data) => {

    const config = {
      url: 'http://127.0.0.1:5000/getTeacherProfileDetails', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    const result = await makeApiCall(config)

    return result
};

export const getParentProfileDetails =  async (data) => {

    const config = {
      url: 'http://127.0.0.1:5000/getParentProfileDetails', // full URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    const result = await makeApiCall(config)

    return result
};

// need to chage the url
export const updateTeacherSignUpDetails =  async (teacherData) => {

    const config = {
      url: 'http://127.0.0.1:5000/updateTeacherDetails', // full URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: teacherData,
    }

    const result = await makeApiCall(config)

    return result
};

export const updateParentSignUpDetails =  async (parentData) => {

    const config = {
      url: 'http://127.0.0.1:5000/updateParentDetails', // full URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: parentData,
    }

    const result = await makeApiCall(config)

    return result
};

export const updateStudentSignUpDetails =  async (studentData) => {

    const config = {
      url: 'http://127.0.0.1:5000/updateStudentDetails', // full URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: studentData,
    }

    const result = await makeApiCall(config)

    return result
};