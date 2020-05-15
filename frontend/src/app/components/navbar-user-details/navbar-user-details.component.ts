import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { AuthenticationService } from '@app/_services/authentication.service';
import { interval, of } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-user-details',
  templateUrl: './navbar-user-details.component.html',
  styleUrls: ['./navbar-user-details.component.css']
})

export class NavbarUserDetailsComponent implements OnInit {

  currentUserFullName: string;
  timeLeft: number;
  intervalId: any;
  isViewReady: any;

  constructor(
    private authenticationService: AuthenticationService, 
    private ngZone: NgZone
  ) { 
    this.initInterval();
  }

  ngOnInit(): void { 
    this.currentUserFullName = this.authenticationService.getCurrentUser().fullName;
  }

  initInterval() {
    interval(1000).pipe(
      takeWhile(() => this.authenticationService.isLoggedIn()),
      switchMap(() => {
        const diff = (this.authenticationService.getTokenExpirationDateTime() - Date.now())/1000;
          if(diff < 0) {
            return of(true);
          }
          this.timeLeft = diff;
          return of(false);
      })
    ).subscribe((isExpired) => {
      if(isExpired) this.authenticationService.logout().subscribe(() => {}, 
        error => {
          alert("Sikertelen kijelentkezés!")
        });
    })   
  }

  isTimeLeftIndicatorReady(){
    if(this.timeLeft){
      return !Number.isNaN(this.timeLeft);
    }
    return false;
  }
}
