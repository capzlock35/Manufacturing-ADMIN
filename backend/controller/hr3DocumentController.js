import axios from 'axios'

const getHr3document = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_GATEWAY_URL} https:backend-hr3.jjm.manufacturing.com/api/benefit/send-benefit-documents`, { documentFile, description });
        console.log(response.data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
export {getHr3document}