import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { FileSelectEvent } from 'primeng/fileupload';
import { filter, map } from 'rxjs/operators';
import { ContactFieldDefinition, ContactsService } from 'src/app/services/contacts.service';
import { OrganizationService } from 'src/app/services/organization.service';

interface CsvSummary {
  columns: { name: string; type: string }[];
  rowCount: number;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  step = 1;
  csvSummary: CsvSummary | null = null;
  fileName: string | null = null;

  private destroyRef = inject(DestroyRef);
  currentOrgSlug?: string;

  actions = [
    { name: 'Ignore', value: 'ignore' },
    { name: 'Map to existing field', value: 'map' },
    { name: 'Create new field', value: 'create' },
  ];
  selectedAction?: string;

  mappingForm: FormGroup = new FormGroup({});

  contactFields: ContactFieldDefinition[] = [];

  constructor(private organizationService: OrganizationService, private contactsService: ContactsService) {}

  ngOnInit() {
    this.organizationService.currentOrganization$
            .pipe(
                filter((org) => !!org),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(async (org) => {
                this.currentOrgSlug = org?.slug;
                if (this.currentOrgSlug) {
                    this.contactFields = await this.contactsService.getContactFields(this.currentOrgSlug);
                }
            });
  }

  onFileSelected(event: FileSelectEvent) {

    const file: File | undefined = event?.currentFiles?.length ? event.currentFiles[0] : undefined;
    if (file) {
      this.fileName = file.name;
      this.parseCsv(file);
    }
  }

  prepareMappingForm() {
    this.mappingForm = new FormGroup({});

    console.log(this.csvSummary);

    this.csvSummary?.columns.forEach((col, index) => {

      const preselectedAction = this.contactFields.find((f) => f.name === col.name) ? 'map' : 'create';

      this.mappingForm.addControl(`column-${index}`, new FormControl(preselectedAction));
    });

    console.log(this.mappingForm.value);

  }



  parseCsv(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter((l: string) => l.trim().length > 0);
      if (lines.length < 1) return;
      const headers = lines[0].split(',');
      const sampleRow = lines[1]?.split(',') || [];
      const columns = headers.map((name: string, i: number) => ({
        name,
        type: this.guessType(sampleRow[i])
      }));
      this.csvSummary = {
        columns,
        rowCount: lines.length - 1
      };

      this.prepareMappingForm();

      this.step = 2;
    };
    reader.readAsText(file);
  }

  guessType(value: string | undefined): string {
    if (!value) return 'Unknown';
    if (!isNaN(Number(value))) return 'Number';
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') return 'Boolean';
    return 'String';
  }

  reset() {
    this.step = 1;
    this.csvSummary = null;
    this.fileName = null;
  }
} 