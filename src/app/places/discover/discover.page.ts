import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import {SegmentChangeEventDetail} from '@ionic/core'

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  loadedPlacesListing : Place[]
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    // this.loadedPlaces = this.placesService.places;

    this.placesSub=this.placesService.places.subscribe(places=>{
      this.loadedPlaces = places;
      console.log(this.loadedPlaces);
      
      this.loadedPlacesListing = this.loadedPlaces.slice(1)
    })

  }

  ngOnDestroy(): void {
    if(this.placesSub)
    this.placesSub.unsubscribe();
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail.value);
    
  }
}
