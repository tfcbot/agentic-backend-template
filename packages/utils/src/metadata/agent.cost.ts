import { z } from 'zod';

export enum AIModel {
  ClaudeSonnet35 = 'ClaudeSonnet35',
  GPT4 = 'GPT4',

  GPT4Vision = 'GPT4Vision'
}

export interface TokenCosts {
  inputTokens:  number
  outputTokens: number;
}

export const ModelTokenCosts: Record<AIModel, TokenCosts> = {
  [AIModel.ClaudeSonnet35]: {
    inputTokens: .006,
    outputTokens: .015
  },
  [AIModel.GPT4]: {
    inputTokens: .005,
    outputTokens: .015
  },
  [AIModel.GPT4Vision]: {
    inputTokens: .005,
    outputTokens: .015
  }
  // Add other models and their costs here
};

