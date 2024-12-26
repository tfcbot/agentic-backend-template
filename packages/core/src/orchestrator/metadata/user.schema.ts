import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from "./credits.schema";


export interface IUserAdapter {
    getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput>;
}
