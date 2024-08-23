import {Handler, SQSHandler } from 'aws-lambda'

export const createHandler = (handlerFn: (event: any) => Promise<any>): Handler => {
    return async (event) => {
      const response = await handlerFn(event);
      return response;
    };
};

export const createSQSHandler = (handlerFn: (event: any) => Promise<any>): Handler => {
    return async (event) => {
      const response = await handlerFn(event);
      return response;
    };
};