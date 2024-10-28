import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageUtils } from '../utils/message.utils';

// Service to wrap API call handling error/success messages

@Injectable()
export class ApiService {

    constructor(private messageService: MessageService) {}

    async wrap(apiCall: Promise<any>, successMessage: string, errorMessage: string): Promise<void> {
        return await apiCall
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: successMessage,
                });
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: errorMessage,
                });
            });
    }

}
