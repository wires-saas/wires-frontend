import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Domain } from '../../../../../../../services/emails.service';
import { deepClone } from '../../../../../../../utils/deep-clone';
import { DomainService } from '../../../../../../../services/domain.service';

@Component({
    selector: 'app-inspect-domain',
    templateUrl: './inspect-domain.component.html',
})
export class InspectDomainComponent implements OnInit {
    @Output() onVerifyDomain: EventEmitter<Domain> = new EventEmitter<Domain>();
    @Output() onDeleteDomain: EventEmitter<Domain> = new EventEmitter<Domain>();

    private destroyRef = inject(DestroyRef);

    domain!: Domain;

    visible: boolean = false;

    saving: boolean = false;

    constructor(
        private domainService: DomainService,
    ) {}

    ngOnInit(): void {

        this.domainService.selectedDomain$
            .pipe(
                map((data) => (this.domain = deepClone(data))),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.domainService.inspectDialogVisible$
            .pipe(
                map((visible) => {
                    this.visible = visible;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    canSave(): boolean {
        return true;
    }

    cancel() {
        this.domainService.closeInspectDialog();
    }
}
