import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalVariable } from '../global-variables';
import { AngularFireAuth } from '@angular/fire/auth';
import { first, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalFunction } from '../global-functions';
import { Subject } from 'rxjs';
import { ConstantService } from '../constant.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SignInModel {
  EMAIL_ADDRESS: string;
  PASSWORD: string;
}

@Component({
  selector: 'app-sign-in-up',
  templateUrl: './sign-in-up.component.html',
  styleUrls: ['./sign-in-up.component.css']
})

export class SignInUpComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  public signInModelForm = {} as SignInModel;

  public ref: any;

  public userEmailAddress: string;

  constructor(private constant: ConstantService, private http:HttpClient, private globalVar: GlobalVariable, private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router, private spinner: NgxSpinnerService, private globalFunc: GlobalFunction, private toastr: ToastrService) {
    this.globalVar.currentPageURL = 'login';
    /* this.ref = afs.collection(globalVar.fireCol).doc(globalVar.fireDoc); */
  }

  ngOnInit() {
    /* this.userAuth(); */
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async userAuth() {
    if (!this.isLoggedIn()) {
      return;
    } else {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        });
        let options = { headers: headers };
        this.http.get<any>(`${this.constant.baseUrl}api/user`, options).subscribe((res) => {
          if (res !== null) {
            this.globalVar.authUserInfo = res['profile'];
            this.globalVar.loadSpinner = false;
            if (this.globalVar.authUserInfo.status === false || this.globalVar.authUserInfo.role !== 'ADMIN' && this.globalVar.authUserInfo.role !== 'ACCOUNTANT') {
              this.globalFunc.showErrorToast(this.toastr, 'Permission Denied.');
              this.globalVar.accountantRole = false;
              this.router.navigateByUrl('/login');
              this.clearInputs();
            } else if (this.globalVar.authUserInfo.role === 'ACCOUNTANT') {
              this.router.navigate(['/transactions']);
              this.clearInputs();
              this.globalVar.accountantRole = true;
            } else {
              this.globalVar.accountantRole = false;
              this.router.navigate(['/dashboard']);
              this.clearInputs();
            }
          }
          this.spinner.hide();
        },
        (error) => {
          this.globalFunc.showErrorToast(this.toastr, error.message);
          this.spinner.hide();
        });
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  async login() {
    if (navigator.onLine) {
      await this.spinner.show();
      this.http.post<any>(`${this.constant.baseUrl}api/acc/login`, {
          email:this.signInModelForm.EMAIL_ADDRESS,
          password:this.signInModelForm.PASSWORD
        }).subscribe((respObj) => {
          if(respObj['code'] == 200) {
            localStorage.setItem('access_token', respObj['data']['accessToken']);
            this.userAuth();
          } else {
            this.clearInputs();
            this.globalFunc.showErrorToast(this.toastr, respObj['message']);
          }
          this.spinner.hide();
        },
          err => {
          this.globalFunc.showErrorToast(this.toastr, err.message);
          this.spinner.hide();
        }
      );
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  forgotPassword() {
    if (navigator.onLine) {
      this.afAuth.auth.sendPasswordResetEmail(this.userEmailAddress).then(
        () => {
          this.globalFunc.showSuccessToast(this.toastr, 'A link had been sent to your email address to reset your password.');
        },
        (err) => this.globalFunc.showErrorToast(this.toastr, err.message)
      ).catch(
        (err) => this.globalFunc.showErrorToast(this.toastr, err.message)
      );
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  clearInputs() {
    this.signInModelForm.EMAIL_ADDRESS = '';
    this.signInModelForm.PASSWORD = '';
  }
}
