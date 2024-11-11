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
import {
    CreateDomainDto,
    DomainService,
} from '../../../../../../../services/domain.service';

@Component({
    selector: 'app-create-domain',
    templateUrl: './create-domain.component.html',
})
export class CreateDomainComponent implements OnInit {
    @Output() onCreateDomain: EventEmitter<CreateDomainDto> =
        new EventEmitter<CreateDomainDto>();

    private destroyRef = inject(DestroyRef);

    domain!: CreateDomainDto;

    visible: boolean = false;

    saving: boolean = false;

    constructor(private domainService: DomainService) {}

    ngOnInit(): void {
        this.resetDomain();

        this.domainService.createDialogVisible$
            .pipe(
                map((visible) => {
                    this.visible = visible;
                    this.resetDomain();
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    canSave(): boolean {
        return true;
    }

    cancel() {
        this.resetDomain();
        this.domainService.closeCreateDialog();
    }

    resetDomain() {
        this.domain = {
            domain: '',
        };
    }
}
