import { USER_ID_LENGTH, userEmailSanitizer, userNameSanitizer, userSanitizer, userUsernameSanitizer, type User, userAgeSanitizer } from "../../models/users.models.js";
import { sanitizedDataIsFailure, sanitizerNumber, sanitizerObject, sanitizerString } from "../../utils/sanitization/sanitization.js";
import { controllerSanitize, type Controller,type SanitizedRequest } from "../controllers.js";
import { responseClientError, responseServerError, responseSuccess } from "../response.js";

const users: User[] = [
    { id: "0".padStart(USER_ID_LENGTH, "0"), username: "john_doe", email: "john.doe@example.com", name: "John Doe", age: 30 },
    { id: "1".padStart(USER_ID_LENGTH, "0"), username: "jane_smith", email: "jane.smith@example.com", name: "Jane Smith", age: 25 }
];

const getUsersFunction: Controller<undefined, undefined, undefined, User[]> = async (request: SanitizedRequest<undefined, undefined, undefined>) => {
    return responseSuccess(200, users);
}

type GetUsersByIdParams = {
    id: string;
};

const getUsersByIdParamsSanitizer = sanitizerObject<GetUsersByIdParams>({
    id: sanitizerString({ length: USER_ID_LENGTH })
});

const getUserByIdFunction: Controller<undefined, { id: string }, undefined, User> = async (request: SanitizedRequest<undefined, { id: string }, undefined>) => {
    if (!request.params) {
        return responseServerError(500, "Server error");
    }
    const params = request.params;
    if (sanitizedDataIsFailure(params)) {
        return responseClientError(400, "Invalid request parameters");
    }

    const userId = params.data.id;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return responseClientError(404, "User not found");
    }
    return responseSuccess(200, user);
};

type CreateUserBody = {
    username: string;
    email: string;
    name: string;
    age: number;
};

const createUserBodySanitizer = sanitizerObject<CreateUserBody>({
    username: userUsernameSanitizer,
    email: userEmailSanitizer,
    name: userNameSanitizer,
    age: userAgeSanitizer
});

const createUserFunction: Controller<undefined, undefined, CreateUserBody, User> = async (request: SanitizedRequest<undefined, undefined, CreateUserBody>) => {
    if (!request.body) {
        return responseServerError(500, "Server error");
    }
    const body = request.body;
    if (sanitizedDataIsFailure(body)) {
        return responseClientError(400, "Invalid request body");
    }
    const id = users.length.toString().padStart(USER_ID_LENGTH, "0");
    const user: User = { id, ...body.data };
    users.push(user);
    return responseSuccess(201, user);
};

class UsersController {
    getUsers = controllerSanitize({}, getUsersFunction);
    getUserById = controllerSanitize({ paramsSanitizer: getUsersByIdParamsSanitizer }, getUserByIdFunction);
    createUser = controllerSanitize({ bodySanitizer: createUserBodySanitizer }, createUserFunction);
}

export default new UsersController();