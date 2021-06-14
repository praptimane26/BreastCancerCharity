import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  onSignupButtonClicked(email: string, password: string, role: string) {
    console.log("attemping to sign up");
    this.authService.signup(email, password, role).subscribe((res: HttpResponse<any>)=> {
      console.log("I got something back from sign up");
      console.log(res);
    });
  }

}
