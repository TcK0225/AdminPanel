import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { ConstantService } from '../constant.service';
import { GlobalFunction } from '../global-functions';
import { GlobalVariable } from '../global-variables';

declare var $: any;

@Component({
  selector: 'app-payment-config',
  templateUrl: './payment-config.component.html',
  styleUrls: ['./payment-config.component.css']
})
export class PaymentConfigComponent implements OnInit {

  public createCharges: number;
  public updateCharges: number;
  public createVCharges: number;
  public updateVCharges: number;
  public platformCharges: number;
  public serviceCharges: number;
  public advertiseDays: number;
  public expertiseList: any;
  public viewImage: any;
  private base64ImageString: string;
  public selectedExpertise = {};

  constructor(private globalVar: GlobalVariable, private spinner: NgxSpinnerService, private toastr: ToastrService, private globalFunc: GlobalFunction, private http: HttpClient, private constant: ConstantService) {
    this.globalVar.currentPageURL = 'payment-config';
  }

  ngOnInit(): void {
    this.readPaymentConfig();
    this.getExpertises();
  }

  readPaymentConfig() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    const body = { action : 'read'};
    this.http.post<any>(`${this.constant.baseUrl}api/admin/config-payment`, body, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.createCharges = res.configuration.advertise_create;
          this.updateCharges = res.configuration.advertise_update;
          this.createVCharges = res.configuration.vacancy_create;
          this.updateVCharges = res.configuration.vacancy_update;
          this.platformCharges = res.configuration.platform_charges;
          this.serviceCharges = res.configuration.service_charges;
          this.advertiseDays = res.configuration.advertise_days;
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

  async getExpertises() {
    const headers = { 'Accept': 'application/json'};
    this.http.get<any>(`${this.constant.baseUrl}api/expertise`, { headers }).subscribe({
      next: data => {
        this.expertiseList = data;
        this.expertiseList.forEach(element => {
          element.img = `${this.constant.baseUrl}storage/expertise/` + element.value + ".png" + `?timeStamp=${Date.now()}`;
        });
      },
      error: error => {
        console.error(error);
      }
    });
  }

  editPaymentConfig() {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    const body = { 
      action : 'update', 
      createCharges: this.createCharges, 
      updateCharges: this.updateCharges, 
      createVCharges: this.createVCharges, 
      updateVCharges: this.updateVCharges, 
      platformCharges: this.platformCharges, 
      serviceCharges: this.serviceCharges, 
      advertiseDays: this.advertiseDays 
    };
    this.http.post<any>(`${this.constant.baseUrl}api/admin/config-payment`, body, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.readPaymentConfig();
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

  async checkSelectedExp(exp) {
    this.selectedExpertise = exp;
    this.viewImage = `${this.constant.baseUrl}storage/expertise/` + exp.value + ".png" + `?timeStamp=${Date.now()}`;
      $('#editExpDetailsModal').modal('show');
  }

  expImagePreview(event: any) {
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

  async saveExpDetails(){
    await this.spinner.show();
    let values = {};
    let modalName = '';
    modalName = '#editExpDetailsModal';
    values = {
      ID: this.selectedExpertise['value'],
      ENG: this.selectedExpertise['display'],
      CHI: this.selectedExpertise['zh'],
      MAL: this.selectedExpertise['ms'],
      ICON: this.base64ImageString ?? null
    };
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.post<any>(`${this.constant.baseUrl}api/admin/expertise`, values, { headers }).subscribe({
      next: data => {
        var res = data.data
        if (res.success === 1) {
          this.globalFunc.showSuccessToast(this.toastr, 'Expertise details successfully updated.');
          this.getExpertises();
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
