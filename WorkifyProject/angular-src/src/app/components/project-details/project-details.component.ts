import { Component, OnInit,NgZone } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  
  projectDetails:any;
  tasksOfProject:any;
  taskDetails:any;
  taskDesc:String;
  taskName:String='';
  taskID:any;
  assignee:any;
  taskDue:Date;
  flag: boolean;
  sub: any;
  id: any;//project id
  user: any;
  taskflag: boolean;
  taskDone: boolean;
owner:any;
  showModalCreate: boolean=false;
  showModalEdit: boolean=false;
  constructor(private zone:NgZone,private authService:AuthService, private router:Router,private flashMessage: FlashMessagesService,private _Activatedroute:ActivatedRoute) { }
  getTasks(){
    this.authService.getProjectTasks(this.id).subscribe(taskList => {
      this.tasksOfProject = taskList;
      console.log("task array"+this.tasksOfProject[0].assignee);
    }, 
    err => {
      console.log(err);
      return false;
    });
   }
  ngOnInit() {
    this.sub=this._Activatedroute.paramMap.subscribe(params => { 
       this.id = params.get('id'); 
       this.authService.getProjectDetails(this.id).subscribe(projectData => {
         this.projectDetails = projectData['task'];
         this.user = projectData['user'];
         if(this.user.email == this.projectDetails.owner.email){
           this.flag = true;
           console.log("hello")
         }else{
           this.flag = false;
         }
      }, 
       err => {
         console.log(err);
         return false;
       });
   });
   
    this.getTasks();
    this.showModalCreate=false;
    this.showModalEdit=false;
  }

  showCreateTask()
  {
    this.showModalCreate = true;
  }
  hideCreateTask()
  {
    this.showModalCreate = false;
  }
  showEditTask(task_id)
  {
    this.showModalEdit = true;
    this.taskID=task_id;
    this.authService.getTaskDetails(this.taskID).subscribe(taskData => {
    this.taskDetails = taskData;
    console.log( this.taskDetails);
  }, 
   err => {
     console.log(err);
     return false;
   });
    
  }
  hideEditTask()
  {
    this.showModalEdit = false;
  }
  months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  onCreateTask() {
    const task={
      project:this.projectDetails,
      taskName:this.taskName,
      taskDesc:this.taskDesc,
      taskDue:this.taskDue,
      assignee:this.assignee,
    }
    console.log(task);
      this.authService.createTask(task).subscribe(data => {
        if(data['success']) {
        this.getTasks();
          this.flashMessage.show('New task created', {cssClass: 'alert-success', timeout: 3000});
        } else {
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
        }
      });
     }

    
  onEditTask() {
    if(this.taskName == undefined){
      this.taskName = this.taskDetails.taskName
    }
    if(this.taskDesc == undefined){
      this.taskDesc = this.taskDetails.taskDesc
    }
    if(this.taskDue == undefined){
      console.log("hello")
      this.taskDue = this.taskDetails.taskDue
    }
    if(this.assignee == undefined){
      this.assignee = this.taskDetails.assignee
    }
  this.showModalEdit = false;
  if(this.taskDetails.assignee == this.assignee){
    this.flag = true;
  }
  const task={
    _id:this.taskID,
    project:this.projectDetails,
    taskName:this.taskName,
    assignee:this.assignee,
    taskDesc: this.taskDesc,
    taskDue: this.taskDue
  }
    this.authService.editTask(task).subscribe(data => {
      if(data['success']) {
        this.getTasks();
        this.flashMessage.show('Task updated successfully', {cssClass: 'alert-success', timeout: 3000});
      } else {
        this.flashMessage.show('Something went wrong!Try to edit task again', {cssClass: 'alert-danger', timeout: 3000});
      }
    });
    }

    onDeleteTask() {
      const pid= this.taskID;
      this.authService.deleteTask(pid).subscribe(data => {
        if(data['success']) {
          this.getTasks();
          this.flashMessage.show('Project deleted', {cssClass: 'alert-success', timeout: 3000});
        } else {
          this.flashMessage.show('You cannot delete this project.. You are not the owner', {cssClass: 'alert-danger', timeout: 3000});
        }
      });
    }

    onCheckTask(task_id){
      const task={
        _id: task_id,
        isDone: this.taskDone,
      }
        this.authService.checkTask(task).subscribe(data => {
          if(data['success']) {
            this.flashMessage.show('Task updated', {cssClass: 'alert-success', timeout: 3000});
            this.getTasks();
          } else {
            this.flashMessage.show('Something went wrong!Try to edit task again', {cssClass: 'alert-danger', timeout: 3000});
          }
        });
    }


}


// <!-- <div class="jumbotron text-center">
//   <h1>Workify App</h1>
//   <p class="lead">Welcome to WORKIFYY </p>
//   <div>
//     <a class="btn btn-primary" [routerLink]="['/register']">Register</a>
//     <a class="btn btn-dark" [routerLink]="['/login']">Login</a>
//   </div>
// </div> -->

// <script>
//   $(document).ready(function(){
//     $(".target").click(function(){
//        $(this).parent().siblings().removeClass("selectedClass");
//        $(this).parent().addClass("selectedClass");
//     });
//   });
// </script>

// <div *ngIf="projects!=null" class="main-content">
//   <h1 class="header">Your Projects</h1>
//   <button class="main-btn" (click) = "show()">Create another project</button>
//   <div class="modal-wrapper"></div>
//   <div class="projects-wrapper">
//     <!-- (click)="getProjectData(project._id)" -->
//     <div key={project._id} [routerLink]="['/projects',project._id]" class="project-icon" *ngFor="let project of projects">
//       <div class="project-name">{{project.name}}</div>
//       <div class="project-info-button">Edit project</div>
//       <div class="project-info-button">Go to project</div>
//       <!-- <a [routerLink]="['/projects',project._id]">details </a> -->
//     </div>
//   </div>
// </div>
// <div *ngIf="projects==null" class="main-content">
//   <div class="projects">
//     <div class="no-projects">
//       <h1 class="header">You have no projects</h1>
//       <button class="main-btn" (click) = "show()">
//         Create your first project
//       </button>
//       <div class="modal-wrapper">
//         <!-- <Modal onClose={this.toggleModal} modal={this.state.modal} /> -->
//       </div>
//     </div>
//   </div>
// </div>




// <!-- Create project Modal -->
// <div class="modal-wrapper">
//   <form class="modalPopup" (submit)="onCreateProject()" id="myModal" [style.display]="showModal ? 'block' : 'none'">
//     <span class="close-modal close" data-dismiss="modal" (click) = "hide()">×</span>
//     <h1 class="header">Create a project</h1>
//     <div class="form-group">
//       <label>
//         <div class="form-label">Project Name (required)</div>
//         <input id="projectName" name="projectName" [(ngModel)]="projectName" type="text" placeholder="My Awesome Project" class="form-input" value="">
//       </label>
//     </div>
//     <div class="form-label" >Add team members (optional)</div>
//     <button class="main-btn add-members" (click)="addMemberField()" ng-click="count = count + 1" ng-init="count=0">Add another member</button>
//     <!-- <div class="members showInputField" *ngFor="let member of members; let i = index" id="memberList"> -->
//       <div class="members showInputField"  id="memberList">
//       <div class="split" >
//         <label class="form-label" >Name{{i}} <input type="text" name="name"  [(ngModel)]="member.name" class="form-input m_email" value=""></label>
//         <label class="form-label" >Email{{i}} <input type="text" name="email" [(ngModel)]="member.email"  class="form-input m_name" value=""></label>
//         <span class="delete" onclick="removeMemberField()">REMOVE</span>
//       </div>
//     </div>
//     <div>
//       <button class="main-btn create-project" type="submit" value="Submit" >Create Project</button>
//     </div>
//   </form>
// </div>