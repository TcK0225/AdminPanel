import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { GlobalVariable } from '../../global-variables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalFunction } from '../../global-functions';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as stateCityList from '../../../assets/country/malaysia.json';
import {AngularFireStorage} from '@angular/fire/storage';
import { ConstantService } from 'src/app/constant.service';
import { HttpClient } from '@angular/common/http';

interface FindJobModal {
  id: number;
  type: string;
  job_id: string;
  title: string;
  address: string;
  available_start_time: any;
  available_end_time: any;
  created_by: string;  // USER_ID
  created_date: any;
  hire_status: boolean;
  job_type: string;
  job_type_title: string;
  other_details: string;
  salary_per_hour: number;
  city: string;
  state: string;
  status: boolean;
  image_url: string;
  updated_at: any;
}

interface RequestEmployeesModal {
  id: number;
  type: string;
  job_id: string;
  title: string;
  job_start_time: any;
  job_end_time: any;
  created_by: string;
  created_date: any;
  job_type: string;
  job_type_title:string;
  other_details: string;
  salary_per_hour: number;
  address: string;
  city: string;
  state: string;
  status: boolean;
  image_url: string;
  access_job: any;
  num_of_hires: number;
  postcode: string;
  updated_at: any;
}

declare var $: any;

@Component({
  selector: 'app-view-edit-job',
  templateUrl: './view-edit-job.component.html',
  styleUrls: ['./view-edit-job.component.css']
})

export class ViewEditJobComponent implements OnInit, OnDestroy {

  @ViewChild('postImageInput') postImageInput: ElementRef;
  @ViewChild('postImageInput2') postImageInput2: ElementRef;

  private ngUnsubscribe = new Subject();

  private ref: any;
  public user: any;
  public comments: any;

  private selectedPostID: string;
  public selectedPostType = '';
  public totalComments = 0;
  public editFindJobHireStatus = 'Available';

  public viewFindJobModal = {} as FindJobModal;
  public editFindJobModal = {} as FindJobModal;
  public viewRequestEmployeesModal = {} as RequestEmployeesModal;
  public editRequestEmployeesModal = {} as RequestEmployeesModal;

  public viewFindJobAvailableStartTime: Date;
  public viewFindJobAvailableEndTime: Date;
  public viewFindJobLastUpdatedDate: Date;
  public viewRequestEmployeesJobEndTime: Date;
  public viewRequestEmployeesJobStartTime: Date;
  public viewRequestEmployeesLastUpdatedDate: Date;
  public editFindJobAvailableStartTime: Date;
  public editFindJobAvailableEndTime: Date;
  public editRequestEmployeesJobEndTime: Date;
  public editRequestEmployeesJobStartTime: Date;

  public expertiseList: any;
  public stateCityList: any = (stateCityList as any).default;

  private imageID: string;
  private filePath: string;
  private image: any;
  private file: any;
  public viewImage: any;
  public updatePostImageB = false;

  private base64ImageString;

  constructor(private globalVar: GlobalVariable, private constant: ConstantService, private toastr: ToastrService,
              private spinner: NgxSpinnerService, private globalFunc: GlobalFunction, private router: Router,
              private http: HttpClient, private afStorage: AngularFireStorage, private r: Router) {
    this.globalVar.currentPageURL = 'jobs/view-edit-jobs';
  }

  ngOnInit() {
    this.userAuth();
    this.getExpertises();
    this.selectedPostID = this.globalVar.clickedPost;
    this.globalVar.clickedPost = '';
    this.checkSelectedPostStatus();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  viewUserTaskList(USER_ID: any) {
    this.globalVar.clickedUser = USER_ID;
    if (navigator.onLine) {
      this.r.navigateByUrl('tasks/view-task');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  checkSelectedPostStatus() {
    if (this.selectedPostID === '') {
      this.globalFunc.showErrorToast(this.toastr, 'Please select a post to view.');
      this.goBack();
    } else {
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      this.http.get<any>(`${this.constant.baseUrl}api/admin/post/${this.selectedPostID}`, { headers }).subscribe({
        next: data => {
          var res = data.data.post;
          if (res.type === 'FIND-JOB') {
            this.viewFindJobModal = Object.assign({}, res);
            this.viewFindJobModal.image_url = this.viewFindJobModal.image_url+ `?timeStamp=${Date.now()}`;
            this.editFindJobModal = Object.assign({}, res);
            this.editFindJobModal.image_url = this.editFindJobModal.image_url+ `?timeStamp=${Date.now()}`;
            this.viewImage = this.editFindJobModal.image_url;
          } else {
            this.viewRequestEmployeesModal = Object.assign({}, res);
            this.viewRequestEmployeesModal.image_url = this.viewRequestEmployeesModal.image_url+ `?timeStamp=${Date.now()}`;
            this.editRequestEmployeesModal = Object.assign({}, res);
            this.editRequestEmployeesModal.image_url = this.editRequestEmployeesModal.image_url+ `?timeStamp=${Date.now()}`;
            this.viewImage = this.editRequestEmployeesModal.image_url;
          }
          this.selectedPostType = res.type;
          this.timestampToDate(res.type);
          this.getUsers(res.created_by);
          this.getComments(res.id);
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

  getUsers(uid) {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    this.http.get<any>(`${this.constant.baseUrl}api/admin/user/${uid}`, { headers }).subscribe({
      next: data => {
        var res = data.data;
        if (res.success === 1) {
          this.user = res;
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

  getComments(pid) {
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      this.http.get<any>(`${this.constant.baseUrl}api/admin/comment/${pid}`, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.comments = res.comment;
            this.totalComments = this.comments.length;
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

  goBack() {
    if (navigator.onLine) {
      this.router.navigateByUrl('/jobs');
    } else {
      this.globalFunc.showWarningToast(this.toastr, this.globalVar.internetError);
    }
  }

  async deletePost() {
    if (navigator.onLine) {
      if (confirm('Confirm deleting this post?')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = { 'JOB_ID': Number(this.selectedPostID) };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/del-post`, body, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if(res.success === 1) {
              this.globalFunc.showSuccessToast(this.toastr, 'Post deleted.');
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

  async savePostDetails(type: string) {
    if (navigator.onLine) {
      await this.spinner.show();
      let values = {};
      let modalName = '';
      if (type === 'FIND-JOB') {
        this.editFindJobModal.hire_status = this.editFindJobHireStatus === 'Available';
        modalName = '#editFindJobDetailsModal';
        this.initInputs(this.editFindJobModal);
        values = {
          TITLE: this.editFindJobModal.title,
          ADDRESS: this.editFindJobModal.address,
          JOB_TYPE: this.editFindJobModal.job_type.toString(),
          OTHER_DETAILS: this.editFindJobModal.other_details,
          SALARY_PER_HOUR: this.editFindJobModal.salary_per_hour,
          CITY: this.editFindJobModal.city,
          STATE: this.editFindJobModal.state,
          AVAILABLE_START_TIME: this.editFindJobModal.available_start_time,
          AVAILABLE_END_TIME: this.editFindJobModal.available_end_time,
          HIRE_STATUS: this.editFindJobModal.hire_status,
          IMAGE_BASE64: this.base64ImageString,
          TYPE : "FIND-JOB",
          JOB_ID : this.editFindJobModal.id
        };
      } else {
        this.viewRequestEmployeesLastUpdatedDate = new Date();
        modalName = '#editRequestEmployeesDetailsModal';
        this.initInputs(this.editRequestEmployeesModal);
        values = {
          TITLE: this.editRequestEmployeesModal.title,
          JOB_START_TIME: this.editRequestEmployeesModal.job_start_time,
          JOB_END_TIME: this.editRequestEmployeesModal.job_end_time,
          JOB_TYPE: this.editRequestEmployeesModal.job_type.toString(),
          OTHER_DETAILS: this.editRequestEmployeesModal.other_details,
          SALARY_PER_HOUR: this.editRequestEmployeesModal.salary_per_hour,
          ADDRESS: this.editRequestEmployeesModal.address,
          CITY: this.editRequestEmployeesModal.city,
          STATE: this.editRequestEmployeesModal.state,
          IMAGE_BASE64: this.base64ImageString,
          NUM_OF_HIRES: this.editRequestEmployeesModal.num_of_hires,
          POSTCODE: this.editRequestEmployeesModal.postcode,
          TYPE : "REQUEST-EMPLOYEE",
          JOB_ID : this.editFindJobModal.id
        };
      }
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      this.http.post<any>(`${this.constant.baseUrl}api/admin/edit-post`, values, { headers }).subscribe({
        next: data => {
          var res = data.data
          if (res.success === 1) {
            this.globalFunc.showSuccessToast(this.toastr, 'Post details successfully updated.');
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

  private initInputs(form: any) {
    if (form.type === 'FIND-JOB') {

    } else {
      if (form.postcode === '' || form.postcode === undefined) {
        form.postcode = '-';
      }

      if (form.num_of_hires === '' || form.num_of_hires === undefined) {
        form.num_of_hires = '-';
      }
    }

    if (form.title === '' || form.title === undefined) {
      form.title = '-';
    }

    if (form.state === '' || form.state === undefined) {
      form.state = '-';
    }

    if (form.other_details === '' || form.other_details === undefined) {
      form.other_details = '-';
    }

    if (form.salary_per_hour === '' || form.salary_per_hour === undefined) {
      form.salary_per_hour = '-';
    }

    if (form.city === '' || form.city === undefined) {
      form.city = '-';
    }

    if (form.address === '' || form.address === undefined) {
      form.address = '-';
    }
  }

  async deleteComment(comment: any) {
    if (navigator.onLine) {
      if (confirm('Confirm to delete this comment? This action cannot be undone')) {
        await this.spinner.show();
        const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        const body = { type : 'jobs', 'comment_id': comment.id };
        this.http.post<any>(`${this.constant.baseUrl}api/admin/del-comment`, body, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if(res.success === 1) {
              console.log(res.message);
              this.getComments(this.selectedPostID);
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

  async userAuth() {
    if (!this.isLoggedIn()) {
      this.globalFunc.showErrorToast(this.toastr, this.globalVar.internetError);
      await this.router.navigate(['/login']);
    } 
  }

  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }

  timestampToDate(type) {
    if (type === 'FIND-JOB') {
      try {
        this.viewFindJobAvailableStartTime = this.viewFindJobModal.available_start_time;
        this.viewFindJobAvailableEndTime = this.viewFindJobModal.available_end_time;
        this.viewFindJobLastUpdatedDate = this.viewFindJobModal.updated_at;
        this.editFindJobAvailableStartTime = this.editFindJobModal.available_start_time;
        this.editFindJobAvailableEndTime = this.editFindJobModal.available_end_time;
        if (this.editFindJobModal.hire_status === true) {
          this.editFindJobHireStatus = 'Available';
        } else {
          this.editFindJobHireStatus = 'Not Available';
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        this.viewRequestEmployeesJobStartTime = this.viewRequestEmployeesModal.job_start_time;
        this.viewRequestEmployeesJobEndTime = this.viewRequestEmployeesModal.job_end_time;
        this.viewRequestEmployeesLastUpdatedDate = this.viewRequestEmployeesModal.updated_at;
        this.editRequestEmployeesJobStartTime = this.editRequestEmployeesModal.job_start_time;
        this.editRequestEmployeesJobEndTime = this.editRequestEmployeesModal.job_end_time;
      } catch (e) {console.log(e)
      }
    }
  }

  upperCheck(): string {
    if(this.editRequestEmployeesModal || this.editFindJobModal) {
      if (this.editFindJobModal.state !== undefined) {
        return this.editFindJobModal.state.toUpperCase();
      }
      if (this.editRequestEmployeesModal.state !== undefined) {
        return this.editRequestEmployeesModal.state.toUpperCase();
      }
    }
    
  }

  postImagePreview(event: any) {
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
    this.image = event;
    this.updatePostImageB = true;
  }

  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  /* uploadProfileImage() {
    // const uuidv1 = require('uuid/v1');
    this.file = this.image.target.files[0];
    //this.imageID = this.afs.createId();
    //this.filePath = 'JOBS/JOBS-IMAGE/' + this.imageID;
  } */

  /* async updatePostImage(type) {
    if (navigator.onLine) {
      await this.spinner.show();
      if (this.updatePostImageB === true) {
        this.uploadProfileImage();
        if (type === 'FIND-JOB') {
          await this.afStorage.storage.refFromURL(this.editFindJobModal.image_url).delete();
        } else {
          await this.afStorage.storage.refFromURL(this.editRequestEmployeesModal.image_url).delete();
        }
        await this.afStorage.upload(this.filePath, this.file).then(
          (res) => {
            res.ref.getDownloadURL().then(
              async (url) => {
                if (type === 'FIND-JOB') {
                  this.editFindJobModal.image_url = await url;
                } else {
                  this.editRequestEmployeesModal.image_url = await url;
                }
                this.savePostDetails(type);
              },
              (err) => {
                this.globalFunc.showErrorToast(this.toastr, err.message);
                this.spinner.hide();
              }
            ).catch(
              (err) => {
                this.globalFunc.showErrorToast(this.toastr, err.message);
                this.spinner.hide();
              }
            );
          },
          (err) => {
            this.globalFunc.showErrorToast(this.toastr, err.message);
            this.spinner.hide();
          }
        ).catch(
          (err) => {
            this.globalFunc.showErrorToast(this.toastr, err.message);
            this.spinner.hide();
          }
        );
      } else {
        this.savePostDetails(type);
      }
    } else {
      this.globalFunc.showErrorToast(this.toastr, this.globalVar.internetError);
    }
  } */

  dateToTimestamp_AST() {
    const dateTime = this.editFindJobModal.available_start_time.replace('T', ' ');
    const dateTimeParts = dateTime.split(' ');
    const timeParts = dateTimeParts[1].split(':');
    const dateParts = dateTimeParts[0].split('-');

    const date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);
    this.editFindJobModal.available_start_time = date;
    this.editFindJobAvailableStartTime = date;
  }

  dateToTimestamp_AET() {
    const dateTime = this.editFindJobModal.available_end_time.replace('T', ' ');
    const dateTimeParts = dateTime.split(' ');
    const timeParts = dateTimeParts[1].split(':');
    const dateParts = dateTimeParts[0].split('-');

    const date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);
    this.editFindJobModal.available_end_time = date;
    this.editRequestEmployeesJobEndTime = date;
  }

  dateToTimestamp_JST() {
    const dateTime = this.editRequestEmployeesModal.job_start_time.replace('T', ' ');
    const dateTimeParts = dateTime.split(' ');
    const timeParts = dateTimeParts[1].split(':');
    const dateParts = dateTimeParts[0].split('-');

    const date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);
    this.editRequestEmployeesModal.job_start_time = date;
    this.editRequestEmployeesJobStartTime = date;
  }

  dateToTimestamp_JET() {
    const dateTime = this.editRequestEmployeesModal.job_end_time.replace('T', ' ');
    const dateTimeParts = dateTime.split(' ');
    const timeParts = dateTimeParts[1].split(':');
    const dateParts = dateTimeParts[0].split('-');

    const date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);
    this.editRequestEmployeesModal.job_end_time = date;
    this.editRequestEmployeesJobEndTime = date;
  }
}
