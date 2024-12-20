import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Days } from '../../models/weekdays';
import { Day } from '../../models/day';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '../../services/storage.service'
import { 
  ReactiveFormsModule, 
  FormBuilder,
  FormGroup, 
  FormControl, 
  FormArray, 
  Validators, 
  AbstractControl,  
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})

export class ItemComponent {

  readonly dialogRef = inject(MatDialogRef<ItemComponent>);
  weekdays: Array<Day> = [...Days]
  medicationForm!: FormGroup
  
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly storage: LocalStorageService
  ) {
    this.createForm()
    this.addTime() //add atleast a timespan to form
  }

  get fc(): { [key: string]: AbstractControl } {
    return this.medicationForm.controls
  }

  createForm(){
    this.medicationForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      dosage: new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      unit: new FormControl(null, Validators.required),
      days: new FormControl(null, Validators.required),
      times: this.formBuilder.array([])
    })
  }

  times(): FormArray {
    return this.medicationForm.get('times') as FormArray
  }

  createTimeRecord(): FormGroup {
    return this.formBuilder.group({
      time: new FormControl(null, [Validators.required, this.uniqueValidator()])
    })
  }

  addTime() {
    this.times().push(this.createTimeRecord())
  }

  removeTime(index: number) {
    this.times().removeAt(index)
  }

  //handle day selection by click and update the form
  onDayClick(day: Day) {
    day.selected = !day.selected
    const selectedDays = this.weekdays.filter((item: Day) => item.selected).map((item: Day) => item.name)
    const value = selectedDays.length? selectedDays : null
    this.medicationForm.controls['days'].setValue(value)
    this.medicationForm.controls['days'].markAsTouched()
  }

  //close and emit false when cancle button is clicked on dialog
  closeDialog() {
    this.dialogRef.close(false)
  }

  //close and emit true when add button is clicked and data has been sent to storage
  onSubmit () {
    const payload = {
      ...this.medicationForm.value,
      times: this.medicationForm.value.times.map((item: any) => item.time),
      lastUpdated: new Date()
    }

    let items = this.storage.get('data')
    items.push(payload)
    this.storage.set('data', items)
    this.dialogRef.close(true)
  }

  //a custom validator to handle uniqueness of timespans
  private uniqueValidator(): ValidatorFn {
    const value = this.medicationForm.value.times?.map((x: any) => x.time)
    return (control: AbstractControl): ValidationErrors | null => {
      return !value.find((x: string) => x === control.value)? null : { unique: {valid: false }}
    }
  }
}
