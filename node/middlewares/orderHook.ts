// import axios from 'axios'
// import SalesforceClient from '../clients/salesforceClient'

export async function OrderHook(ctx: Context, next: () => Promise<any>) {
  // const {
  //   vtex: {
  //     route: { params },
  //   },
  // } = ctx

  // const {
  //   clients: { omsClient , masterDataClient },
  // } = ctx



  // const http=axios.create({
  //           headers:{
  //           VtexIdclientAutCookie: ctx.vtex.authToken,
  //               "Cache-Control":"no-cache",
  //               "X-Vtex-Use-Https":"true"
  //           }
  //        });

  // const a =await http.post(`http://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9gtDqcOkH4PKx5GaxzwrPnOsL886NZvqUj3hQddpkMGoEXP_KVm.Sg0tW8l34hWD1amdP3Hl_X9EbLZE1&client_secret=4BF9EA8BC9EA6CAA2CE2505E50BE695F7802AF4414CCE2E048D7356492E279FB&username=giovannyj@titamedia.com&password=P@sto123NgVRH5yg0xLjIeGJseqp80In`);

  // console.log(a.data);

  // const { id } = params
  // const { data } = await omsClient.getOrder(id+"")
  // const clientVtex = await masterDataClient.getClient(data.clientProfileData.userProfileId)
  // const adrress = await masterDataClient.getAddresses(clientVtex.data[0].id);
  // console.log(adrress.data);

  // const salesforceCliente = new SalesforceClient();
  // const accessToken = await salesforceCliente.auth(ctx);
  // const clientSalesforce = await salesforceCliente.get(clientVtex, accessToken);
  // if (clientVtex.data[0].email === clientSalesforce.records[0].Email) {
  //   const updateContact = await salesforceCliente.update(clientVtex, adrress.data[0], clientSalesforce.records[0].Id, accessToken);
  //   console.log(updateContact);
  // } else {
  //   const createContact = await salesforceCliente.create(clientVtex, adrress.data[0], accessToken);
  //   console.log(createContact);
  // }
  
  ctx.status = 200;
  ctx.body = "";
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS,POST,GET,PUT,DELETE,PATCH');
  await next();
}
