import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { GlobalFunction } from '../global-functions';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from '../constant.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  public searchTask: string;
  public nextPageUrl: string;
  public currentPage: number;
  public previousPageUrl: string;

  public usersList:any;

  // Models for Input fields
  nameValue: string;
  placeValue: string;

  paginationClickedCount = 0;

  disableNext = false;
  disablePrev = false;

  public userListPage = 1;

  constructor(private globalVar: GlobalVariable, private http: HttpClient, private globalFunc: GlobalFunction, private toastr: ToastrService, private spinner: NgxSpinnerService, private r: Router, private constant: ConstantService) {
    this.globalVar.currentPageURL = 'tasks';
  }

  ngOnInit() {
    this.userAuth();
    this.getUsersList('start');
  }

  async userAuth() {
    if(!this.isLoggedIn()) {
      this.globalFunc.showErrorToast(this.toastr, this.globalVar.internetError);
      await this.r.navigate(['/login']);
    } 
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  getUsersList(action) {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    if(action == 'next') {
        this.http.get<any>(this.nextPageUrl, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.usersList = res.user.data;
              this.nextPageUrl = res.user.next_page_url;
              this.previousPageUrl = res.user.prev_page_url;
              this.currentPage = res.user.current_page;
              if(this.nextPageUrl == null) 
                this.disableNext = true;
              else 
                this.disableNext = false;
              if(this.previousPageUrl == null) 
                this.disablePrev = true;
              else
                this.disablePrev = false;
              console.log(res.message);
            } else {
              console.log(res.message);
            }
          },
          error: error => {
            console.error(error);
          }
        });  
    } else if (action == 'prev') {
        this.http.get<any>(this.previousPageUrl, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.usersList = res.user.data;
              this.nextPageUrl = res.user.next_page_url;
              this.previousPageUrl = res.user.prev_page_url;
              this.currentPage = res.user.current_page;
              if(this.nextPageUrl == null) 
                this.disableNext = true;
              else 
                this.disableNext = false;
              if(this.previousPageUrl == null) 
                this.disablePrev = true;
              else
                this.disablePrev = false;
              console.log(res.message);
            } else {
              console.log(res.message);
            }
          },
          error: error => {
            console.error(error);
          }
        });
      } else { 
        this.http.get<any>(`${this.constant.baseUrl}api/admin/users`, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.usersList = res.user.data;
              this.nextPageUrl = res.user.next_page_url;
              this.previousPageUrl = res.user.prev_page_url;
              this.currentPage = res.user.current_page;
              if(this.nextPageUrl == null) 
                this.disableNext = true;
              else 
                this.disableNext = false;
              if(this.previousPageUrl == null) 
                this.disablePrev = true;
              else
                this.disablePrev = false;
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
  }

  viewUserTaskList(USER_ID: any) {
    this.globalVar.clickedUser = USER_ID;
    if (navigator.onLine) {
      this.r.navigateByUrl('tasks/view-task');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }
  
  search() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/search/user/${this.searchTask}`, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.usersList = res.user.data;
          this.nextPageUrl = res.user.next_page_url;
          this.previousPageUrl = res.user.prev_page_url;
          this.currentPage = res.user.current_page;
          if(this.nextPageUrl == null) 
            this.disableNext = true;
          else 
            this.disableNext = false;
          if(this.previousPageUrl == null) 
            this.disablePrev = true;
          else
            this.disablePrev = false;
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
}
