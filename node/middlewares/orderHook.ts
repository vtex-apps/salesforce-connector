// import axios from 'axios'
import SalesforceClient from '../clients/salesforceClient'

export async function OrderHook(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const {
    clients: { omsClient , masterDataClient },
  } = ctx

  const { id } = params

  const { data } = await omsClient.getOrder(id+"")
  // console.log(data.clientProfileData);

  const clients = await masterDataClient.getClient(data.clientProfileData.userProfileId)

  // console.log(clients.data);

  const adrress = await masterDataClient.getAddresses(clients.data[0].id);
  console.log(adrress.data);

  const salesforceCliente = new SalesforceClient();
  const response = await salesforceCliente.auth();

  // const params2 = {
  //   grant_type: "password",
  //   client_id: "3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1",
  //   client_secret: "4BF9EA8BC9EA6CAA2CE2505E50BE695F7802AF4414CCE2E048D7356492E279FB",
  //   username: "giovannyj@titamedia.com",
  //   password: "P@sto123NgVRH5yg0xLjIeGJseqp80In",
  // }

  // const response = await axios.post('http://login.salesforce.com/services/oauth2/token', null, {params: params2});
  console.log(response);

  ctx.status = 200;
  ctx.body = "";
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,POST,GET,PUT,DELETE,PATCH');
  await next();
}
