import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { interval, of, Subscription } from "rxjs";
import {
  delay,
  filter,
  take,
  tap,
  mergeMap,
  concatMap,
  switchMap,
  exhaustMap,
} from "rxjs/operators";

import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";

@Component({
  selector: "app-offer-bookings",
  templateUrl: "./offer-bookings.page.html",
  styleUrls: ["./offer-bookings.page.scss"],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/offers");
        return;
      }
      this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe((place) => {
          this.place = place;
        });
    });

    // let postIds = interval(1).pipe(
    //   filter((val) => val > 0),
    //   take(10)
    // );

    // postIds
    //   .pipe(
    //     // delay(1000),
    //     // tap((t) => {
    //     //   console.log(t + "hi");
    //     // }),
    //     // filter((val) => val % 2 === 1),
    //     // take(5),
    //     // delay(500)
    //     switchMap((id) => {
    //       return this.http.get(
    //         `http://jsonplaceholder.typicode.com/posts/${id}`
    //       );
    //     })
    //   )
    //   .subscribe((res) => {
    //     // console.log(res);
    //   });
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
