import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { delay, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

import { Place } from "./place.model";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City.",
      "https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200",
      149.99,
      new Date("2020-01-01"),
      new Date("2020-12-31"),
      "abc"
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris!",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg",
      189.99,
      new Date("2020-01-01"),
      new Date("2020-12-31"),
      "abc"
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip!",
      "https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg",
      99.99,
      new Date("2020-01-01"),
      new Date("2020-12-31"),
      "abc"
    ),
  ]);

  constructor(private authService: AuthService) {}
  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
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

    return this._places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(
    placeId: string,
    updatedTitle: string,
    updatedDescription: string
  ) {
    return this._places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
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
        this._places.next(updatedPlaces);
      })
    );
  }
}
