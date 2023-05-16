import * as dotenv from "dotenv";

dotenv.config();

export const SALESFORCE_GRANT_TYPE = process.env.GRANT_TYPE;
export const SALESFORCE_CLIENT_ID = process.env.CLIENT_ID;
export const SALESFORCE_CLIENT_SECRET = process.env.CLIENT_SECRET;
export const SALESFORCE_USERNAME = process.env.USERNAME;
export const SALESFORCE_PASSWORD = process.env.PASSWORD;
export const URL_SALESFORCE_AUTH = 'https://login.salesforce.com/services/oauth2/token';
export const URL_SALESFORCE = 'https://titamedia-dev-ed.develop.my.salesforce.com';
