import type { RPCErrorType } from './types';

export const getRpcErrorMessage = (error: RPCErrorType): string => {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }
  