import { Pipe, PipeTransform } from '@angular/core';
import { Domain, DomainStatus } from '../../services/domain.service';

@Pipe({
    name: 'domainStatus',
    standalone: true,
})
export class DomainStatusPipe implements PipeTransform {
    transform(domain: Domain): string {
        switch (domain.status) {
            case DomainStatus.Verified:
                return $localize`Verified`;
            case DomainStatus.Pending:
                return $localize`Pending`;
            default:
                return $localize`N/A`;
        }
    }
}
