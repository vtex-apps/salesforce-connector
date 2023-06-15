import { OrderSalesforce, PriceBookEntryOrderSalesforce } from "../schemas/OrderSalesforce";
import { AxiosInstance } from "axios";
import { Result } from "../schemas/Result";
import { CODE_STATUS_200, CODE_STATUS_201, CODE_STATUS_204, ENTITY_OX, ENTITY_PM, ENTITY_PX } from "../utils/constans";
import { validateResponse } from "../utils/Util";

export default class MasterDataOrderService {

    public saveUpdateOrder = async(order: OrderSalesforce, ctx: Context, http: AxiosInstance) : Promise<Result> => {
        try {
            const response = await http.put(`http://${ctx.vtex.account}.myvtex.com/api/dataentities/${ENTITY_OX}/documents`,order);
            if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201 || response.status == CODE_STATUS_204) {
                return Result.TaskOk(response.data);
            } else {
                return Result.TaskResult(response.status, "could not be registered Order in MTDT", response.data);
            }
        } catch (error) {
            return Result.TaskResult(500, "an error has occurred  in saveUpdateOrder", error)
        }
    }

    public saveUpdatePriceBookEntry = async(pricebookEntry: PriceBookEntryOrderSalesforce, ctx: Context, http: AxiosInstance) : Promise<Result> => {
        try {
            const response = await http.put(`http://${ctx.vtex.account}.myvtex.com/api/dataentities/${ENTITY_PX}/documents`,pricebookEntry);
            if (response.status == CODE_STATUS_200 || response.status == CODE_STATUS_201 || response.status == CODE_STATUS_204) {
                return Result.TaskOk(response.data);
            } else {
                return Result.TaskResult(response.status, "could not be registered PriceBookEntry in MTDT", response.data);
            }
        } catch (error) {
            return Result.TaskResult(500, "an error has occurred  in saveUpdatePriceBookEntry", error)
        }
    }

    public getParameters = async (ctx: Context, http: AxiosInstance) : Promise<Result> => {
        try {
            const { data, status } = await http.get(`http://${ctx.vtex.account}.myvtex.com/api/dataentities/${ENTITY_PM}/search?_fields=id,parameterValue`)
            if (status === 200 && validateResponse(data)) {
                return Result.TaskOk(data);
            } else {
                return Result.TaskResult(status, "could not be get Parameters in MTDT", data);
            }
        } catch (error) {
            return Result.TaskResult(500, "an error has occurred  in getParameters", error)
        }
    }

    public getPriceBookEntry = async (productId: string, ctx: Context, http: AxiosInstance) : Promise<Result> => {
        try {
            const { data, status } = await http.get(`http://${ctx.vtex.account}.myvtex.com/api/dataentities/${ENTITY_PX}/search?_fields=_all&_where=id=${productId}`)
            if (status === 200 && validateResponse(data)) {
                return Result.TaskOk(data);
            } else {
                return Result.TaskResult(status, "could not be get Parameters in MTDT", data);
            }
        } catch (error) {
            return Result.TaskResult(500, "an error has occurred  in getParameters", error)
        }
    }


}
