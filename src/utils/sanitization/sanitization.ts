type SanitizedData<T> = SanitizedDataSuccess<T> | SanitizedDataFailure;

type SanitizedDataSuccess<T> = {
    success: true;
    data: T;
}

type SanitizedDataFailure = {
    success: false;
}

type Sanitizer<T> = (data: unknown) => SanitizedData<T>;

type SanitzerObject<T> = T extends object ? { [K in keyof T]: SanitzerObject<T[K]> } : Sanitizer<T>;

function sanitizedDataSuccess<T>(data: T): SanitizedDataSuccess<T> {
    return {
        success: true,
        data: data
    };
}

function sanitizedDataFailure(): SanitizedDataFailure {
    return {
        success: false
    };
}

function sanitizedDataIsSuccess<T>(data: SanitizedData<T>): data is SanitizedDataSuccess<T> {
    return data.success;
}

function sanitizedDataIsFailure<T>(data: SanitizedData<T>): data is SanitizedDataFailure {
    return !data.success;
}

function sanitizerObject<T>(sanitizerObject: SanitzerObject<T>): Sanitizer<T> {
    return (data: unknown): SanitizedData<T> => {
        if (typeof data !== 'object' || data === null) {
            return sanitizedDataFailure();
        }
        const returnData: any = {};
        for (const key in sanitizerObject) {
            if (!(key in data)) {
                return sanitizedDataFailure();
            }
            const sanitizer = sanitizerObject[key];
            const sanitizedValue = (sanitizer as Sanitizer<unknown>)((data as any)[key]);
            if (!sanitizedValue.success) {
                return sanitizedDataFailure();
            }
            returnData[key] = sanitizedValue.data;
        }
        return sanitizedDataSuccess(returnData as T);
    }
}

function sanitizerArray<T>(sanitizer: Sanitizer<T>, params?: { length?: number, minLength?: number; maxLength?: number }): Sanitizer<T[]> {
    return (data: unknown): SanitizedData<T[]> => {
        if (!Array.isArray(data)) {
            return sanitizedDataFailure();
        }
        if (params) {
            if (params.length !== undefined && data.length !== params.length) {
                return sanitizedDataFailure();
            }
            if (params.minLength !== undefined && data.length < params.minLength) {
                return sanitizedDataFailure();
            }
            if (params.maxLength !== undefined && data.length > params.maxLength) {
                return sanitizedDataFailure();
            }
        }
        const sanitizedItems: T[] = [];
        for (const item of data) {
            const sanitizedItem = sanitizer(item);
            if (!sanitizedItem.success) {
                return sanitizedDataFailure();
            }
            sanitizedItems.push(sanitizedItem.data);
        }
        return sanitizedDataSuccess(sanitizedItems);
    }
}

function sanitizerSequence<T>(...sanitizers: Sanitizer<T>[]): Sanitizer<T> {
    return (data: unknown): SanitizedData<T> => {
        let sanitizedData = data;
        for (const sanitizer of sanitizers) {
            const sanitizedDataNext = sanitizer(sanitizedData);
            if (!sanitizedDataNext.success) {
                return sanitizedDataFailure();
            }
            sanitizedData = sanitizedDataNext.data;
        }
        return sanitizedDataSuccess(sanitizedData as T);
    };
}

function sanitizerString(params?: { length?: number, minLength?: number; maxLength?: number, regex?: RegExp }): Sanitizer<string> {
    return (data: unknown): SanitizedData<string> => {
        if (typeof data !== 'string') {
            return sanitizedDataFailure();
        }
        if (params) {
            if (params.length !== undefined && data.length !== params.length) {
                return sanitizedDataFailure();
            }
            if (params.minLength !== undefined && data.length < params.minLength) {
                return sanitizedDataFailure();
            }
            if (params.maxLength !== undefined && data.length > params.maxLength) {
                return sanitizedDataFailure();
            }
            if (params.regex !== undefined && !params.regex.test(data)) {
                return sanitizedDataFailure();
            }
        }
        return sanitizedDataSuccess(data);
    };
}

function sanitizerNumber(params?: { min?: number, max?: number, options?: number[], isInteger?: boolean }): Sanitizer<number> {
    return (data: unknown): SanitizedData<number> => {
        if (typeof data !== 'number') {
            return sanitizedDataFailure();
        }
        if (params) {
            if (params.isInteger !== undefined && params.isInteger && !Number.isInteger(data)) {
                return sanitizedDataFailure();
            }
            if (params.min !== undefined && data < params.min) {
                return sanitizedDataFailure();
            }
            if (params.max !== undefined && data > params.max) {
                return sanitizedDataFailure();
            }
            if (params.options !== undefined && !params.options.includes(data)) {
                return sanitizedDataFailure();
            }
        }
        return sanitizedDataSuccess(data);
    };
}

function sanitizerBoolean(): Sanitizer<boolean> {
    return (data: unknown): SanitizedData<boolean> => {
        if (typeof data !== 'boolean') {
            return sanitizedDataFailure();
        }
        return sanitizedDataSuccess(data);
    };
}

export {
    type SanitizedData,
    type SanitizedDataSuccess,
    type SanitizedDataFailure,
    type Sanitizer,
    type SanitzerObject,
    sanitizedDataIsSuccess,
    sanitizedDataIsFailure,
    sanitizerObject,
    sanitizerArray,
    sanitizerSequence,
    sanitizerString,
    sanitizerNumber,
    sanitizerBoolean
}