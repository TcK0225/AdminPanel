import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from './global-variables';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalFunction } from './global-functions';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from './constant.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AdminPanel';

  constructor(public globalVar: GlobalVariable, private http: HttpClient, private constant: ConstantService, private router: Router, private spinner: NgxSpinnerService, private globalFunc: GlobalFunction, private toastr: ToastrService) {
    this.globalVar.currentPageURL = 'dashboard';
  }

  ngOnInit() {
    this.userAuth();
    this.sideNavbar();    
  }

  sideNavbar() {
    $(document).ready(() => {
      $(window).resize(() => {
        ($(window).width() < 992 && $('.sidebar').hasClass('active')) ? $('.sidebar').removeClass('active') : '';
      });

      $('nav .navbar-toggler').on('click', () => {
        $('.sidebar').hasClass('active') ? $('.sidebar').removeClass('active') : $('.sidebar').addClass('active');
      });

      $('.sidebar li').on('click', () => {
        $('.sidebar').removeClass('active');
      });
    });
  }

  logout() {
    if (navigator.onLine) {
      if (confirm('Log out?')) {
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('/login');
      }
    } else {
      this.globalFunc.showWarningToast(this.toastr, 'Please check your internet connection.');
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  async userAuth() {
    if(!this.isLoggedIn()) {
      /* this.globalFunc.showErrorToast(this.toastr, this.globalVar.internetError); */
      await this.router.navigate(['/login']);
    } else {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }
      this.http.get<any>(`${this.constant.baseUrl}api/user`, { headers}).subscribe((res) => {
        if (res !== null) {
          this.globalVar.authUserInfo = res['profile'];
          this.globalVar.loadSpinner = false;
          if (this.globalVar.authUserInfo.status === false || this.globalVar.authUserInfo.role !== 'ADMIN' && this.globalVar.authUserInfo.role !== 'ACCOUNTANT') {
            this.globalFunc.showErrorToast(this.toastr, 'Permission Denied.');
            this.globalVar.accountantRole = false;
            this.router.navigateByUrl('/login');
          } else if (this.globalVar.authUserInfo.role === 'ACCOUNTANT') {
            this.globalVar.accountantRole = true;
          } else {
            this.globalVar.accountantRole = false;
          }
        }
      },
      (error) => {
        if(error.status == 401) {          
          this.globalFunc.showErrorToast(this.toastr, "Access Token Expired. Please Login again.");
          localStorage.removeItem('access_token');
        } else {
          this.globalFunc.showErrorToast(this.toastr, error.message);
        }
        this.spinner.hide();
      });
    }
  }
}
