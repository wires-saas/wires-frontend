import { HttpErrorResponse } from '@angular/common/http';

export class ErrorUtils {
    static getErrorMessage = (err: HttpErrorResponse): string => {
        let message: string = `${err.statusText} (${err.status})`;

        switch (err.status) {
            case 0:
                message = $localize `Server is unreachable`;
                break;
            default:
                if (err.error.message)
                    message += ` - ${err.error.message}`;
                break;
        }

        return message;
    }
}
