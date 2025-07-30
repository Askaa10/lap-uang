export const mailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL_GMAIL || 'daffahafizhfirdaus07@gmail.com',
    pass: process.env.USER_PASS_GMAIL || 'ayqz guxt zloq rqti',
  },
};