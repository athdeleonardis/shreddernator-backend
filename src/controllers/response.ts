enum ResponseType {
    Success = "Success",
    ClientError = "UserError",
    ServerError = "ServerError"
}

type Response<Data> = ResponseSuccess<Data> | ResponseClientError | ResponseServerError;

type ResponseSuccess<Data> = {
    responseType: ResponseType.Success;
    status: number;
    data: Data;
}

type ResponseClientError = {
    responseType: ResponseType.ClientError;
    status: number;
    error: string;
}

type ResponseServerError = {
    responseType: ResponseType.ServerError;
    status: number;
    error: string;
}

function responseSuccess<Data>(status: number, data: Data): ResponseSuccess<Data> {
    return {
        responseType: ResponseType.Success,
        status: status,
        data: data
    };
}

function responseClientError(status: number, error: string): ResponseClientError {
    return {
        responseType: ResponseType.ClientError,
        status: status,
        error: error
    };
}

function responseServerError(status: number, error: string): ResponseServerError {
    return {
        responseType: ResponseType.ServerError,
        status: status,
        error: error
    };
}

function responseIsSuccess<Data>(response: Response<Data>): response is ResponseSuccess<Data> {
    return response.responseType === ResponseType.Success;
}

function responseIsClientError<Data>(response: Response<Data>): response is ResponseClientError {
    return response.responseType === ResponseType.ClientError;
}

function responseIsServerError<Data>(response: Response<Data>): response is ResponseServerError {
    return response.responseType === ResponseType.ServerError;
}

export {
    type Response,
    type ResponseSuccess,
    type ResponseClientError,
    type ResponseServerError,
    responseSuccess,
    responseClientError,
    responseServerError,
    responseIsSuccess,
    responseIsClientError,
    responseIsServerError
}