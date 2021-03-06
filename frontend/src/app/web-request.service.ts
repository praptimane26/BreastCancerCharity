/*Devstackr. (2019, April 10). Building the API | NodeJS, Express and Mongoose—[3] Build a Task Manager w/ MEAN Stack. https://www.youtube.com/watch?v=P3R-8jj3S7U */
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL;

  constructor(private http:HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
   }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`)
  }

  post(uri: string, payload: object) {
    console.log(payload)
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
    

  }

  patch(uri: string, payload: object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/users/login`,{
      email,
      password
    }, { 
      observe: 'response'
       })
  }

  signup(email: string, password: string, role: string) {
    return this.http.post(`${this.ROOT_URL}/users`,{
      email,
      password,
      role
    }, { 
      observe: 'response'
       })
  }
}
