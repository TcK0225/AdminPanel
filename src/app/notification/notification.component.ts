import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalFunction } from '../global-functions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from '../constant.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public messageTitle = '';
  public messageContent = '';

  public ref: any;

  constructor(private globalVar: GlobalVariable, private http: HttpClient, private spinner: NgxSpinnerService,
    private globalFunc: GlobalFunction, private toastr: ToastrService, private router: Router, private constant: ConstantService) {
    this.globalVar.currentPageURL = 'notification';
  }

  ngOnInit() {
    if (this.globalVar.authUserInfo.role != 'ADMIN' && !this.globalVar.accountantRole) {
      if (navigator.onLine) {
        this.globalFunc.showWarningToast(this.toastr, 'You do not have enough privilege to perform this action.');
        this.router.navigateByUrl('/dashboard');
      } else {
        this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
      }
    } else {
      this.spinner.hide();
    }
  }

  sendNotification() {
    this.spinner.show();
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    const body = { TITLE: this.messageTitle,
      BODY: this.messageContent,
      TOPIC: '/topics/JOBS_IT_TOPIC_ALL', };
    this.http.post<any>(`${this.constant.baseUrl}api/admin/push-notification`, body, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.messageTitle = '';
          this.messageContent = '';
          this.spinner.hide();
          this.globalFunc.showSuccessToast(this.toastr, 'Notification sent.');
          console.log(res.message);
        } else {          
          this.spinner.hide();
          console.log(res.message);
        }
      },
      error: error => {
        console.error(error);        
        this.spinner.hide();
      }
    });
  }
}
