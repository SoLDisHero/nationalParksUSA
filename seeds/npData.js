const dataPark = async() => {
  const axios = require('axios');    
  try {
      const response = await axios.get("https://developer.nps.gov/api/v1/parks?limit=500&q=national%20park&api_key=WHCbThJYgh6wjZbXCnJTMnx54roXzZIkj9JbNKjH");
      console.log(response.data.data);
      return response.data.data;
  } catch (error) {
      console.error(error);
  }
}
module.exports = dataPark;