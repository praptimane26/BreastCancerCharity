import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/role.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private roleService: RoleService) { }

  ngOnInit(): void {
  }

  onLoginButtonClicked(email: string, password: string) {
    this.authService.login(email, password).subscribe((res: HttpResponse<any>)=> {
      if (res.status === 200){
          //we have logged in successfully
          console.log(res.body);
          this.roleService.saveRole(res.body.role);
          this.roleService.saveUser(res.body);
          this.router.navigate(['/lists']);
      }
      console.log(res);
    });
  }

  logout(): void {
    this.roleService.signOut();
    window.location.reload();
  }

}
