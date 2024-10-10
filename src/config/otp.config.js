const axios = require('axios');
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendOTP = async () => {
  const otp = generateOTP(); // Generate a 6-digit OTP
  const url = 'https://your-region.api.infobip.com/sms/2/text/advanced';
  const apiKey = 'c36f3ef439298afce6b05d9fa55835be-b33b93e3-46cb-4537-ac92-1cb1728b7fe8';

  const headers = {
    Authorization: `App ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const data = {
    messages: [
      {
        destinations: [{ to: '+918778010278' }],
        from: 'InfoSMS',
        text: `Your verification code is: ${otp}. Please use it within the next 5 minutes.`,
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('OTP sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error.message);
  }
};

module.exports = {
  sendOTP,
};
