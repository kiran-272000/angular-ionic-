import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, of } from "rxjs";
import { delay, map, switchMap, take, tap } from "rxjs/operators";


import { AuthService } from "../auth/auth.service";
import { Place } from "./place.model";



//dummy Data

// [
//   new Place(
//     "p1",
//     "Manhattan Mansion",
//     "In the heart of New York City.",
//     "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
//     149.99,
//     new Date("2020-01-01"),
//     new Date("2020-12-31"),
//     "abc"
//   ),
//   new Place(
//     "p2",
//     "L'Amour Toujours",
//     "A romantic place in Paris!",
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg",
//     189.99,
//     new Date("2020-01-01"),
//     new Date("2020-12-31"),
//     "abc"
//   ),
//   new Place(
//     "p3",
//     "The Foggy Palace",
//     "Not your average city trip!",
//     "https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg",
//     99.99,
//     new Date("2020-01-01"),
//     new Date("2020-12-31"),
//     "abc"
//   ),
// ]




interface PlaceData{
  title: string,
  description: string,
  imageUrl: string,
  price: number,
  userId: string,
  availableFrom: string,
  availableTo: string
}

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http:HttpClient) {}

  fetchPlaces(){
    return this.http.get<{[key:string]: PlaceData }>('https://ionic-angular-training-5bc1d-default-rtdb.firebaseio.com/offered-places.json')
    .pipe(map(res=>{
      const places=[];
      for( const key in res ){
        if(res.hasOwnProperty(key)){
          places.push(new Place(key , res[key].title, res[key].description, res[key].imageUrl, res[key].price, new Date(res[key].availableFrom), new Date(res[key].availableTo), res[key].userId))
      }
      }      
      return places;
    }),tap(places=> this._places.next(places)))
  }


  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {

    return this.http.get<PlaceData>(`https://ionic-angular-training-5bc1d-default-rtdb.firebaseio.com/offered-places/${id}.json`).pipe(map(res=>{
      return new Place(id,res.title,res.description,res.imageUrl,res.price,new Date(res.availableFrom),new Date(res.availableTo),res.userId)
    }),tap(place=>console.log(place)));
    
    // return this.places.pipe(
    //   take(1),

    //   map((places) => {
    //     return { ...places.find((p) => p.id === id) };
    //   })
    // );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg",
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );

    return this.http.post<{name: string}>('https://ionic-angular-training-5bc1d-default-rtdb.firebaseio.com/offered-places.json',{...newPlace,id:null}).pipe(
      switchMap(res=>{
        generatedId= res.name;
        return this.places;
      }),
      take(1),
      tap(places=>{
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    )

    // return this._places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap((places) => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(
    placeId: string,
    updatedTitle: string,
    updatedDescription: string
  ) {
    return this._places.pipe(
      take(1),
      switchMap((places) => {
        if(!places || places.length <=0){
          return this.fetchPlaces()
        }
        else{
          return of(places)
        }
      }),
      switchMap((places) => {
        const updatingPlaceId = places.findIndex(
          (place) => place.id === placeId
        );
        const oldPlace = places[updatingPlaceId];
        const updatedPlaces = [...places];
        updatedPlaces[updatingPlaceId] = new Place(
          oldPlace.id,
          updatedTitle,
          updatedDescription,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        // this._places.next(updatedPlaces);
        return this.http.put(`https://ionic-angular-training-5bc1d-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,{...updatedPlaces[updatingPlaceId], id:null}).pipe(tap(() => {this._places.next(updatedPlaces)}))
        })
    );
  }
}
