import type { AxiosInstance } from 'axios'

import { Result } from '../schemas/Result'
import {
  CODE_STATUS_200,
  CODE_STATUS_201,
  PATH_ACCOUNT_SALESFORCE,
  PATH_API_SALESFORCE,
  PATH_CUSTOMFIELD_SALESFORCE,
  PATH_FIELDS_ORDER_SALESFORCE,
  PATH_PRICEBOOK2_SALESFORCE,
} from '../utils/constans'

export default class SalesforceConfigurationService {
  public createPricebook = async (http: AxiosInstance) => {
    const newPricebook = {
      Name: 'Lista de Precio VTEX',
      Description: 'Lista de Precio VTEX',
      IsActive: true,
    }

    const url = `${PATH_API_SALESFORCE}${PATH_PRICEBOOK2_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, newPricebook)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'Pricebook could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'An error occurred when creating pricebook in salesforce',
        error
      )
    }
  }

  public createAccount = async (http: AxiosInstance): Promise<Result> => {
    const newAccount = {
      Name: 'VTEX Account',
      Industry: 'VTEX',
      Phone: '545455484',
      Website: 'www.test.myvtex.com',
    }

    const url = `${PATH_API_SALESFORCE}${PATH_ACCOUNT_SALESFORCE}`

    try {
      const { data, status } = await http.post(url, newAccount)

      if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'Account could not be created in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'An error occurred when creating account in salesforce',
        error
      )
    }
  }

  public createCustomField = async (
    http: AxiosInstance,
    access_token: string
  ): Promise<Result> => {
    const orderStatusField = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header>
          <h:SessionHeader xmlns:h="http://soap.sforce.com/2006/04/metadata" 
            xmlns="http://soap.sforce.com/2006/04/metadata" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <sessionId>${access_token}</sessionId>
          </h:SessionHeader>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
            <metadata xsi:type="CustomField">
              <fullName>Order.Order_Status__c</fullName>
              <label>Estado de la orden</label>
              <type>Text</type>
              <length>50</length>
              <required>true</required>
            </metadata>
          </createMetadata>
        </s:Body>
      </s:Envelope>
    `

    const paymentMethodField = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header>
          <h:SessionHeader xmlns:h="http://soap.sforce.com/2006/04/metadata" 
            xmlns="http://soap.sforce.com/2006/04/metadata" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <sessionId>${access_token}</sessionId>
          </h:SessionHeader>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
            <metadata xsi:type="CustomField">
              <fullName>Order.Payment_Method__c</fullName>
              <label>Medio de pago</label>
              <type>Text</type>
              <length>50</length>
              <required>true</required>
            </metadata>
          </createMetadata>
        </s:Body>
      </s:Envelope>
    `

    const discountField = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header>
          <h:SessionHeader xmlns:h="http://soap.sforce.com/2006/04/metadata" 
            xmlns="http://soap.sforce.com/2006/04/metadata" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <sessionId>${access_token}</sessionId>
          </h:SessionHeader>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
            <metadata xsi:type="CustomField">
              <fullName>Order.Discounts__c</fullName>
              <label>Descuentos</label>
              <type>Currency</type>
              <precision>18</precision>
              <scale>2</scale>
              <required>true</required>
            </metadata>
          </createMetadata>
        </s:Body>
      </s:Envelope>
    `

    const promotionNameField = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header>
          <h:SessionHeader xmlns:h="http://soap.sforce.com/2006/04/metadata" 
            xmlns="http://soap.sforce.com/2006/04/metadata" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <sessionId>${access_token}</sessionId>
          </h:SessionHeader>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
            <metadata xsi:type="CustomField">
              <fullName>Order.Promotions__c</fullName>
              <label>Promociones y asociaciones</label>
              <type>TextArea</type>
              <required>true</required>
            </metadata>
          </createMetadata>
        </s:Body>
      </s:Envelope>
    `

    const createdBy = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header>
          <h:SessionHeader xmlns:h="http://soap.sforce.com/2006/04/metadata" 
            xmlns="http://soap.sforce.com/2006/04/metadata" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <sessionId>${access_token}</sessionId>
          </h:SessionHeader>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
            <metadata xsi:type="CustomField">
              <fullName>Order.Created_By__c</fullName>
              <label>Pedido VTEX creado por</label>
              <type>Lookup</type>
              <referenceTo>Contact</referenceTo>
              <relationshipName>Order_CreatedBy_Rel</relationshipName>
              <required>true</required>
              <deleteConstraint>Restrict</deleteConstraint>
            </metadata>
          </createMetadata>
        </s:Body>
      </s:Envelope>
    `

    const shippingType = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Header>
          <h:SessionHeader xmlns:h="http://soap.sforce.com/2006/04/metadata" 
            xmlns="http://soap.sforce.com/2006/04/metadata" 
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <sessionId>${access_token}</sessionId>
          </h:SessionHeader>
        </s:Header>
        <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema">
          <createMetadata xmlns="http://soap.sforce.com/2006/04/metadata">
            <metadata xsi:type="CustomField">
              <fullName>Order.Shipping_Type__c</fullName>
              <label>Tipo de envío</label>
              <type>Text</type>
              <length>50</length>
              <required>true</required>
            </metadata>
          </createMetadata>
        </s:Body>
      </s:Envelope>
    `

    const fields = [
      orderStatusField,
      paymentMethodField,
      discountField,
      promotionNameField,
      createdBy,
      shippingType,
    ]

    const url = `${PATH_CUSTOMFIELD_SALESFORCE}`

    try {
      fields.forEach(async (field) => {
        const { data, status } = await http.post(url, field)

        if (status === CODE_STATUS_200 || status === CODE_STATUS_201) {
          return Result.TaskOk(data)
        }

        return Result.TaskResult(
          status,
          'Custom field could not be created in salesforce',
          data
        )
      })

      return Result.TaskOk('Custom fields created successfully')
    } catch (error) {
      return Result.TaskResult(
        500,
        'An error occurred when creating Custom field in salesforce',
        error
      )
    }
  }

  public getFielsOrder = async (http: AxiosInstance): Promise<Result> => {
    const url = `${PATH_API_SALESFORCE}${PATH_FIELDS_ORDER_SALESFORCE}`

    try {
      const { data, status } = await http.get(url)

      if (status === CODE_STATUS_200) {
        return Result.TaskOk(data)
      }

      return Result.TaskResult(
        status,
        'Order fields could not be queried in salesforce',
        data
      )
    } catch (error) {
      return Result.TaskResult(
        500,
        'an error occurred while viewing the Order fields',
        error
      )
    }
  }
}
