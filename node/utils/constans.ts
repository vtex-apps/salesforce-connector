/** Constans VTEX */
export const CLIENT_ENTITY_V1 = 'CL'
export const ADDRESS_ENTITY_V1 = 'AD'
export const CLIENT_ENTITY_V2 = 'Client'
export const ADDRESS_ENTITY_V2 = 'Address'
export const TRIGGER_NAME = 'customerTrigger'
export const PATH_ACTION_TRIGGER = '/v1/vtex/clients'
export const PATH_API_DATAENTITIES = '/api/dataentities'
export const PATH_SEARCH_USERID = '/search?_fields=_all&userId='
export const PATH_SEARCH_ID = '/search?_fields=_all&id='
/** Constans Salesforce */
export const PROTOCOL = 'https://'
export const GRANT_TYPE = 'authorization_code'
export const URI_SALESFORCE_AUTH =
  'https://login.salesforce.com/services/oauth2/token'
export const DOMAIN_SALESFORCE = '.my.salesforce.com'
export const PATH_AUTHENTICATION_SALESFORCE = '/v1/vtex/authenticate'
export const PATH_API_SALESFORCE = '/services/data/v57.0/sobjects'
export const PATH_QUERY_SALESFORCE = '/services/data/v57.0/query?q='
export const PATH_CONTACT_SALESFORCE = '/Contact'
export const PATH_ORDER_SALESFORCE = '/Order'
export const PATH_ACCOUNT_SALESFORCE = '/Account'
export const PATH_PRODUCT2_SALESFORCE = '/Product2'
export const PATH_PRICEBOOK2_SALESFORCE = '/Pricebook2'
export const PATH_PRICEBOOKENTRY_SALESFORCE = '/PricebookEntry'
export const PATH_ASSOCIATE_ORDER_PRODUCT_SALESFORCE = '/OrderItem'
export const PATH_OPPORTUNITY_SALESFORCE = '/Opportunity'
export const PATH_ASSOCIATE_OPPORTUNITY_PRODUCT_SALESFORCE =
  '/OpportunityLineItem'
export const PATH_CUSTOMFIELD_SALESFORCE = '/services/Soap/m/57.0'
export const PATH_FIELDS_ORDER_SALESFORCE = '/Order/describe'
/** Code Status */
export const CODE_STATUS_200 = 200
export const CODE_STATUS_201 = 201
export const CODE_STATUS_204 = 204
export const CODE_STATUS_500 = 500
/** PARAMETERS */
export const ACCOUNT_ID = 'ACCOUNT_ID'
export const LIST_PRICE_ID = 'STANDARD_PRICEBOOK_ID'
export const USERNAME = 'USERNAME'
export const PASSWORD = 'PASSWORD'
export const ACCOUNT_SALESFORCE = 'ACCOUNT_SALESFORCE'
export const CLIENT_ID = 'CLIENT_ID'
export const CLIENT_SECRET = 'CLIENT_SECRET'
export const ACCESS_TOKEN_SALEFORCE = 'ACCESS_TOKEN_SALEFORCE'
/** ENTITIES MASTER DATA */
export const ENTITY_OX = 'OX' // Entities Order Salesforce
export const ENTITY_PX = 'PX' // Entities Product PriceBook Entry
export const ENTITY_PM = 'PM' // Entities Parameter
export const ENTITY_PARAMETER_V2 = 'Parameter'
export const ENTITY_ORDER_V2 = 'OrderSalesforce'
export const ENTITY_PRICEBOOKENTRY_V2 = 'PricebookEntry'
