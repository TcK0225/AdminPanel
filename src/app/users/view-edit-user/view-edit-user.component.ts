import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { GlobalVariable } from '../../global-variables';
import { GlobalFunction } from '../../global-functions';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as stateCityList from '../../../assets/country/malaysia.json';
import * as banksList from '../../../assets/config/banks.json';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from 'src/app/constant.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

declare var $: any;

interface UserModel {
  id: string;
  user_id: string;
  full_name: string;
  gender: string;
  nric: string;
  contact_no: string;
  city: string;
  state: string;
  country: string;
  email: string;
  bank: any;  
  expertise_list: string;
  expertise_in: any;
  company: any;
  contact_cty_code: string;
  device_token: string;
  profile_image_url: string;
  status: string;
  role: string;
}

interface CompanyModal {
  id: any;
  address: string;
  city: string;
  company_name: string;
  company_no: string;
  contact_cty_code: string;
  country: string;
  business_title: string;
  main_business: number;
  owned_by: string;  // USER_ID, DOC_ID
  postcode: string;
  state: string;
  tel_no: string;
  comp_size: string;
  comp_overview: string;
}

@Component({
  selector: 'app-view-edit-user',
  templateUrl: './view-edit-user.component.html',
  styleUrls: ['./view-edit-user.component.css']
})

export class ViewEditUserComponent implements OnInit, OnDestroy {

  @ViewChild('profileImageInput') profileImageInput: ElementRef;

  private ngUnsubscribe = new Subject();

  private selectedUserID: string;

  public comments: any;
  public totalComments = 0;

  public viewUserModal = {} as UserModel;
  public editUserModal = {} as UserModel;

  public userCompany = [];

  public viewCompanyModal = {} as CompanyModal;
  public editCompanyModal = {} as CompanyModal;

  public expertiseList: any;
  public stateCityList: any = (stateCityList as any).default;
  public banksList: any = (banksList as any).default;
  
  public compSizeList = [
    {
      'display': '1 - 50',
      'value': '1 - 50'
    },
    {
      'display': '51 - 250',
      'value': '51 - 250'
    },
    {
      'display': '251 - 500',
      'value': '251 - 500'
    },
    {
      'display': '501 - 5000',
      'value': '501 - 5000'
    },
    {
      'display': '> 5000',
      'value': '> 5000'
    },
  ];

  private imageID: string;
  private filePath: string;
  private image: any;
  private file: any;
  public viewImage: any;
  private base64ImageString;
  public isAdmin: boolean = false;
  public compOverview: string;
  public showBank: boolean = false;

  public updateProfileImageB = false;  
  public Editor = ClassicEditor;

  form: FormGroup;

  constructor(private globalVar: GlobalVariable, private http: HttpClient, private globalFunc: GlobalFunction, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router, private constant: ConstantService, private fb: FormBuilder) {
    this.globalVar.currentPageURL = 'users/view-edit-user';
    this.form = this.fb.group({
      items: this.fb.array([]),
      remark: [""]
    });
  }

  ngOnInit() {
    this.editCompanyModal.comp_overview = '';
    this.userAuth();
    this.selectedUserID = this.globalVar.clickedUser;
    this.globalVar.clickedUser = '';
    if(this.globalVar.authUserInfo.role == 'ADMIN') this.isAdmin = true;
    if (this.selectedUserID === '') {
      this.globalFunc.showErrorToast(this.toastr, 'Please select a user to view.');
      this.goBack();
    } else {
      this.getUserInfo();
    }    
  }

  addForms() {
    const formArray = this.form.controls.items as FormArray;
    this.userCompany.forEach((item) => {
      formArray.push(this.fb.group({
          company_name: item.company_name,
          company_no: item.company_no,
          address: item.address,
          city: item.city,
          contact_cty_code: item.contact_cty_code,
          country: item.country,
          main_business: item.main_business,
          owned_by: item.owned_by, 
          postcode: item.postcode,
          state: item.state,
          tel_no: item.tel_no,
          comp_size: item.comp_size,
          comp_overview: item.comp_overview,
        }));
    })
  }
  async getExpertises() {
    const headers = { 'Accept': 'application/json'};
    this.http.get<any>(`${this.constant.baseUrl}api/expertise`, { headers }).subscribe({
      next: data => {
        this.expertiseList = data;
        this.expertiseList.forEach(element2 => {
          element2.checked = false
        });
      },
      error: error => {
        console.error(error);
      },
      complete: () => {
        this.expertiseList.forEach(element2 => {
          this.editUserModal.expertise_in.forEach(element => {
            if (element2.value == element) {
              element2.checked = true;
            }
          });
        });
        this.spinner.hide();
      }
    });
  }

  getUserInfo() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/user/${this.selectedUserID}`, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if(res.success === 1) {
          this.viewUserModal = Object.assign({}, res.profile);
          this.viewUserModal.profile_image_url = this.viewUserModal.profile_image_url+ `?timeStamp=${Date.now()}`;
          this.userCompany = res.comp;
          //this.viewCompanyModal = res.comp;
          this.viewUserModal.company = this.userCompany;
          this.viewUserModal.bank = Object.assign({}, res.bank);
          if(this.viewUserModal.bank.bank_name != null || this.viewUserModal.bank.bank_acc != null || this.viewUserModal.bank.beneficiary != null) {
            this.showBank = true;
          }
          this.viewUserModal.expertise_in = res.userExperts;
          this.viewUserModal.expertise_list = res.expList;

          this.editUserModal = Object.assign({}, res.profile);
          this.editUserModal.profile_image_url = this.editUserModal.profile_image_url+ `?timeStamp=${Date.now()}`;
          /* this.editCompanyModal = res.comp;
          this.editUserModal.company = this.editCompanyModal; */
          this.editUserModal.bank = Object.assign({}, res.bank);
          this.editUserModal.expertise_in = res.userExperts;
          this.editUserModal.expertise_list = res.expList;
          this.viewImage = this.editUserModal.profile_image_url;

          this.totalComments = res.comment.size;
          this.comments = res.comment;
          this.addForms();
        }
      },
      error: error => {
        console.error(error);
      },
      complete: () => {
        this.getExpertises();
      }
    });
  }

  openModal(overview){
    this.compOverview = overview;
    $('#CompanyOverviewModal').modal('show');
  }

  openCompanyModal(_comp:CompanyModal){
    this.editCompanyModal = _comp;
    $('#editCompanyDetailsModal').modal('show');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  goBack() {
    if (navigator.onLine) {
      this.router.navigateByUrl('/users');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  async banUser() {
    if (navigator.onLine) {
      if (confirm('Confirm to ban this user? The user is unable to login or use their account after being banned.')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = {
          ID: this.viewUserModal.id.toString(),
          ACTION: 'ban'
        };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/ban-user`, body, { headers }).subscribe({
          next: data => {
            var res = data.data
            if (res.success === 1) {
              this.globalFunc.showSuccessToast(this.toastr, 'User banned.');
              console.log(res.message)
              this.spinner.hide();
              this.goBack();
            }
            else {
              console.log(res.message)
              this.spinner.hide();
            }
          }
        });
      }
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  async unbanUser() {
    if (navigator.onLine) {
      if (confirm('Confirm to unban this user? The user will be able to login and use their account.')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = {
          ID: this.viewUserModal.id.toString(),
          ACTION: 'unban'
        };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/ban-user`, body, { headers }).subscribe({
          next: data => {
            var res = data.data
            if (res.success === 1) {
              this.globalFunc.showSuccessToast(this.toastr, 'User unbanned.');
              console.log(res.message)
              this.spinner.hide();
              this.goBack();
            }
            else {
              console.log(res.message)
              this.spinner.hide();
            }
          }
        });
      }
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  async deleteComment(comment: any) {
    if (navigator.onLine) {
      if (confirm('Confirm deleting this comment?')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = { type : 'profile', 'comment_id': comment.id };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/del-comment`, body, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if(res.success === 1) {
              console.log(res.message);
              this.getUserInfo();
              this.spinner.hide();
            } else {
              console.log(res.message);
              this.spinner.hide();
            }
          }
        });
      }
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  async saveUserDetails() {
    if (navigator.onLine) {
      await this.spinner.show();
      this.editUserModal.expertise_in = [];
      this.expertiseList.forEach(element => {
        if(element.checked == true)
          this.editUserModal.expertise_in.push(element.value)
      });
      if (this.base64ImageString == null) this.base64ImageString = this.editUserModal.user_id;
      this.initInputs(this.editUserModal);
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      const body = {
        ID: this.editUserModal.id.toString(),
        USER_ID: this.editUserModal.user_id,
        FULL_NAME: this.editUserModal.full_name,
        GENDER: this.editUserModal.gender,
        NRIC: this.editUserModal.nric,
        CITY: this.editUserModal.city,
        STATE: this.editUserModal.state,
        ROLE: this.editUserModal.role,
        COUNTRY: this.editUserModal.country,
        EMAIL: this.editUserModal.email,
        CONTACT_NO: this.editUserModal.contact_no,
        BANK_ACC: this.editUserModal.bank.bank_acc,
        BANK_NAME: this.editUserModal.bank.bank_name,
        BENEFICIARY: this.editUserModal.bank.beneficiary,
        EXPERTISE_IN: this.editUserModal.expertise_in,
        PROFILE_IMAGE_URL: this.base64ImageString,
        // COMPANY_EXIST : this.editUserModal.company != null,
        // COMPANY_NO: this.editCompanyModal ? this.editCompanyModal.company_no : null,
        // COMPANY_NAME: this.editCompanyModal ? this.editCompanyModal.company_name : null,
        // MAIN_BUSINESS: this.editCompanyModal ? this.editCompanyModal.main_business.toString() : null,
        // TEL_NO: this.editCompanyModal ? this.editCompanyModal.tel_no : null,
        // COMPANY_CONTACT_CTY_CODE: this.editCompanyModal ? this.editCompanyModal.contact_cty_code : null,
        // COMPANY_ADDRESS: this.editCompanyModal ? this.editCompanyModal.address : null,
        // COMPANY_POSTCODE: this.editCompanyModal ? this.editCompanyModal.postcode : null,
        // COMPANY_CITY: this.editCompanyModal ? this.editCompanyModal.city : null,
        // COMPANY_STATE: this.editCompanyModal ? this.editCompanyModal.state : null,
        // COMPANY_COUNTRY: this.editCompanyModal ? this.editCompanyModal.country : null,   
      };
      this.http.post<any>(`${this.constant.baseUrl}api/admin/edit-user`, body, { headers }).subscribe({
        next: data => {
          var res = data.data
          if (res.success === 1) {
            $('#editUserDetailsModal').modal('hide');
            this.getUserInfo();
            this.spinner.hide();
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
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  async saveCompanyDetails() {
    if (navigator.onLine) {
      await this.spinner.show();
      this.initInputs(this.editCompanyModal);
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      const body = {
        ACTION: 'update',
        ID: this.editCompanyModal.id.toString(),
        COMPANY_NO: this.editCompanyModal ? this.editCompanyModal.company_no : null,
        COMPANY_NAME: this.editCompanyModal ? this.editCompanyModal.company_name : null,
        MAIN_BUSINESS: this.editCompanyModal ? this.editCompanyModal.main_business.toString() : null,
        TEL_NO: this.editCompanyModal ? this.editCompanyModal.tel_no : null,
        COMPANY_CONTACT_CTY_CODE: this.editCompanyModal ? this.editCompanyModal.contact_cty_code : null,
        COMPANY_ADDRESS: this.editCompanyModal ? this.editCompanyModal.address : null,
        COMPANY_POSTCODE: this.editCompanyModal ? this.editCompanyModal.postcode : null,
        COMPANY_CITY: this.editCompanyModal ? this.editCompanyModal.city : null,
        COMPANY_STATE: this.editCompanyModal ? this.editCompanyModal.state : null,
        COMPANY_COUNTRY: this.editCompanyModal ? this.editCompanyModal.country : null,   
        COMPANY_SIZE: this.editCompanyModal ? this.editCompanyModal.comp_size : null,
        COMPANY_OVERVIEW: this.editCompanyModal ? this.editCompanyModal.comp_overview : null,   
      };
      this.http.post<any>(`${this.constant.baseUrl}api/admin/company`, body, { headers }).subscribe({
        next: data => {
          var res = data.data
          if (res.success === 1) {
            $('#editCompanyDetailsModal').modal('hide');
            this.getUserInfo();
            this.spinner.hide();
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
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  async removeCompany(id) {
    if (confirm('Confirm to remove this company? Company details will be remove forever.')) {
      if (navigator.onLine) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = {
          ACTION: 'delete',
          ID: id.toString(),
        };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/company`, body, { headers }).subscribe({
          next: data => {
            var res = data.data
            if (res.success === 1) {
              this.getUserInfo();
              this.spinner.hide();
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
        this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
      }
    }
  }

  
  private initInputs(form: any) {
    if (form.full_name === '' || form.full_name === undefined) {
      form.full_name = '-';
    }

    if (form.city === '' || form.city === undefined) {
      form.city = '-';
    }

    if (form.state === '' || form.state === undefined) {
      form.state = '-';
    }

    if (form.email === '' || form.email === undefined) {
      form.email = '-';
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

  upperCheck(modal): string {
    if (modal.state !== undefined) {
      return modal.state.toUpperCase();
    }
  }

  profileImagePreview(event: any) {
    if (event.target.files[0]) {
      const reader = new FileReader();
      this.convertFile(event.target.files[0]).subscribe(base64 => {
        this.base64ImageString = base64;
      });
      reader.onload = (event: ProgressEvent) => {
        this.viewImage = (<FileReader>event.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.image = event;
    this.updateProfileImageB = true;
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

}
