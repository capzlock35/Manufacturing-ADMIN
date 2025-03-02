import axios from 'axios'

const getHr3document = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_GATEWAY_URL} https://gateway.jjm-manufacturing.com/hr3/get-documents`, { documentFile, description });
        console.log(response.data);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };
export {getHr3document}