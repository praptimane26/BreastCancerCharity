import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
// import { Bookings } from './models/booking.model';



@Injectable({
    providedIn: 'root'
  })
  export class AdminService {
  
    constructor(private webReqService: WebRequestService) { }
  
    getBookings() {
        console.log("get booking service")
      return this.webReqService.get('bookings');
    }
  }