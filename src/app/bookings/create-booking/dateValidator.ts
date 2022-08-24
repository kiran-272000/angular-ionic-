import { AbstractControl } from "@angular/forms";

export function dateValidator(control : AbstractControl){
    const startDate = new Date(this.form.get('from').value);
    const endDate = new Date(this.form.get('to').value);

    return endDate > startDate
  }