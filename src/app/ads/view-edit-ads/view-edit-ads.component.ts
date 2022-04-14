import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { ConstantService } from 'src/app/constant.service';
import { GlobalFunction } from 'src/app/global-functions';
import { GlobalVariable } from 'src/app/global-variables';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as stateCityList from '../../../assets/country/malaysia.json';

interface AdsModal {
  id: number;
  ads_id: string;
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
  other_details: string;
  city: string;
  state: string;
  status: boolean;
  image_url: string;
  updated_at: any;
  website: string;
}

declare var $: any;

@Component({
  selector: 'app-view-edit-ads',
  templateUrl: './view-edit-ads.component.html',
  styleUrls: ['./view-edit-ads.component.css']
})
export class ViewEditAdsComponent implements OnInit {

  public selectedAdsID: string;
  public expertiseList: any;

  public viewAdsModal;
  public editAdsModal = {} as AdsModal;

  public viewImage: any;
  private base64ImageString: string;

  public Editor = ClassicEditor;

  public stateCityList: any = (stateCityList as any).default;

  constructor(private globalVar: GlobalVariable,private spinner: NgxSpinnerService, private constant: ConstantService, private http: HttpClient, private toastr: ToastrService, private globalFunc: GlobalFunction, private router: Router) {
    this.globalVar.currentPageURL = 'ads/view-edit-ads';
  }

  ngOnInit() {
    this.editAdsModal.other_details = '';
    this.userAuth();
    this.getExpertises();
    this.selectedAdsID = this.globalVar.clickedAds;
    this.globalVar.clickedPost = '';
    this.checkSelectedAds();
  }

  async getExpertises() {
    const headers = { 'Accept': 'application/json'};
    this.http.get<any>(`${this.constant.baseUrl}api/expertise`, { headers }).subscribe({
      next: data => {
        this.expertiseList = data;
      },
      error: error => {
        console.error(error);
      }
    });
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

  goBack() {
    if (navigator.onLine) {
      this.router.navigateByUrl('/ads');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  checkSelectedAds() {
    if (this.selectedAdsID === '') {
      this.globalFunc.showErrorToast(this.toastr, 'Please select a Advertisement to view.');
      this.goBack();
    } else {
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      this.http.get<any>(`${this.constant.baseUrl}api/admin/ads/${this.selectedAdsID}`, { headers }).subscribe({
        next: data => {
          var res = data.data.ads;
          this.viewAdsModal =  Object.assign({}, res);
          this.viewAdsModal.image_url = this.viewAdsModal.image_url+ `?timeStamp=${Date.now()}`;
          this.editAdsModal = Object.assign({}, res);
          this.editAdsModal.image_url = this.editAdsModal.image_url+ `?timeStamp=${Date.now()}`;
          this.viewImage = this.editAdsModal.image_url;
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

  upperCheck(): string {
    if(this.editAdsModal) {
      if (this.editAdsModal.state !== undefined) {
        return this.editAdsModal.state.toUpperCase();
      }
    }
    
  }

  async deleteAds() {
    if (navigator.onLine) {
      if (confirm('Confirm deleting this Advertisement?')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = { 'ADS_ID': Number(this.selectedAdsID) };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/del-ads`, body, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if(res.success === 1) {
              this.globalFunc.showSuccessToast(this.toastr, 'Advertisement deleted.');
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

  adsImagePreview(event: any) {
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

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  async saveAdsDetails() {
    if (navigator.onLine) {
      await this.spinner.show();
      let values = {};
      let modalName = '';
      modalName = '#editAdsDetailsModal';
      values = {
        TITLE: this.editAdsModal.title,
        ADDRESS: this.editAdsModal.address,
        CTY_CODE: this.editAdsModal.cty_code,
        CONTACT: this.editAdsModal.contact,
        WEBSITE: this.editAdsModal.website,
        POSTCODE: this.editAdsModal.postcode,
        JOB_TYPE: this.editAdsModal.job_type,
        OTHER_DETAILS: this.editAdsModal.other_details,
        CITY: this.editAdsModal.city,
        STATE: this.editAdsModal.state,
        IMAGE_BASE64: this.base64ImageString,
        ADS_ID : this.editAdsModal.id,
      };
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      this.http.post<any>(`${this.constant.baseUrl}api/admin/edit-ads`, values, { headers }).subscribe({
        next: data => {
          var res = data.data
          if (res.success === 1) {
            this.globalFunc.showSuccessToast(this.toastr, 'Advertisement details successfully updated.');
            this.checkSelectedAds();
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
