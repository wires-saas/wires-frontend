import { Pipe, PipeTransform } from '@angular/core';
import { Organization } from '../../services/organization.service';

@Pipe({
    name: 'address',
    standalone: true,
})
export class AddressPipe implements PipeTransform {
    transform(org: Organization): string {
        return (
            org.address.street +
            ', ' +
            org.address.city +
            ', ' +
            org.address.zip +
            ', ' +
            org.address.country
        );
    }
}
