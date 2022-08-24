import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading=false;
  isLogin=true;


  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) {}

  ngOnInit() {}

  onLogin() {
    this.isLoading=true
    this.authService.login();
    this.loadingCtrl.create({keyboardClose: true, message:'Logging in...', spinner:'lines'}).then(loadingEl=>{
      loadingEl.present();
      setTimeout(()=>{
        loadingEl.dismiss()
        this.router.navigateByUrl('/places/tabs/discover');
        this.isLoading=false
      },1000)

    })
  }

  onSubmit(data: NgForm){
    if(!data.valid){
      return
    }
    const email= data.value.email;
    const password= data.value.password;
    console.log(email, password);
    
  }

  switchAuthMode(){
    this.isLogin=!this.isLogin
  }
}
