export class PasswordUtils {
    static MEDIUM_REGEX = /^(?:(?!(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}).){6,}$/;
    static MEDIUM_STRING = '^(?:(?!(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{14,}).){6,}$';

    static STRONG_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{14,}$/;
    static STRONG_STRING = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{14,}$';
}
