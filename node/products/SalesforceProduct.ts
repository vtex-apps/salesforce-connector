import axios from "axios";
import { CODE_STATUS_201, PATH_ACCOUNT_SALESFORCE, PATH_API_SALESFORCE, PATH_ASSOCIATE_ORDER_PRODUCT_SALESFORCE, PATH_ORDER_SALESFORCE, PATH_PRICEBOOK2_SALESFORCE, PATH_PRICEBOOKENTRY_SALESFORCE, PATH_PRODUCT2_SALESFORCE, PATH_QUERY_SALESFORCE, URI_SALESFORCE } from "../utils/constans";
import { Result } from "../schemas/Result";
import { Item, OrderVtexResponse } from "../schemas/orderVtexResponse";

export default class SalesforceProduct {
  public createOrder = async (order: OrderVtexResponse, clientSalesforceId: string, access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const fullDate = new Date(order.creationDate);
    const date = fullDate.getFullYear() + '-' + (fullDate.getMonth() + 1) + '-' + fullDate.getDate();

    const body = {
      Description: `Pedido VTEX ${order.orderId}`,
      Status: "Draft",
      PoDate: date,
      EffectiveDate: date,
      PoNumber: order.orderId,
      OrderReferenceNumber: order.sequence,
      ShipToContactId: clientSalesforceId,
      ShippingStreet: order.address.street,
      ShippingCity: order.address.city,
      ShippingState: order.address.state,
      ShippingCountry: order.address.country,
      ShippingPostalCode: order.address.postalCode,
      AccountId: "001Do00000IFOVnIAP",
      Pricebook2Id:"01sDo000000P1znIAC"
    };

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_ORDER_SALESFORCE}`;

    try {
      const response = await http.post(url, body);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al crear la orden', error)
      return result;
    }
  }

  public createAccount = async (access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const body = {
      Name: "VTEX Account",
      Industry: "VTEX",
      Phone: "545455484",
      Website: "www.test.myvtex.com"
    };

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_ACCOUNT_SALESFORCE}`;

    try {
      const response = await http.post(url, body);
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
      QuantityUnitOfMeasure: item.measurementUnit,
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

  public createPricebook = async (access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const newPricebook = {
      Name: "Lista de Precio VTEX",
      Description: "Lista de Precio VTEX",
      IsActive: true
    }

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_PRICEBOOK2_SALESFORCE}`;

    try {
      const response = await http.post(url, newPricebook);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al crear el producto', error)
      return result;
    }
  }

  public createPricebookEntry = async (productId: string, access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const newPricebookEntry = {
      Product2Id: productId,
      Pricebook2Id: 'priceBookId',
      UnitPrice: 150000
    }

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

  public associateOrderAndProduct = async (orderId: string, pricebookEntryId: string, item: Item, access_token: string) => {
    const result = new Result();
    const http = axios.create({
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const body = {
      OrderId: orderId,
      PricebookEntryId: pricebookEntryId,
      quantity: item.quantity,
      unitPrice: item.price,
    }

    const url = `${URI_SALESFORCE}${PATH_API_SALESFORCE}${PATH_ASSOCIATE_ORDER_PRODUCT_SALESFORCE}`;

    try {
      const response = await http.post(url, body);
      result.rst(CODE_STATUS_201, response.data)
      return result;
    } catch (error) {
      result.error('Ocurrio un error al crear el producto', error)
      return result;
    }
  }
}
