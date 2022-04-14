import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalFunction } from '../global-functions';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {formatNumber} from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantService } from '../constant.service';

interface UserModel {
  USER_ID: string;
  FULL_NAME: string;
  GENDER: string;
  NRIC: string;
  DATE_OF_BIRTH: string;
  CONTACT_NO: string;
  CITY: string;
  STATE: string;
  COUNTRY: string;
  EMAIL: string;
  BANK_ACC: string;
  BANK_NAME: string;
  BENEFICIARY: string;
  EXPERTISE_IN: string;
  COMPANY_EXIST: boolean;
  CONTACT_CITY_CODE: string;
  DEVICE_TOKEN: string;
  PROFILE_IMAGE_LOC_PATH: string;
  PROFILE_IMAGE_URL: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  // Jobs
  public totalJobs: number;
  public totalCurrentJobs: number;
  public totalExpiredJobs: number;
  // User
  public totalUsers: number;
  public totalActiveUsers: number;
  public totalBannedUsers: number;
  // Transaction Segment 1
  public totalTransactions: number;
  public totalTransactionsAmount: number;  
  public overallReceivedTransactions: number;
  public overallPaidTransactions: number;
  public overallReceivedAmount: number;
  public overallPaidAmount: number;
  public overallEarnTransactions: number;
  public overallEarnAmount: number;
  // Transaction Segment 2
  public totalTransactions2: number;
  public totalTransactionsAmount2: number;  
  // Transaction Segment 3
  public totalTransactions3: number;
  public totalTransactionsAmount3: number;  
  // Tasks
  public totalTasks: number;
  public totalPaidTasks: number;
  public totalDoneTasks: number; 
  // Ads
  public totalAdvertise: number;
  public activeAds:number;
  public expiredAds:number;
  // Vacancy
  public totalVacancy: number;
  public activeVac:number;
  public deactiveVac:number;

  public data: any;

  public loadingSpinner = true;

  public viewUserModal = {} as UserModel;
  public user: any;
  public expList: string;

  constructor(private http:HttpClient, private constant: ConstantService, private globalVar: GlobalVariable, private afs: AngularFirestore, private toastr: ToastrService, private spinner: NgxSpinnerService, private globalFunc: GlobalFunction, private router: Router, private afAuth: AngularFireAuth) {
    this.globalVar.currentPageURL = 'dashboard';
  }

  ngOnInit() {
    this.userAuth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async userAuth() {
    if(!this.isLoggedIn()) {
      this.globalFunc.showErrorToast(this.toastr, this.globalVar.loggingError);
      await this.router.navigate(['/login']);
    } else {
      this.getCurrentUserDetails();
      this.getTotalJobs();
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  getCurrentUserDetails() {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      });
      let options = { headers: headers };
      this.http.get<any>(`${this.constant.baseUrl}api/user`, options).subscribe((res) => {
        if (res !== null) {
            this.globalVar.authUserInfo = res['profile'];
            this.user = res['profile'];
            this.expList = res['expList'];
        }
      this.globalVar.loadSpinner = false;
    });
  }

  getTotalJobs() {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      });
      let options = { headers: headers };
      this.http.get<any>(`${this.constant.baseUrl}api/dashboard`, options).subscribe((resp) => {
      this.data = resp['data'];
      this.totalJobs = resp['data']['posts'];
      this.totalCurrentJobs = resp['data']['currentJob'];
      this.totalExpiredJobs = resp['data']['expiredJob'];

      this.totalTasks = resp['data']['totalTasks'];
      this.totalDoneTasks = resp['data']['doneTasks'];
      this.totalPaidTasks = resp['data']['paidTasks'];

      this.totalUsers = resp['data']['totalUsers'];
      this.totalActiveUsers = resp['data']['activeUsers'];
      this.totalBannedUsers = resp['data']['bannedUsers'];

      this.totalTransactionsAmount = resp['data']['totalTransactions'];
      this.totalTransactions = resp['data']['countTransaction'];
      this.overallEarnAmount = resp['data']['overallEarned'];
      this.overallPaidAmount = resp['data']['overallPaid'];
      this.overallReceivedAmount = resp['data']['overallReceived'];
      this.overallEarnTransactions = resp['data']['countEarnedPaid'];
      this.overallPaidTransactions = resp['data']['countEarnedPaid'];
      this.overallReceivedTransactions = resp['data']['countReceived'];

      this.totalTransactionsAmount2 = resp['data']['totalTransactions2'];
      this.totalTransactions2 = resp['data']['countTransaction2'];

      this.totalAdvertise = resp['data']['totalAdvertise'];
      this.activeAds = resp['data']['activeAdvertise'];
      this.expiredAds = resp['data']['expiredAdvertise'];

      this.totalTransactionsAmount3 = resp['data']['totalTransactions3'];
      this.totalTransactions3 = resp['data']['countTransaction3'];

      this.totalVacancy = resp['data']['totalVacancy'];
      this.activeVac = resp['data']['activeVacancy'];
      this.deactiveVac = resp['data']['deactiveVacancy'];
    },
    (error) => {
      console.log(error);
    },
    () => {
      this.loadingSpinner = false;
    });
  }
}
