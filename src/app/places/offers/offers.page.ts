import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  isLoading : boolean = false;
  offers: Place[];
  private placesSub : Subscription;

  constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    // this.offers = this.placesService.places;
    
    this.placesSub=this.placesService.places.subscribe(places=> {
      this.offers = places
    });

  }

  ionViewWillEnter() {

    this.isLoading=true
    this.loadingCtrl.create({
      message : 'Loading PLaces...'
    }).then((loadingEl) => {
      loadingEl.present();
      this.placesService.fetchPlaces().subscribe(()=>{
        loadingEl.dismiss()
        this.isLoading=false
      });
    })
  }

  ngOnDestroy(): void {
    if(this.placesSub){
      this.placesSub.unsubscribe();
    }
  }

  onEdit(offerId : String, slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit',offerId])
    console.log('editing...', offerId );
    
  }
}
