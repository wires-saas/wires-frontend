import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api/message';
import { HttpErrorResponse } from '@angular/common/http';


export class MessageUtils {

    static parseServerError(messageService: MessageService, err: HttpErrorResponse, overrides: Partial<Message>) {

        let detail: string = `${err.statusText} (${err.status})`;

        switch (err.status) {
            case 0:
                detail = 'Server is unreachable';
        }

        messageService.add({
            severity: 'error',
            summary: 'Error',
            detail,
            life: 3000,
            ...overrides
        });
    }
}
