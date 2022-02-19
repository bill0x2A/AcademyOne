import type { RPCErrorType } from './types';

export const getRpcErrorMessage = (error: RPCErrorType): string => {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
};


export const getTextFromIPFS = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (response.ok) {
    const text = await response.text();
    return text;
  }
  return '';
};
  