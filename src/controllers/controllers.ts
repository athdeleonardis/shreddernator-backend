import { type Request as ExpressRequest, type Response as ExpressResponse, type NextFunction } from "express";
import { type Sanitizer, type SanitizedData } from "../utils/sanitization/sanitization.js";
import { type Authorizer, type AuthorizedData } from "../utils/sanitization/authorization.js";
import { type Response, responseIsSuccess } from "./response.js";

type ExpressController = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void;

type SanitizedRequest<AuthData,Params,Body> = {
    authorizationData: AuthorizedData<AuthData> | undefined;
    params: SanitizedData<Params> | undefined;
    body: SanitizedData<Body> | undefined;
}

type RequestSanitizerObject<AuthData,Params,Body> = {
    authorizor?: Authorizer<ExpressRequest,AuthData> | undefined;
    paramsSanitizer?: Sanitizer<Params> | undefined;
    bodySanitizer?: Sanitizer<Body> | undefined;
}

type Controller<AuthData,Params,Body,Data> = (request: SanitizedRequest<AuthData,Params,Body>) => Promise<Response<Data>>;

// returns an express controller
// takes a request sanitizer
// takes a controller

async function sanitizeRequest<AuthData,Params,Body>(requestSanitizer: RequestSanitizerObject<AuthData,Params,Body>, request: ExpressRequest): Promise<SanitizedRequest<AuthData,Params,Body>> {
    const sanitizedRequest: SanitizedRequest<AuthData,Params,Body> = {
        authorizationData: requestSanitizer.authorizor ? await requestSanitizer.authorizor(request) : undefined,
        params: requestSanitizer.paramsSanitizer ? requestSanitizer.paramsSanitizer(request.params) : undefined,
        body: requestSanitizer.bodySanitizer ? requestSanitizer.bodySanitizer(request.body) : undefined
    };
    return sanitizedRequest;
}

// Express request => Request via request sanitizer => Into controller => Response => Express response
function controllerSanitize<AuthData,Params,Body,Data>(requestSanitizer: RequestSanitizerObject<AuthData,Params,Body>, controller: Controller<AuthData,Params,Body,Data>): ExpressController {
    const _controller: ExpressController = async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const sanitizedRequest = await sanitizeRequest(requestSanitizer, req);
            const response = await controller(sanitizedRequest);
            if (responseIsSuccess(response)) {
                res.status(response.status).json(response.data);
            } else {
                res.status(response.status).json({ error: response.error });
            }
        }
        catch (error) {
            next(error);
        }
    }
    return _controller;
}

export {
    type SanitizedRequest,
    type RequestSanitizerObject,
    type Controller,
    sanitizeRequest,
    controllerSanitize
}