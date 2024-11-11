import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { EmailsProvider } from '../../../../../../../services/emails.service';
import {
    Sender,
    SenderService,
} from '../../../../../../../services/sender.service';
import { DialogConfig } from '../../../../../../../services/feed.service';
import { deepClone } from '../../../../../../../utils/deep-clone';

@Component({
    selector: 'app-create-or-update-sender',
    templateUrl: './create-or-update-sender.component.html',
})
export class CreateOrUpdateSenderComponent implements OnInit {
    @Input() organizationSlug!: string;
    @Input() provider!: EmailsProvider;

    @Output() onCreateSender: EventEmitter<Sender> = new EventEmitter<Sender>();
    @Output() onEditSender: EventEmitter<Sender> = new EventEmitter<Sender>();
    @Output() onDeleteSender: EventEmitter<Sender> = new EventEmitter<Sender>();

    private destroyRef = inject(DestroyRef);

    sender!: Sender;

    dialogConfig: DialogConfig = { header: '', visible: false };

    saving: boolean = false;

    get creation(): boolean {
        return !!this.dialogConfig.isNew;
    }

    constructor(private senderService: SenderService) {}

    ngOnInit(): void {
        this.senderService.selectedSender$
            .pipe(
                map((sender) => {
                    if (sender) this.sender = deepClone(sender);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.senderService.dialogSource$
            .pipe(
                map((data) => {
                    this.dialogConfig = data;

                    if (this.dialogConfig.isNew) {
                        this.resetSender();
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.resetSender();
    }

    canSave(): boolean {
        return true;
    }

    cancel() {
        this.resetSender();
        this.senderService.closeDialog();
    }

    resetSender() {
        this.sender = {
            email: '',
            name: '',
        };
    }
}
