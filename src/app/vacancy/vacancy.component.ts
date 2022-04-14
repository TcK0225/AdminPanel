import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../constant.service';
import { GlobalFunction } from '../global-functions';
import { GlobalVariable } from '../global-variables';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css']
})
export class VacancyComponent implements OnInit {

  public vacancyList : any;
  public vacancyDetailsFilter : string;
  public nextPageUrl: string;
  public previousPageUrl: string;
  public currentPage: number;
  disableNext = false;
  disablePrev = false;

  constructor(private globalVar: GlobalVariable, private constant: ConstantService, private http: HttpClient, private toastr: ToastrService, private globalFunc: GlobalFunction, private router: Router) {
    this.globalVar.currentPageURL = 'vac';
  }

  ngOnInit(): void {
    this.userAuth();
    this.getVacancy('start');
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

  getVacancy(action) {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    if(action == 'next') {
      this.http.get<any>(this.nextPageUrl, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.vacancyList = res.vac.data;
            this.nextPageUrl = res.vac.next_page_url;
            this.previousPageUrl = res.vac.prev_page_url;
            this.currentPage = res.vac.current_page;
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
            this.vacancyList = res.vac.data;
            this.nextPageUrl = res.vac.next_page_url;
            this.previousPageUrl = res.vac.prev_page_url;
            this.currentPage = res.vac.current_page;
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
      this.http.get<any>(`${this.constant.baseUrl}api/admin/vac`, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.vacancyList = res.vac.data;
            this.nextPageUrl = res.vac.next_page_url;
            this.previousPageUrl = res.vac.prev_page_url;
            this.currentPage = res.vac.current_page;
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

  viewVacDetails(id) {
    this.globalVar.clickedVac = id;
    if (navigator.onLine) {
      this.router.navigateByUrl('vac/view-edit-vac');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  search() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/search/vac/${this.vacancyDetailsFilter}`, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.vacancyList = res.vac.data;
          this.nextPageUrl = res.vac.next_page_url;
          this.previousPageUrl = res.vac.prev_page_url;
          this.currentPage = res.vac.current_page;
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
