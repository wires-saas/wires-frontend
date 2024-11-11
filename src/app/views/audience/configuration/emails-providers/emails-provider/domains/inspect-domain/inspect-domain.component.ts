import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    OnInit,
    Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { deepClone } from '../../../../../../../utils/deep-clone';
import {
    Domain,
    DomainService,
    DomainStatus,
} from '../../../../../../../services/domain.service';

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

    verifying: boolean = false;

    get header() {
        return $localize`Domain "${this.domain?.domain}"`;
    }

    constructor(private domainService: DomainService) {}

    ngOnInit(): void {
        this.domainService.selectedDomain$
            .pipe(
                map((data) => {
                    this.domain = deepClone(data);
                    this.verifying = false;
                }),
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

    canVerify(): boolean {
        return this.domain.status === DomainStatus.Pending;
    }

    verify() {
        this.verifying = true;
        this.onVerifyDomain.emit(this.domain);
    }

    cancel() {
        this.domainService.closeInspectDialog();
    }
}
