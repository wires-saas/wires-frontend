import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/api';
import { FileSelectEvent } from 'primeng/fileupload';
import { filter, map } from 'rxjs/operators';
import { ContactFieldDefinition, ContactsService } from 'src/app/services/contacts.service';
import { OrganizationService } from 'src/app/services/organization.service';

interface CsvSummary {
  columns: { name: string; type: string }[];
  rowCount: number;
}

enum Action {
  Ignore = 'ignore',
  Map = 'map',
  Create = 'create'
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

  actionOptions = [
    { name: 'Ignore', value: Action.Ignore },
    { name: 'Map to existing field', value: Action.Map },
    { name: 'Create new field', value: Action.Create },
  ];
  typeOptions = [
    { name: 'String', value: 'String' },
    { name: 'Number', value: 'Number' },
    { name: 'Boolean', value: 'Boolean' },
  ];

  fieldOptions: { name: string; value: string; type: string; disabled: boolean }[][] = [];

  mappingForm: FormGroup = new FormGroup({});

  contactFields: ContactFieldDefinition[] = [];

  messages: Message[] = [];

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

    // Create a form control for each column
    // Will contain action to apply and field name (only relevant if action is map or create)
    this.csvSummary?.columns.forEach((col, index) => {

      const preselectedAction = this.contactFields.find((f) => f.name === col.name) ? Action.Map : Action.Create;
      const preselectedField = this.contactFields.find((f) => f.name === col.name)?.name || col.name;

      this.mappingForm.addControl(`column-${index}-action`, new FormControl(preselectedAction));
      this.mappingForm.addControl(`column-${index}-field`, new FormControl(preselectedField));

      const newFieldNameControl = new FormControl(col.name, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{2,20}$/)
      ]);

      this.mappingForm.addControl(`column-${index}-new-field-name`, newFieldNameControl);

      const preselectedType = this.guessType(col.type);
      this.mappingForm.addControl(`column-${index}-type`, new FormControl({ value: preselectedType, disabled: preselectedAction === Action.Map }));



      // Generating a set of field options for each column
      this.fieldOptions = [
        ...this.fieldOptions,
        this.contactFields.map((f) => ({
          name: f.name,
          value: f.name,
          type: f.type,
          disabled: false
        }))
      ];

    });

    // This is to display a message if the user has not mapped the email field
    const showingEmailMappingMissingMessageIfNeeded = () => {

      let found = false;

      this.csvSummary?.columns.forEach((_, index) => {
        if (this.mappingForm.get(`column-${index}-field`)?.value === 'email' && this.mappingForm.get(`column-${index}-action`)?.value === Action.Map) {
          found = true;
        }
      });

      this.displayEmailMappingMissingMessage(!found);

    };


    // This is to avoid offering user to select field that is already mapped to another column
    const disablingAlreadyMappedFields = () => {

      this.fieldOptions.forEach((options, index1) => {
        options.forEach((option) => {

          option.disabled = false;

          // Finding if there is a column with action map and field name matching

          this.csvSummary?.columns.forEach((_, index2) => {
            if (index2 !== index1) {
              if (this.mappingForm.get(`column-${index2}-field`)?.value === option.value && this.mappingForm.get(`column-${index2}-action`)?.value === Action.Map) {
                option.disabled = true;
              }
            }
          });

        });
      });
    }

    disablingAlreadyMappedFields();
    showingEmailMappingMissingMessageIfNeeded();

    this.mappingForm.valueChanges.pipe(
      map(() => {
        disablingAlreadyMappedFields();
        showingEmailMappingMissingMessageIfNeeded();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

  }

  creatingNewField(index: number): boolean {
    return this.mappingForm.get(`column-${index}-action`)?.value === Action.Create;
  }

  notIgnoring(index: number): boolean {
    return this.mappingForm.get(`column-${index}-action`)?.value !== Action.Ignore;
  }

  private displayEmailMappingMissingMessage(show: boolean) {
    if (show) {
      if (this.messages.length === 0) {
      this.messages = [{
          severity: 'error',
          summary: 'Caution',
          detail: 'You need to at least map one column to "email" field',
          closable: false,
        }];
      }
    } else {
      this.messages = [];
    }
  };

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