import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit {
  place: Place;
  form: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));

      this.form = new FormGroup({
        title:new FormControl(this.place.title, {
          updateOn:'change',
          validators:[Validators.required, Validators.max(10)]
        }),
        description:new FormControl(this.place.description,{
          updateOn:'change',
          validators:[Validators.required, Validators.max(120)]
        })
      })
    });

    
  }

  onEdit(){
    if(this.form.valid && (this.form.value.title !== this.place.title || this.form.value.description!==this.place.description)){
      console.log(this.form.value.title);
    }
    
  }
}
