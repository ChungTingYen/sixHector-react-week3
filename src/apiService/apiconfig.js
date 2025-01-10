import axios from "axios";
// const apiPath = 'iamallan';
// const adminBaseUrl = `https://ec-course-api.hexschool.io/v2/api/${apiPath}/admin`;
//const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ii1XWnBLUSJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS92dWUtY291cnNlLWFwaSIsImF1ZCI6InZ1ZS1jb3Vyc2UtYXBpIiwiYXV0aF90aW1lIjoxNzM2NDAzNDQyLCJ1c2VyX2lkIjoiOTBWTjdzZWZHa2ExOFFQd2lETUtUaVNHajlYMiIsInN1YiI6IjkwVk43c2VmR2thMThRUHdpRE1LVGlTR2o5WDIiLCJpYXQiOjE3MzY0MDM0NDMsImV4cCI6MTczNjgzNTQ0MywiZW1haWwiOiJpYW1hbGxhbjA5MTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiaWFtYWxsYW4wOTE3QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.HCe_ABQk0yjbGTryjfE30kaHoLRf9TFqiR6FO7wpWTtc8u4ROek50XiFb0TlbSkJttzgCbFnuWGD0kKkJBRZaaFvdqmV5vbsNHwD1Myhr8xTifVzsoZ7EL_CkI9lEgnK8imkOqM7bIq_yMs2PKeB0NBykEE4zgdz9RyWNO5koXVOfSO4XSnz6WPYefIJw0f6VxV1XdeStwL8Z8zmZbHM9HXc_8aVSnNMS7AeihT0wB_VlkEF9s-nnboI_sq4CM2OqoU8ak7cZnNA9_UHLvk_fBpoHZA6FBqxnQgkjoHUoh358cFKoy9RcXH8-xzfyP5NCkR4jM0wvPBPQfpn08h0YA';

const adminBaseUrl = `${import.meta.env.VITE_BASE_URL}/v2`;
console.log(adminBaseUrl);
// const headers = {
//   Authorization: token,
// };
export const adminInstance = axios.create({
  baseURL: adminBaseUrl,
  // headers,
});
