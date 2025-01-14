import axios from "axios";
// const apiPath = 'iamallan';
// const adminBaseUrl = `https://ec-course-api.hexschool.io/v2/api/${apiPath}/admin`;
//const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ii1XWnBLUSJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS92dWUtY291cnNlLWFwaSIsImF1ZCI6InZ1ZS1jb3Vyc2UtYXBpIiwiYXV0aF90aW1lIjoxNzM2ODM3MjY0LCJ1c2VyX2lkIjoiOTBWTjdzZWZHa2ExOFFQd2lETUtUaVNHajlYMiIsInN1YiI6IjkwVk43c2VmR2thMThRUHdpRE1LVGlTR2o5WDIiLCJpYXQiOjE3MzY4MzcyNjQsImV4cCI6MTczNzI2OTI2NCwiZW1haWwiOiJpYW1hbGxhbjA5MTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiaWFtYWxsYW4wOTE3QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.IRUI_T-2oKAd8iIbVDCM89WqwOn6Uzl5Il6MmU1y2Sk9yNrLG3b-cVBKm8TcwTb_CjSYmX4ayfud6yIjZ6jIfGR7PsATPmvZeOCdXgSNVigQ8FYhCdBbFhyav5uLB69nFSIvCOniSINQgbLP8r-YI1_5qrUEd_OhFoeMrPW7n8-_xpqrn8u2n-H8P2UKxdSjdFDxYBxSza6Pm7--UEZJCZ9gG-22JYMdZaF0XM06F6ELrvrgrpStVs_hubY4ML_rVYay1FiXvogX50C4aABoJ7ROdFZAC9gQaXAm_4mH4ur8LQPWsBEv8GLOqzhJazQSgAYfzDxzL78RojAGJu4y-A';

const adminBaseUrl = `${import.meta.env.VITE_BASE_URL}/v2`;
console.log(adminBaseUrl);
// const headers = {
//   Authorization: token,
// };
export const adminInstance = axios.create({
  baseURL: adminBaseUrl,
  // headers,
});
