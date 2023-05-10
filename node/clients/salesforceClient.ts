import axios from 'axios'
import qs from 'qs'

export default class SalesforceClient {
  public auth = async () => {
    const url = 'https://login.salesforce.com/services/oauth2/token';
    const data = qs.stringify({
      grant_type: 'password',
      client_id: '3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1',
      client_secret: '4BF9EA8BC9EA6CAA2CE2505E50BE695F7802AF4414CCE2E048D7356492E279FB',
      username: 'giovannyj@titamedia.com',
      password: 'P@sto123NgVRH5yg0xLjIeGJseqp80In'
    });
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    try {
      const response = await axios.post(url, data, config);
      console.log(response.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  // create method to create customer in salesforce using axios post method
  
}
