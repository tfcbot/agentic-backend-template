import { ClerkService} from "@utils/vendors/jwt-vendor";
import { UpdatePropertyCommandInput } from "@control-plane/auth-manager/metadata/auth-manager.schema"
    


export interface IAuthManagerAdapter {
  updateUserProperties(command: UpdatePropertyCommandInput): Promise<any>;
}

export class AuthManagerAdapter implements IAuthManagerAdapter {
    private clerkService: ClerkService;

    constructor() {
        this.clerkService = new ClerkService();
    }

    async updateUserProperties(command: UpdatePropertyCommandInput): Promise<string> {
        console.log("Updating user properties via clerk service");
        const result = await this.clerkService.updateUserProperties(command);
        return result;
    }
}