import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { Booking } from 'src/app/models/booking.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboard implements OnInit {

bookings: Booking []

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
      console.log("in ts")

    // this.taskService.getLists().subscribe((lists: List[]) => {
    //     this.lists = lists;
    //   })
   
    this.adminService.getBookings().subscribe((bookings: Booking[] ) => {
        console.log("in seives")
        this.bookings = bookings
            console.log(bookings)
    }
    )

    console.log("in ts 2")


  }



  
}