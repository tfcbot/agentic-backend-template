import { updateBillingStatus } from "@control-plane/billing/adapters/secondary/billing-management.adapter";	
import { User } from "@control-plane/billing/metadata/billing.schema";


export async function updateBillingStatusUsecase(user: User) {	
    await updateBillingStatus(user);	
    return {statusCode: 200, body: "OK"}	
}