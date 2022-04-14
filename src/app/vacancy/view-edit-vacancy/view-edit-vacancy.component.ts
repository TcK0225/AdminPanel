import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { ConstantService } from 'src/app/constant.service';
import { GlobalFunction } from 'src/app/global-functions';
import { GlobalVariable } from 'src/app/global-variables';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as stateCityList from '../../../assets/country/malaysia.json';

interface VacModal {
  id: number;
  vac_id: string;
  title: string;
  address: string;
  created_by: any;
  created_at: any;
  expired_date: any;
  contact: string;
  cty_code: string;
  postcode: string;
  job_type: string;
  job_type_title: string;
  job_category: string;
  qualification: string;
  experience: number;
  min_salary: number;
  max_salary: number;
  langauge: any;
  other_details: string;
  city: string;
  state: string;
  status: boolean;
  image_url: string;
  updated_at: any;
}

declare var $: any;

@Component({
  selector: 'app-view-edit-vacancy',
  templateUrl: './view-edit-vacancy.component.html',
  styleUrls: ['./view-edit-vacancy.component.css']
})
export class ViewEditVacancyComponent implements OnInit {

  public selectedVacID: string;
  public expertiseList: any;
  public categoryList: any;

  public languages: any = [];
  public inputLang: string;

  public viewVacModal = {} as VacModal;
  public editVacModal = {} as VacModal;

  public viewImage: any;
  private base64ImageString: string;

  public Editor = ClassicEditor;

  public stateCityList: any = (stateCityList as any).default;

  minValue: number = 1;
  maxValue: number = 20000;
  options: Options = {
    floor: 1,
    ceil: 20000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return value.toString();
        case LabelType.High:
          return value.toString();
        default:
          return value.toString();
      }
    }
  };

  constructor(private globalVar: GlobalVariable, private spinner: NgxSpinnerService, private constant: ConstantService, private http: HttpClient, private toastr: ToastrService, private globalFunc: GlobalFunction, private router: Router) {
    this.globalVar.currentPageURL = 'vac/view-edit-vac';
  }

  ngOnInit(): void {
    this.editVacModal.other_details = '';
    this.userAuth();
    this.getExpertises();
    this.selectedVacID = this.globalVar.clickedVac;
    this.globalVar.clickedPost = '';
    this.checkSelectedVac();
  }

  async getExpertises() {
    const headers = { 'Accept': 'application/json' };
    this.http.get<any>(`${this.constant.baseUrl}api/expertise`, { headers }).subscribe({
      next: data => {
        this.expertiseList = data;
      },
      error: error => {
        console.error(error);
      }
    });
    this.categoryList = [
      {
        'display': 'Full Time',
        'value': 'Full-Time'
      },
      {
        'display': 'Part Time',
        'value': 'Part-Time'
      },
      {
        'display': 'Contract',
        'value': 'Contract'
      },
      {
        'display': 'Internship',
        'value': 'Internship'
      }
    ];
  }

  async userAuth() {
    if (!this.isLoggedIn()) {
      this.globalFunc.showErrorToast(this.toastr, this.globalVar.internetError);
      await this.router.navigate(['/login']);
    }
  }

  addLanguage() {
    this.languages.push(this.inputLang);
    this.inputLang = null;
  }

  removeLang(i) {
    this.languages.forEach((element, index) => {
      if (index == i) this.languages.splice(index, 1);
    });
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  goBack() {
    if (navigator.onLine) {
      this.router.navigateByUrl('/vac');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  checkSelectedVac() {
    if (this.selectedVacID === '') {
      this.globalFunc.showErrorToast(this.toastr, 'Please select a Vacancy to view.');
      this.goBack();
    } else {
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      this.http.get<any>(`${this.constant.baseUrl}api/admin/vac/${this.selectedVacID}`, { headers }).subscribe({
        next: data => {
          var res = data.data.vac;
          this.viewVacModal = Object.assign({}, res);
          this.viewVacModal.image_url = this.viewVacModal.image_url + `?timeStamp=${Date.now()}`;
          this.editVacModal = Object.assign({}, res);
          this.editVacModal.image_url = this.editVacModal.image_url + `?timeStamp=${Date.now()}`;
          this.viewImage = this.editVacModal.image_url;
          this.minValue = this.editVacModal.min_salary;
          this.maxValue = this.editVacModal.max_salary;
          this.languages = res.language.split(", ");
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

  upperCheck(): string {
    if (this.editVacModal) {
      if (this.editVacModal.state !== undefined) {
        return this.editVacModal.state.toUpperCase();
      }
    }

  }

  async deleteVac() {
    if (navigator.onLine) {
      if (confirm('Confirm deactive this Vacancy?')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = { 'VAC_ID': Number(this.selectedVacID), 'STATUS': false };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/del-vac`, body, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.globalFunc.showSuccessToast(this.toastr, 'Vacancy deleted.');
              console.log(res.message);
              this.spinner.hide();
              this.goBack();
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

  async activeVac() {
    if (navigator.onLine) {
      if (confirm('Confirm re-active this Vacancy?')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = { 'VAC_ID': Number(this.selectedVacID), 'STATUS': true };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/del-vac`, body, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.globalFunc.showSuccessToast(this.toastr, 'Vacancy deleted.');
              console.log(res.message);
              this.spinner.hide();
              this.goBack();
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

  vacImagePreview(event: any) {
    if (event.target.files[0]) {
      const reader = new FileReader();
      this.convertFile(event.target.files[0]).subscribe(base64 => {
        this.base64ImageString = base64;
      });
      reader.onload = (event: ProgressEvent) => {
        this.viewImage = (event.target as FileReader).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  async saveVacDetails() {
    if (navigator.onLine) {
      await this.spinner.show();
      let lang = '';
      this.languages.forEach((element, index) => {
        lang += element;
        if (index != this.languages.length - 1) {
          lang += ', '
        }
      });
      let values = {};
      let modalName = '';
      modalName = '#editVacDetailsModal';
      values = {
        TITLE: this.editVacModal.title,
        ADDRESS: this.editVacModal.address,
        CTY_CODE: this.editVacModal.cty_code,
        CONTACT: this.editVacModal.contact,
        QUALIFICATION: this.editVacModal.qualification,
        MIN_SALARY: this.minValue,
        MAX_SALARY: this.maxValue,
        LANGUAGE: lang,
        POSTCODE: this.editVacModal.postcode,
        JOB_TYPE: this.editVacModal.job_type,
        JOB_CATEGORY: this.editVacModal.job_category,
        OTHER_DETAILS: this.editVacModal.other_details,
        CITY: this.editVacModal.city,
        STATE: this.editVacModal.state,
        IMAGE_BASE64: this.base64ImageString,
        VAC_ID: this.editVacModal.id,
        EXPERIENCE: this.editVacModal.experience
      };
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      this.http.post<any>(`${this.constant.baseUrl}api/admin/edit-vac`, values, { headers }).subscribe({
        next: data => {
          var res = data.data
          if (res.success === 1) {
            this.checkSelectedVac();
            this.globalFunc.showSuccessToast(this.toastr, 'Vacancy details successfully updated.');
            $(modalName).modal('hide');
            this.spinner.hide();
            console.log(res.message);
          } else {
            this.spinner.hide();
            console.log(res.message);
          }
        },
        error: error => {
          this.globalFunc.showErrorToast(this.toastr, error.message);
          console.error(error);
          this.spinner.hide();
        }
      });
    }
  }

}
