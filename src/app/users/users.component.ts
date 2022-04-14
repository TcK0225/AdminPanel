import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject ,Observer} from 'rxjs';
import { GlobalFunction } from '../global-functions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { stringify } from 'querystring';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from '../constant.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})

export class UsersComponent implements OnInit {

  public ref: any;

  public comments: Observable<any[]>;
  public nextPageUrl: string;
  public currentPage: number;
  public previousPageUrl: string;

  public searchUserString: string;

  public usersList: any;

  // Models for Input fields
  nameValue: string;
  placeValue: string;

  // Data object for listing items
  // usersList: any[] = [];

  // Save first document in snapshot of items received
  firstInResponse: any = [];

  // Save last document in snapshot of items received
  lastInResponse: any = [];

  // Keep the array of first document of previous pages
  prevStrtAt: any = [];

  // Maintain the count of clicks on Next Prev button
  paginationClickedCount = 0;

  // Disable next and prev buttons
  disableNext = false;
  disablePrev = false;

  public userListPage = 1;

  constructor(private http:HttpClient,private globalVar: GlobalVariable, private constant: ConstantService, private globalFunc: GlobalFunction, private toastr: ToastrService, private router: Router) {
    this.globalVar.currentPageURL = 'users';
  }

  ngOnInit() {
    this.userAuth();
    this.getUsersList('start');
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

  viewUserDetails(user: any) {
    this.globalVar.clickedUser = user.id;
    if (navigator.onLine) {
      this.router.navigateByUrl('users/view-edit-user');
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

  // Add document
  push_prev_startAt(prevFirstDoc) {
    this.prevStrtAt.push(prevFirstDoc);
  }

  // Remove not required document
  pop_prev_startAt(prevFirstDoc) {
    this.prevStrtAt.forEach(element => {
      if (prevFirstDoc.data().id === element.data().id) {
        element = null;
      }
    });
  }

  // Return the Doc rem where previous page will startAt
  get_prev_startAt() {
    if (this.prevStrtAt.length > (this.paginationClickedCount + 1)) {
      this.prevStrtAt.splice(this.prevStrtAt.length - 2, this.prevStrtAt.length - 1);
    }
    return this.prevStrtAt[this.paginationClickedCount - 1];
  }

  exportUsers(): void 
  {
    var userdata = new Array();
    var companydata = new Array();
    var users, companies;
    this.ref.collection('REGISTERED_USERS').get().subscribe(resp => {
      resp.forEach(async element => {
        //console.log(element.data()['PROFILE_IMAGE_URL']);
        //this.getImage(element.data()['PROFILE_IMAGE_URL']);
        userdata.push(element.data());
      });
      users = JSON.stringify(userdata);
          //this.getImage("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F300685712592824046%2F&psig=AOvVaw0GYyOZ6LZATWqtUQ3S0NlB&ust=1606899278367000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIiD-7i0rO0CFQAAAAAdAAAAABAD");
      this.http.post<any>('http://192.168.1.8:8000/api/migrate/users',{users:users}).subscribe((respObj) => {
          console.log(respObj);
      });
    });

    /* this.ref.collection('REGISTERED_COMPANIES').get().subscribe(resp => {
      resp.forEach(async element => {
        console.log(element.data());
        companydata.push(element.data());
      });
      companies = JSON.stringify(companydata);
      this.http.post<any>('http://v2.jobsit.com.my/api/migrate/users',{companies:companies}).subscribe((respObj) => {
          console.log(respObj);
      });
    }); */
  }

  public base64TrimmedURL: string;
  public base64DefaultURL: string;

  getImage(imageUrl: string) {
    this.getBase64ImageFromURL(imageUrl).subscribe((base64Data: string) => {
      this.base64TrimmedURL = base64Data;
    });
  }

  getBase64ImageFromURL(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement): string {
    // We create a HTML canvas object that will create a 2d image
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    let dataURL: string = canvas.toDataURL("image/png");
    this.base64DefaultURL = dataURL;
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  search() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/search/user/${this.searchUserString}`, { headers }).subscribe({
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
