import { sanitizerObject, sanitizerString, sanitizerNumber } from "../utils/sanitization/sanitization.js";

type User = {
    id: string;
    username: string;
    email: string;
    name: string;
    age: number;
};

const USER_ID_LENGTH = 32;

const userIdSanitizer = sanitizerString({ length: USER_ID_LENGTH });
const userUsernameSanitizer = sanitizerString({ minLength: 5, maxLength: 100 });
const userEmailSanitizer = sanitizerString({ minLength: 5, maxLength: 50 });
const userNameSanitizer = sanitizerString({ minLength: 2, maxLength: 100 });
const userAgeSanitizer = sanitizerNumber({ min: 1, max: 120, isInteger: true });

const userSanitizer = sanitizerObject<User>({
    id: userIdSanitizer,
    username: userUsernameSanitizer,
    email: userEmailSanitizer,
    name: userNameSanitizer,
    age: userAgeSanitizer
});

export {
    type User,
    USER_ID_LENGTH,
    userSanitizer,
    userIdSanitizer,
    userUsernameSanitizer,
    userEmailSanitizer,
    userNameSanitizer,
    userAgeSanitizer
};