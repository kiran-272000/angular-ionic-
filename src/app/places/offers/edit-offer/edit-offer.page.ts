import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private placeSub : Subscription
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
      this.placeSub=this.placesService.getPlace(paramMap.get('placeId')).subscribe(place =>{
        this.place=place;
      });

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

  ngOnDestroy() {
    if (this.placeSub) this.placeSub.unsubscribe();
  }

  onEdit(){
    if(this.form.valid && (this.form.value.title !== this.place.title || this.form.value.description!==this.place.description)){
      console.log(this.form.value.title);
    }
    
  }
}
