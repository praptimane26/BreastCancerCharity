import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, empty, Subject, observable} from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  refreshingAccessToken: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();

  //accessTokenRefreshed: Subject<any> = new Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    //handle the request
    request = this.addAuthHeader(request);

    //call next() and handle response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse)=> {
        console.log(error);

        if(error.status === 401) {
          // 401 error so we are unauthorised

          //refresh the access token
         return this.refreshAccessToken()
          .pipe(
            switchMap(()=> {
              request = this.addAuthHeader(request);
              return next.handle(request)
            }),
            catchError((err: any)=> {
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )
        }

        return throwError(error);
      })
    )
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(()=> {
          //this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      } )
    } else {
      this.refreshingAccessToken = true;
      //
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          console.log("Access token Refreshed");
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next();
        })
      )
    }
  }

  addAuthHeader(request: HttpRequest<any>) {
    //get the access token
    const token = this.authService.getAccessToken();

    if (token) {
       //append the access token to the request header
        return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }

}
