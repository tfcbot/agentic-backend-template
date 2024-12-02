
import { AIModel, ModelTokenCosts } from '@utils/metadata/agent.cost'


export const getTokenCosts = async(model: AIModel, inputTokens: number, outputTokens: number) => {
  const inputCost = (ModelTokenCosts[model].inputTokens / 1000) * inputTokens;
  const outputCost = (ModelTokenCosts[model].outputTokens / 1000) * outputTokens;
  const totalCost = inputCost + outputCost;
  
  return totalCost;
}


