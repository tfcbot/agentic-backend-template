import { checkoutSessionCompletedFunction } from "../adapters/secondary/billing-management.adapter";


export async function webhookUsecase(input: any) {	
    await checkoutSessionCompletedFunction(input);	
    return {statusCode: 200, body: "OK"}	
}