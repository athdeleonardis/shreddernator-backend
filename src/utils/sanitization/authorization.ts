type Authorizer<Auth,Data> = (auth: Auth) => Promise<AuthorizedData<Data>>;

type AuthorizedData<Data> = AuthorizedDataSuccess<Data> | AuthorizedDataFailure | AuthorizedDataNotProvided;

enum AuthorizedDataType {
    Success = "Success",
    Failure = "Failure",
    NotProvided = "NotProvided"
};

type AuthorizedDataSuccess<Data> = {
    authorizationType: AuthorizedDataType.Success;
    data: Data;
};

type AuthorizedDataFailure = {
    authorizationType: AuthorizedDataType.Failure | AuthorizedDataType.NotProvided;
};

type AuthorizedDataNotProvided = {
    authorizationType: AuthorizedDataType.NotProvided;
};

function authorizedDataSuccess<Data>(data: Data): AuthorizedDataSuccess<Data> {
    return {
        authorizationType: AuthorizedDataType.Success,
        data: data
    };
}

function authorizedDataFailure(): AuthorizedDataFailure {
    return {
        authorizationType: AuthorizedDataType.Failure
    };
}

function authorizedDataNotProvided(): AuthorizedDataNotProvided {
    return {
        authorizationType: AuthorizedDataType.NotProvided
    };
}

function authorizedDataIsSuccess<Auth,Data>(data: AuthorizedData<Data>): data is AuthorizedDataSuccess<Data> {
    return data.authorizationType === AuthorizedDataType.Success;
}

function authorizedDataIsFailure<Data>(data: AuthorizedData<Data>): data is AuthorizedDataFailure {
    return data.authorizationType === AuthorizedDataType.Failure;
}

function authorizedDataIsNotProvided<Data>(data: AuthorizedData<Data>): data is AuthorizedDataNotProvided {
    return data.authorizationType === AuthorizedDataType.NotProvided;
}

export {
    type Authorizer,
    type AuthorizedData,
    type AuthorizedDataSuccess,
    type AuthorizedDataFailure,
    type AuthorizedDataNotProvided,
    authorizedDataSuccess,
    authorizedDataFailure,
    authorizedDataNotProvided,
    authorizedDataIsSuccess,
    authorizedDataIsFailure,
    authorizedDataIsNotProvided
}