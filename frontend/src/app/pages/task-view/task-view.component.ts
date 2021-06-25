import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { RoleService } from 'src/app/role.service';
import { Booking } from 'src/app/models/booking.model';


import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-task-view', 
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  
})
export class TaskViewComponent implements OnInit {

  lists: List[];
  tasks: Task[];
  user: any;
  role: string;
  booking: Booking;

  selectedListId:string;
  closeResult = '';


  constructor(private modalService: NgbModal, private taskService: TaskService, private route: ActivatedRoute, private router: Router, private roleService: RoleService) { }

  ngOnInit(): void {
    this.user = this.roleService.getUser();
    this.role = this.roleService.getRole();
    this.route.params.subscribe (
      (params: Params) => {
        if (params.listId) {
          this.selectedListId = params.listId;
          this.taskService.getTasks(params.listId).subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          })
        } else {  
          this.tasks = undefined;
        }
     
    }
  )

    this.taskService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    })
  }

  onTaskClick(task: Task) {
    //setting the task to completed
    this.taskService.complete(task).subscribe(()=>{
      //the task set to completed successfully
      console.log("Completed successfully!");
      task.completed = !task.completed;
    });
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any)=> {
      this.router.navigate(['/lists'])
      console.log(res);
    })
  }

  onDeleteTaskClick(id:string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any)=> {
      this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }

  

  addBookings(name: string, email: string, subject: string, message: string) {
    this.taskService.addBooking(name, email,subject,message).subscribe((list: Booking) => {
      console.log(Booking);
    });
    
  }

  open(content) {
    //function get called....
    console.log("In for open")
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log("in for serv")
    }, (reason) => {
      console.log("reason")
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  logout(): void {
    this.roleService.signOut();
    window.location.reload();
  }

}
