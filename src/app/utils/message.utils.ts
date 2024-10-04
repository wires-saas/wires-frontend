import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api/message';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorUtils } from './error.utils';

export class MessageUtils {
    static parseServerError(
        messageService: MessageService,
        err: HttpErrorResponse,
        overrides: Partial<Message>,
    ) {
        const detail = ErrorUtils.getErrorMessage(err);

        messageService.add({
            severity: 'error',
            summary: 'Error',
            detail,
            life: 5000,
            ...overrides,
        });
    }
}
