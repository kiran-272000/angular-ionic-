import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';


import { Place } from '../../places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode : 'select' | 'random';

  startDate : string;
  endDate : string;
  form:FormGroup


  
  constructor(private modalCtrl: ModalController) {}



  

  ngOnInit() {

    const availableFrom=new Date(this.selectedPlace.availableFrom)
    const availableTo=new Date(this.selectedPlace.availableTo)

    if(this.selectedMode==='random'){
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime()- 7*24*60*60*1000- availableFrom.getTime())).toISOString();

      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6*24*60*60*1000 - new Date(this.startDate).getTime())).toISOString();

      console.log(this.startDate);
      
    }


    this.form= new FormGroup({
      firstName : new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      lastName : new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
      guests : new FormControl('2', {updateOn:'blur', validators: [Validators.required]}),
      from : new FormControl(this.startDate, {updateOn:'blur', validators: [Validators.required]}),
      to : new FormControl(this.endDate, {updateOn:'blur', validators: [Validators.required]}),
    },{validators:[this.dateValidator('from' , 'to')]});
    
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace() {
    if(!this.form.valid){
      return;
    }
    this.modalCtrl.dismiss({ bookingData: {
      firstName : this.form.value.firstName,
      lastName : this.form.value.lastName,
      guests : this.form.value.guests,
      checkIn : this.form.value.from,
      checkOut : this.form.value.to,

    }}, 'confirm');
  }

  dateValidator(from , to): ValidatorFn{

    return (control : AbstractControl): ValidationErrors | null => {
      const startDate = new Date(control.get(from).value);
    const endDate = new Date(control.get(to).value);

    if(endDate< startDate){return {'To date must be after from date' :true}}
    return null;
    }
    
  }

  
}


