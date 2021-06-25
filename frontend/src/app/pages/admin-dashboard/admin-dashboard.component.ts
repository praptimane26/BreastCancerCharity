import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { Booking } from 'src/app/models/booking.model';
import { List } from 'src/app/models/list.model';
import { TaskService } from 'src/app/task.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboard implements OnInit {

bookings: Booking []
lists: List[];

  constructor(private adminService: AdminService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.adminService.getBookings().subscribe((bookings: Booking[] ) => {
        this.bookings = bookings;
            console.log(bookings)});
  }
}