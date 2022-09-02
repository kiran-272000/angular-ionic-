import { Component, OnDestroy, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { SegmentChangeEventDetail } from "@ionic/core";

import { PlacesService } from "../places.service";
import { Place } from "../place.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  loadedPlacesListing: Place[];
  releventPlaces: Place[];
  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // this.loadedPlaces = this.placesService.places;

    this.placesSub = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.releventPlaces = this.loadedPlaces;
      this.loadedPlacesListing = this.releventPlaces.slice(1);
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) this.placesSub.unsubscribe();
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === "all") {
      this.releventPlaces = this.loadedPlaces;
    } else {
      this.releventPlaces = this.loadedPlaces.filter(
        (places) => places.userId !== this.authService.userId
      );
    }
    this.loadedPlacesListing = this.releventPlaces.slice(1);
  }
}
