import { Component, NgZone, HostListener, ViewChild } from '@angular/core';
import { AuthenticationService } from '@app/_services/authentication.service';
import { Router } from '@angular/router';
import { SpinnerService } from './_services/spinner.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  private isLoggedInPastState: any;

  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private ngZone: NgZone,
    private spinner: SpinnerService
  ) { 
    this.isLoggedInPastState = this.isLoggedIn();
    if (this.isLoggedInPastState) { 
      this.router.navigate(['']);
    }
    this.initInterval();
  }
  
  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        const isLoggedInActualState = this.isLoggedIn();
        this.ngZone.run(() => {
          if (isLoggedInActualState && isLoggedInActualState !== this.isLoggedInPastState) { 
            this.router.navigate(['']);
            this.isLoggedInPastState = isLoggedInActualState;
          }else if(!isLoggedInActualState && isLoggedInActualState !== this.isLoggedInPastState){
            this.router.navigate(['/login']);
            this.isLoggedInPastState = isLoggedInActualState;
          }
        });
      }, 1000);
    });
  }

  isLoggedIn(){
    return this.authenticationService.isLoggedIn();
  }

  @HostListener('document:keydown', ['$event'])   
  onKeydown(event: KeyboardEvent) {
    if(this.spinner.isSpinnerVisible()){
      event.preventDefault();
    }
  }
}
