import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { uniq } from 'lodash';
import { UsersComponent } from '../users/users.component';
import { ExportTransactionService } from '../services/export-transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantService } from '../constant.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  public transactionList: any;
  public userList: Observable<any>;

  private ref: any;

  public transactionArray = [];
  public fullNameArray = [];
  public postNameArray = [];
  public transactions$: Observable<any>;

  public transactionsListPage = 1;

  public nextPageUrl: string;
  public previousPageUrl: string;
  public currentPage: number;
  disableNext = false;
  disablePrev = false;

  public loadingSpinner = true;

  constructor(private globalVar: GlobalVariable, private constant: ConstantService, public ete: ExportTransactionService, private spinner: NgxSpinnerService, private http: HttpClient) {
    this.globalVar.currentPageURL = 'transactions';
  }

  ngOnInit() {
    this.getTransactionDetails('start');
  }

  getTransactionDetails(action) {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    if(action == 'next') {
      this.http.get<any>(this.nextPageUrl, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.transactionList = res.transactions.data;
            this.nextPageUrl = res.transactions.next_page_url;
            this.previousPageUrl = res.transactions.prev_page_url;
            this.currentPage = res.transactions.current_page;
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
            this.transactionList = res.transactions.data;
            this.nextPageUrl = res.transactions.next_page_url;
            this.previousPageUrl = res.transactions.prev_page_url;
            this.currentPage = res.transactions.current_page;
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
      this.http.get<any>(`${this.constant.baseUrl}api/admin/unsettled-transactions`, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.transactionList = res.transactions.data;
            this.nextPageUrl = res.transactions.next_page_url;
            this.previousPageUrl = res.transactions.prev_page_url;
            this.currentPage = res.transactions.current_page;
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

  /* getOtherDetails(payByID: string, payToID: string, postID: string, amount: string, date: string, status: string, type: string, transactionID: string) {
    var respNum = 0;
    var respNum2 = 0;
    var respNum3 = 0;
    var respNum4 = 0;

     this.ref.collection('REGISTERED_USERS', ref => ref.where('USER_ID', '==', payByID)).get().subscribe(resp => {
      resp.forEach( element => {
        if (respNum == 0) {
           this.ref.collection('REGISTERED_USERS', ref => ref.where('USER_ID', '==', payToID)).get().subscribe(resp2 => {
            resp2.forEach( element2 => {
              if (respNum2 == 0) {
                 this.ref.collection('POSTS', ref => ref.where('JOB_ID', '==', postID)).get().subscribe(resp3 => {
                  resp3.forEach( element3 => {
                    if (respNum3 == 0) {
                      if (element3.get('TYPE') == "FIND-JOB") {
                         this.ref.collection('POSTS').doc(postID).collection('HIRED_BY').get().subscribe(resp4 => {
                          resp4.forEach( element4 => {
                            if (respNum4 == 0 && element4.get('PAID_STATUS') == "Processing payment by JOBS IT SDN BHD") {
                              this.transactionArray.push({
                                transId: transactionID,
                                postId: postID,
                                postName: element3.get('TITLE'),
                                payByName: element.get('FULL_NAME'),
                                payToName: element2.get('FULL_NAME'),
                                date: new Date(date['seconds']*1000),
                                amount: Number(amount).toFixed(2),
                                charges: ((Number(amount)*0.1)+2).toFixed(2),
                                payAmount: ((Number(amount)*0.9)-2).toFixed(2),
                                bankName: element2.get('BANK_NAME'),
                                accNo: element2.get('BANK_ACC'),
                                beneficiaryName: element2.get('BENEFICIARY'),
                                paidStatus: element4.get('PAID_STATUS'),
                                status: status,
                                type: type,
                                payToId: element2.get('USER_ID'),
                                payById: element.get('USER_ID')
                              });
                              this.transactionArray.sort(this.sortTransaction);
                            }
                            respNum4++;
                          })
                        })
                      } else {
                        this.ref.collection('POSTS').doc(postID).collection('REQUESTED_BY').get().subscribe(resp4 => {
                          resp4.forEach( element4 => {
                            if (respNum4 == 0 && element4.get('PAID_STATUS') == "Processing payment by JOBS IT SDN BHD") {
                              this.transactionArray.push({
                                transId: transactionID,
                                postId: postID,
                                postName: element3.get('TITLE'),
                                payByName: element.get('FULL_NAME'),
                                payToName: element2.get('FULL_NAME'),
                                date: new Date(date['seconds']*1000),
                                amount: Number(amount).toFixed(2),
                                charges: ((Number(amount)*0.1)+2).toFixed(2),
                                payAmount: ((Number(amount)*0.9)-2).toFixed(2),
                                bankName: element2.get('BANK_NAME'),
                                accNo: element2.get('BANK_ACC'),
                                beneficiaryName: element2.get('BENEFICIARY'),
                                paidStatus: element4.get('PAID_STATUS'),
                                status: status,
                                type: type,
                                payToId: element2.get('USER_ID'),
                                payById: element.get('USER_ID')
                              });
                              this.transactionArray.sort(this.sortTransaction);
                            }
                            respNum4++;
                          })
                        })
                      }
                    }
                    respNum3++;
                  })
                })
              }
              respNum2++;
            })
          })
          respNum++;
        }
      });
    })
  } */

  payToReceiver(transId, index) {
    if (confirm('Are you sure to confirm the payment?')) {
      const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
      const body = { ID : transId.toString() };
      this.http.post<any>(`${this.constant.baseUrl}api/admin/edit-payment`, body, { headers }).subscribe({
        next: data => {
          console.log(data);
          this.transactionList.splice(index, 1);
        },
        error: error => {
          console.error(error);
        }
      });
    }    
  }

 /*  updatePostPaidStatus(postId, payToId, payById) {
    this.ref.collection('POSTS', ref => ref.where('JOB_ID', '==', postId)).get().subscribe(resp => {
      resp.forEach( element => {
          if (element.get('TYPE') == "FIND-JOB") {
            this.ref.collection('POSTS').doc(postId).collection('HIRED_BY', ref => ref.where('USER_ID', '==', payById)).get().subscribe(resp2 => {
              resp2.forEach( element2 => {
                this.ref.collection('POSTS').doc(postId).collection('HIRED_BY').doc(element2.id).update ({
                  'PAID_STATUS': 'settled'
                })
              });
            })              
          }
          else {
            this.ref.collection('POSTS').doc(postId).collection('REQUESTED_BY', ref => ref.where('USER_ID', '==', payToId)).get().subscribe(resp2 => {
              resp2.forEach( element2 => {
                this.ref.collection('POSTS').doc(postId).collection('REQUESTED_BY').doc(element2.id).update ({
                  'PAID_STATUS': 'settled'
                })
              });
            })         
          }
        })
      });
  } */

  exportExcel(): void 
  {
    var dataForExcel = [];
    var Heading = ['TRANSACTION ID', 'POST ID','JOBS','PAY BY', 'PAY TO', 'DATE', 'AMOUNT (MYR)', 'CHARGES (MYR)', 'PAY (MYR)', 'BANK NAME', 'ACCOUNT NO', 'BENEFICIARY NAME'];
    this.transactionList.forEach((row: any) => {
      var data = [];
      data.push(row['tran_id']);
      data.push(row['job_id']);
      data.push(row['title']);
      data.push(row['pay_by_name']);
      data.push(row['pay_to_name']);
      data.push(row['pay_date']);
      data.push(row['amount']);
      data.push(row['charges']);
      data.push(row['pay']);
      data.push(row['bank_name']);
      data.push(row['bank_acc']);
      data.push(row['beneficiary']);
      dataForExcel.push(data)
    })
    let reportData = {
      title: 'Transactions',
      data: dataForExcel,
      header: Heading,
      worksheets: ['Unsettled']
    } 
    this.ete.exportExcel(reportData);			
  }

  sortTransaction(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
}
