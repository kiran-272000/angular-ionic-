import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { delay, map, switchMap, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { PlacesPage } from "../places/places.page";
import { Booking } from "./booking.model";


interface BoookingDetails{
  
BookedTo: string,
bookedFrom:string,
firstName:string,
guestNumber: number,
lastName: string,
placeId: string,
placeImage:string,
placeTitle:string,
userId:string,

}

@Injectable({ providedIn: "root" })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchBookings(){
    return this.http.get<{[key:string]: BoookingDetails}>(`https://ionic-angular-training-5bc1d-default-rtdb.firebaseio.com/booked-places.json?orderBy="userId"&equalTo="${this.authService.userId}"`).pipe(
      map(res=>{
        const bookings=[]
        for(const key in res){
          if(res.hasOwnProperty(key)){
            bookings.push(new Booking(key, res[key].placeId, res[key].userId, res[key].placeTitle, res[key].placeImage,res[key].firstName, res[key].lastName, res[key].guestNumber,new Date( res[key].bookedFrom), new Date(res[key].BookedTo)))
          }
        }
        return bookings;
      }), tap(bookings=> this._bookings.next(bookings))
    )
  }

  createBooking(
    placeId: string,
    placeTitle: string,
    placeImg: string,
    firstName: string,
    lastName: string,
    guests: number,
    dateFrom: string,
    dateTo: string
  ) {
    let generatedId:string;
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImg,
      firstName,
      lastName,
      guests,
      new Date(dateFrom),
      new Date(dateTo)
    );

    return this.http.post<{name: string}>('https://ionic-angular-training-5bc1d-default-rtdb.firebaseio.com/booked-places.json',{...newBooking,id:null}).pipe(switchMap(res=>{generatedId= res.name ;return this.bookings}),take(1),tap(bookings =>{newBooking.id= generatedId; this._bookings.next(bookings.concat(newBooking))}))
  }


  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      switchMap((bookings) => {
        this._bookings.next(
          bookings.filter((booking) => booking.id !== bookingId)
        );
        return this.http.delete(`https://ionic-angular-training-5bc1d-default-rtdb.firebaseio.com/booked-places/${bookingId}.json`)
      })
    );
  }
}
