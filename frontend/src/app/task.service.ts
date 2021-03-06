/*Devstackr. (2019, April 10). Building the API | NodeJS, Express and Mongoose—[3] Build a Task Manager w/ MEAN Stack. https://www.youtube.com/watch?v=P3R-8jj3S7U */
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  getLists() {
    return this.webReqService.get('lists');
  }

  addBooking(name: string, email: string, subject: string, message: string){
    var payload = {
      name: name,
      email :email,
      subject: subject,
      message: message
    }

    console.log("add booking service need a modal", payload)
    return this.webReqService.post('bookings', { payload });
    
  }

  createList(title: string) {
    //we want to send a web request to create a list
    return this.webReqService.post('lists', { title });
  }

  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${id}`, { title });
  }

  deleteList(id: string) {
    //we want to send a web request to delete list
    return this.webReqService.delete(`lists/${id}`);
  }

  updateTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, { title });
  }

  getTasks(listId: string) {
    return this.webReqService.get(`lists/${ listId }/tasks`);
  }

  //we want to send a web request to create a task
  createTask(title: string, listId: string) {
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }

  
  deleteTask(listId: string, taskId: string) {
    //we want to send a web request to delete task
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }


  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listid}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
