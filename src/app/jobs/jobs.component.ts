import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { Subject } from 'rxjs';
import { GlobalFunction } from '../global-functions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, takeUntil } from 'rxjs/operators';
import { ConstantService } from '../constant.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})

export class JobsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  public publicPosts: any[];
  public jobDetailsFilter: any = '';
  public nextPageUrl: string;
  public previousPageUrl: string;
  public currentPage: number;
  disableNext = false;
  disablePrev = false;

  public jobsListPage = 1;

  constructor(private globalVar: GlobalVariable, private constant: ConstantService, private http: HttpClient, private toastr: ToastrService, private globalFunc: GlobalFunction, private router: Router, private afAuth: AngularFireAuth) {
    this.globalVar.currentPageURL = 'jobs';
  }

  ngOnInit() {
    this.userAuth();
    this.getPosts('start');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getPosts(action) {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    if(action == 'next') {
      this.http.get<any>(this.nextPageUrl, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.publicPosts = res.post.data;
            this.nextPageUrl = res.post.next_page_url;
            this.previousPageUrl = res.post.prev_page_url;
            this.currentPage = res.post.current_page;
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
            this.publicPosts = res.post.data;
            this.nextPageUrl = res.post.next_page_url;
            this.previousPageUrl = res.post.prev_page_url;
            this.currentPage = res.post.current_page;
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
      this.http.get<any>(`${this.constant.baseUrl}api/admin/post`, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.publicPosts = res.post.data;
            this.nextPageUrl = res.post.next_page_url;
            this.previousPageUrl = res.post.prev_page_url;
            this.currentPage = res.post.current_page;
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

  convertNumToString(num: number): string {
    return num.toString();
  }

  viewPostDetails(id) {
    this.globalVar.clickedPost = id;
    if (navigator.onLine) {
      this.router.navigateByUrl('jobs/view-edit-job');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
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

  search() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/search/post/${this.jobDetailsFilter}`, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.publicPosts = res.post.data;
          this.nextPageUrl = res.post.next_page_url;
          this.previousPageUrl = res.post.prev_page_url;
          this.currentPage = res.post.current_page;
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
