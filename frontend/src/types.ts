export interface RPCErrorType {
    code: string | number;
    message: string;
    data?: {
        message: string;
    };
}