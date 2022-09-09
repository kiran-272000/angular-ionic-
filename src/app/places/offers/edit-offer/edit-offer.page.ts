import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, LoadingController, NavController } from "@ionic/angular";

import { PlacesService } from "../../places.service";
import { Place } from "../../place.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-edit-offer",
  templateUrl: "./edit-offer.page.html",
  styleUrls: ["./edit-offer.page.scss"],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  isLoading : boolean = false;
  placeId: string
  private placeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/offers");
        return;
      }
      this.placeId= paramMap.get('placeId')
      this.isLoading=true
      this.loadingCtrl.create({message:'Loading...'}).then(loadingEl=>{
        loadingEl.present()
        this.placeSub = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe((place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: "blur",
              validators: [Validators.required, Validators.max(10)],
            }),
            description: new FormControl(this.place.description, {
              updateOn: "blur",
              validators: [Validators.required, Validators.max(120)],
            }),
          });
          loadingEl.dismiss()
        this.isLoading=false
          
        },error=>{
          loadingEl.dismiss()
        this.isLoading=false

          this.alertCtrl.create({header: 'An error occured!', message: 'Place could not be fetched try again later.',buttons :[{text:'OK',handler:()=>{this.router.navigate(['/places/tabs/offers'])}}]}).then(alertEl=>{alertEl.present();})
        });
      })
      
    });
  }

  ngOnDestroy() {
    if (this.placeSub) this.placeSub.unsubscribe();
  }

  onEdit() {
    if (
      this.form.valid &&
      (this.form.value.title !== this.place.title ||
        this.form.value.description !== this.place.description)
    ) {
      this.loadingCtrl
        .create({
          message: "Updating Place",
        })
        .then((loadingEl) => {
          loadingEl.present();
          this.placesService
            .updatePlace(
              this.place.id,
              this.form.value.title,
              this.form.value.description
            )
            .subscribe(() => {
              loadingEl.dismiss();
              this.form.reset();
              this.router.navigate(["/places/tabs/offers"]);
            });
        });
    } else {
      return;
    }
  }
}
