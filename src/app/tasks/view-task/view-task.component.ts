import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalVariable } from '../../global-variables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalFunction } from '../../global-functions';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/constant.service';

interface FindJobModal {
  id: number;
  type: string;
  job_id: string;
  title: string;
  address: string;
  available_start_time: any;
  available_end_time: any;
  created_by: string;  // USER_ID
  created_date: any;
  hire_status: boolean;
  job_type: string;
  other_details: string;
  salary_per_hour: number;
  city: string;
  state: string;
  status: boolean;
  image_url: string;
  updated_at: any;
}

interface RequestEmployeesModal {
  id: number;
  type: string;
  job_id: string;
  title: string;
  job_start_time: any;
  job_end_time: any;
  created_by: string;
  created_date: any;
  job_type: string;
  other_details: string;
  salary_per_hour: number;
  address: string;
  city: string;
  state: string;
  status: boolean;
  image_url: string;
  access_job: any;
  num_of_hires: number;
  postcode: string;
  updated_at: any;
}

interface HiredBy {
  ADDRESS: string;
  APPROVED: boolean;
  EMAIL: string;
  END_TIME: any;
  GIVE_REVIEW_BY_EMPLOYER: boolean;
  GIVE_REVIEW_TO_EMPLOYER: boolean;
  NAME: string;
  PAID_AMOUNT: number;
  PAID_DATETIME: any;
  PAID_STATUS: string;
  PROFILE_IMAGE_URL: string;
  START_TIME: any;
  STATUS: string;
  USER_ID: string;
  DOC_ID: string;
}

interface RequestedBy {
  EMAIL: string;
  END_TIME: any;
  GIVE_REVIEW_BY_EMPLOYER: boolean;
  GIVE_REVIEW_TO_EMPLOYER: boolean;
  NAME: string;
  PAID_AMOUNT: number;
  PAID_DATETIME: any;
  PAID_STATUS: string;
  PROFILE_IMAGE_URL: string;
  START_TIME: any;
  STATUS: string;
  USER_ID: string;
  DOC_ID: string;
}

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})

export class ViewTaskComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  public tasks: any;
  public creator: any;

  private viewFindJobModal = {} as FindJobModal;
  private viewRequestEmployeesModal = {} as RequestEmployeesModal;

  private viewHList: any;
  private viewRList: any;

  private selectedUser: string;
  public selectedTaskType: string;
  private selectedTaskID: string;
  private vfjAST: string;
  private vfjASTDate: string;
  private vfjASTTime: string;
  private vreFST: string;
  public selectedTask: string;
  private selectTaskPostID: number;
  private paymentExist = 0;

  public viewDetailsStatus = false;

  constructor(private globalVar: GlobalVariable, private http: HttpClient, private toastr: ToastrService, private spinner: NgxSpinnerService, private globalFunc: GlobalFunction, private router: Router, private constant: ConstantService) {
    this.globalVar.currentPageURL = 'tasks/view-task';
  }

  ngOnInit() {
    this.userAuth();
    this.selectedUser = this.globalVar.clickedUser;
    this.globalVar.clickedUser = '';
    this.selectedTaskType = '';
    this.getSelectedUserTask();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async userAuth() {
    if(!this.isLoggedIn()) {
      this.globalFunc.showErrorToast(this.toastr, this.globalVar.internetError);
      await this.router.navigate(['/login']);
    } 
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  getSelectedUserTask() {
    if (this.selectedUser === '') {
      this.globalFunc.showErrorToast(this.toastr, 'Please select a user to continue.');
      this.goBack();
    } else {
      this.viewUserTasks();
    }
  }

  goBack() {
    if (navigator.onLine) {
      this.router.navigateByUrl('/tasks');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  getDuration(): string {
    if (this.viewRequestEmployeesModal.job_start_time !== undefined) {
      const JST = new Date(this.viewRequestEmployeesModal.job_start_time);
      const JET = new Date(this.viewRequestEmployeesModal.job_end_time);
      const duration = JET.getTime() - JST.getTime();

      let seconds = duration / 1000;
      const hours = seconds / 3600;
      seconds = seconds % 3600;
      const minutes = seconds / 60;

      return hours + ' h ' + minutes + ' m ';
    }
  }

  timestampToDate(type) {
    if (type === 'FIND-JOB') {
      const date = this.viewFindJobModal.available_start_time.slice(0, 10).replace(/-/g, '/').toString();
      const time = this.viewFindJobModal.available_end_time.toLocaleTimeString();
      this.vfjAST = date + ' ' + time;
      this.vfjASTDate = date;
      this.vfjASTTime = time;
    } else {
      const date = this.viewRequestEmployeesModal.job_start_time.toJSON().slice(0, 10).replace(/-/g, '/').toString();
      const time = this.viewRequestEmployeesModal.job_start_time.toLocaleTimeString();
      this.vreFST = date;
    }
  }

  viewUserTasks() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/task/${this.selectedUser}`, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.tasks = [];
          res.tasks.forEach(element => {
            if(element.postinfo.created_by != this.selectedUser)
              this.tasks.push(element);
          });
          console.log(res.message);
        } else {
          console.log(res.message);
        }
      },
      error: error => {
        console.error(error);
      }
    });           
  }

  viewDetails(task: any) {
    this.selectTaskPostID = Number(task.postinfo.id);
    this.viewDetailsStatus = true;
    this.selectedTask = task.postinfo.title;
    this.selectedTaskID = task.id;
    this.getCreator(task.postinfo.created_by); 
    
      if (task.postinfo.type === 'FIND-JOB') {
        this.viewFindJobModal = task.postinfo;
        this.viewHList = [];
          this.viewHList.push(task.hired_by);
      } else {
        this.viewRequestEmployeesModal = task.postinfo;
       /*  if(task.postinfo.created_by == this.selectedUser) {
          this.viewRList = task.request_by; 
        } else { */
          this.viewRList = [];
          task.request_by.forEach(element => {
            if(element.user_id == this.selectedUser) 
              this.viewRList.push(element);
          });/* 
        } */
          
      }
      this.selectedTaskType = task.postinfo.type;
  }

  async deleteTask(doc: any, type: string) {
    if (navigator.onLine) {
      if (confirm('Confirm deleting this task from user?')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        var body;
        if (type === 'FIND-JOB') {          
          body = { table: 'hired', task_id: this.selectedTaskID,  job_id: doc.id, post_id: this.selectTaskPostID, user_id: this.selectedUser };
        } else {
          body = { table: 'requested', task_id: this.selectedTaskID, job_id: doc.id, post_id: this.selectTaskPostID, user_id: this.selectedUser };
        }
          this.http.post<any>(`${this.constant.baseUrl}api/admin/del-task`, body, { headers }).subscribe({
            next: data => {
              var res = data.data;
              if (res.success === 1) {
                this.globalFunc.showSuccessToast(this.toastr, 'Task deleted.');
                this.getSelectedUserTask();
                this.spinner.hide();
                this.viewDetailsStatus = false;
                this.selectedTask = '';
                this.selectedTaskID = '';
              } else {
              }
            },
            error: error => {
              console.error(error);
            }
          });
      }
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  getCreator(uid) : any {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/user/${uid}`, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.creator = res;
        } else {
        }
      },
      error: error => {
        console.error(error);
      }
    });
}
}
