import axios from "axios";
import { CODE_STATUS_201, PATH_API_SALESFORCE, PATH_ASSOCIATE_PRODUCT_OPORTUNITY_SALESFORCE, PATH_OPPORTUNITY_SALESFORCE, PATH_PRICEBOOKENTRY_SALESFORCE, PATH_PRODUCT2_SALESFORCE, PATH_QUERY_SALESFORCE, URI_SALESFORCE } from "../utils/constans";
import { Result } from "../schemas/Result";
import { Item, OrderVtexResponse } from "../schemas/orderVtexResponse";

export default class SalesforceProduct {
  public createOportunity = async (order: OrderVtexResponse, access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const fullDate = new Date(order.creationDate);
    const date = fullDate.getFullYear() + '-' + (fullDate.getMonth() + 1) + '-' + fullDate.getDate();
    console.log(date);

    const opportunityData = {
      Name: order.orderId,
      StageName: order.status,
      CloseDate: date,
      Amount: order.value,
      Description: `Oportunidad creada desde VTEX con el id de orden ${order.orderId}`,
      TotalOpportunityQuantity: 1,
    };

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_OPPORTUNITY_SALESFORCE}`;

    try {
      const response = await http.post(url, opportunityData);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al crear la oportunidad', error)
      return result;
    }
  }

  public getProduct = async (item: Item, access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const url = `${URI_SALESFORCE}${PATH_QUERY_SALESFORCE}SELECT Id, Name FROM Product2 WHERE ExternalId = '${item.id}'`;

    try {
      const response = await http.get(url);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al crear el producto', error)
      return result;
    }
  }

  public createProduct = async (item: Item, access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const newProduct = {
      Name: item.name,
      Description: `Producto creado desde VTEX con el nombre ${item.name}`,
      ExternalId: item.id,
      ProductCode: item.productId,
      DisplayUrl: item.imageUrl,
      IsActive: true,
    };

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_PRODUCT2_SALESFORCE}`;

    try {
      const response = await http.post(url, newProduct);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al crear el producto', error)
      return result;
    }
  }

  public createPricebookEntry = async (access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const newPricebookEntry = {
      Pricebook2Id: 'Pricebook2Id',
      Product2Id: 'Product2Id',
      UnitPrice: 100.0,
    };

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_PRICEBOOKENTRY_SALESFORCE}`;

    try {
      const response = await http.post(url, newPricebookEntry);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al crear el producto', error)
      return result;
    }
  }

  public associateProductAndOportunity = async (access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const body = {
      OpportunityId: "006Do000004Qa3BIAS",
      PricebookEntryId: "01uDo000000ls8wIAA",
      Quantity: 1,
      UnitPrice: 15000
    }

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_ASSOCIATE_PRODUCT_OPORTUNITY_SALESFORCE}`;

    try {
      const response = await http.post(url, body);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al asociar el producto con la oportunidad', error)
      return result;
    }
  }
}
