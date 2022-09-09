import { Component, OnDestroy, OnInit } from "@angular/core";
import { IonItemSliding, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Booking } from "./booking.model";
import { BookingService } from "./booking.service";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.page.html",
  styleUrls: ["./bookings.page.scss"],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  isLoading: boolean = false;
  private bookingSub: Subscription;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }


  ionViewWillEnter(){
    this.isLoading=true
    this.loadingCtrl.create({ message: 'Loading...'}).then(loadingEl=>{
      loadingEl.present()
      this.bookingService.fetchBookings().subscribe(()=>{loadingEl.dismiss(); this.isLoading=false})
    })
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({ message: "Cancelling" }).then((loadingEl) => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe((bookings) => {
        loadingEl.dismiss();
      });
    });
  }
}
