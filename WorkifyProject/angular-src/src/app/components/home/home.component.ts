import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


declare var angular: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  myStyle:string
  projectName:String;
  teamMembers:Object;
  member:Object[];
  total:Number=1;
    memberName:any[]=[];
    memberEmail:any[]=[];
  projects:Object;
  // name:[];
  // email:[];

 
  //projectDetails:Object;

  constructor(
    private authService:AuthService,
     private router:Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    console.log("Itnit called");
    this.authService.getProjects().subscribe(projectData => {
      console.log(projectData);
       this.projects = projectData;
       console.log(projectData);
       this.hide();
    }, 
     err => {
      //  console.log(err);
       return false;
     });
 

  }

  showModal: boolean;
  content: string;
  title: string;

  //Bootstrap Modal Open event
  show()
  {
    this.showModal = true; // Show-Hide Modal Check
    this.content = "This is content!!"; // Dynamic Data
    this.title = "This is title!!";    // Dynamic Data
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }
  addMemberField(){ 
    let row = document.createElement('div'); 
      row.className = 'split'; 
      row.innerHTML = ` 
        <label class="form-label">Name<input type="text" [(ngModel)]="memberName" name="name" data-id="0" id="member-0" class="form-input" value=""></label>
        <label class="form-label split-email" for="email-0">Email<input type="text" [(ngModel)]="memberEmail" name="email" data-id="0" id="email-0" class="form-input" value=""></label>
        <span class="delete">REMOVE</span>
     `; 
   
      document.querySelector('.showInputField').appendChild(row); 
  }

  // removeMemberField($event){ 
  //   let e =$event.target;
  //   console.log(e);
  //   // let e=event.currentTarget || event.srcElement;
  //   let z=e.parent();
  //   console.log(z);
  // //  var x= document.getElementsByClassName('.m_email');
  // //   console.log(x);
  //     // document.querySelector('.showInputField').removeChild(ele); 
  // }
 
  onCreateProject() {
    const project={
      projectName:this.projectName,
      teamMembers:{
        name:this.memberName,
        email:this.memberEmail,
      } 
    }

    this.authService.createProject(project).subscribe(data => {
      console.log(data);
      if(data['success']) {
        this.flashMessage.show('New Project created', {cssClass: 'alert-success', timeout: 3000});
        // this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
        // this.router.navigate(['/register']);
      }
    });
    }


  


  // getProjectData(id){
  //   this.authService.getProjectDetails(id).subscribe(projectData => {
  //     console.log(projectData);
  //      this.projectDetails = projectData;
  //   }, 
  //    err => {
  //      console.log(err);
  //      return false;
  //    });
  // }
  // projects=[];
  // projects=[
  //   {name:"first project",
  //   owner:"sakshi",
  //   teamMembers:[{"email":"hiral@gmai.com","name":"hiral"}],
  // },
  // {name:"firsttt project",
  //   owner:"sakshi",
  //   teamMembers:[{"email":"hiral@gmai.com","name":"hiral"}],
  // },
  // {name:"firstyttt project",
  //   owner:"sakshi",
  //   teamMembers:[{"email":"hiral@gmai.com","name":"hiral"}],
  // }
//   {name:"firstyttt project",
//   owner:"hetvi",
//   teamMembers:[{"email":"hiral@gmai.com","name":"hiral"}],
// }
  // ];
  

  toggleModal(){
    console.log("toggle modal cliked");
  }
  createTask(){
    console.log("createTask cliked");
  }
  onClose(){
    console.log("onClose cliked");
  }
}
