import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { ExportTransactionService } from '../services/export-transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantService } from '../constant.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

  public transactionList1: any;
  public transactionList2: any;
  public transactionList3: any;

  public loadingSpinner = true;
  public isLoading = false;

  public nextPageUrl1: string;
  public previousPageUrl1: string;
  public currentPage1: number;
  disableNext1 = false;
  disablePrev1 = false;

  public nextPageUrl2: string;
  public previousPageUrl2: string;
  public currentPage2: number;
  disableNext2 = false;
  disablePrev2 = false;

  public nextPageUrl3: string;
  public previousPageUrl3: string;
  public currentPage3: number;
  disableNext3= false;
  disablePrev3 = false;

  constructor(private globalVar: GlobalVariable, private constant: ConstantService,private http: HttpClient, public ete: ExportTransactionService, private spinner: NgxSpinnerService) {
    this.globalVar.currentPageURL = 'transaction-history';
  }

  ngOnInit(): void {
    this.getTransactionHistory('start', null);
  }

  getTransactionHistory(action, segment) {
    const headers = { 'Accept': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
    if(action == 'next') {
      if (segment == 1 ) {
        this.http.get<any>(this.nextPageUrl1, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.transactionList1 = res.segment1.data;
              this.nextPageUrl1 = res.segment1.next_page_url;
              this.previousPageUrl1 = res.segment1.prev_page_url;
              this.currentPage1 = res.segment1.current_page;
              if(this.nextPageUrl1 == null) 
                this.disableNext1 = true;
              else 
                this.disableNext1 = false;
              if(this.previousPageUrl1 == null) 
                this.disablePrev1 = true;
              else
                this.disablePrev1 = false;
              console.log(res.message);
            } else {
              console.log(res.message);
            }
          },
          error: error => {
            console.error(error);
          }
        });  
      } else if (segment = 2) {
        this.http.get<any>(this.nextPageUrl2, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.transactionList2 = res.segment2.data;
              this.nextPageUrl2 = res.segment2.next_page_url;
              this.previousPageUrl2 = res.segment2.prev_page_url;
              this.currentPage2 = res.segment2.current_page;
              if(this.nextPageUrl2 == null) 
                this.disableNext2 = true;
              else 
                this.disableNext2 = false;
              if(this.previousPageUrl2 == null) 
                this.disablePrev2 = true;
              else
                this.disablePrev2 = false;
              console.log(res.message);
            } else {
              console.log(res.message);
            }
          },
          error: error => {
            console.error(error);
          }
        });  
      } else if (segment = 3) {
        this.http.get<any>(this.nextPageUrl2, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.transactionList3 = res.segment3.data;
              this.nextPageUrl3 = res.segment3.next_page_url;
              this.previousPageUrl3 = res.segment3.prev_page_url;
              this.currentPage3 = res.segment3.current_page;
              if(this.nextPageUrl3 == null) 
                this.disableNext3 = true;
              else 
                this.disableNext3 = false;
              if(this.previousPageUrl3 == null) 
                this.disablePrev3 = true;
              else
                this.disablePrev3 = false;
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
    } else if (action == 'prev') {
      if (segment == 1 ) {
        this.http.get<any>(this.previousPageUrl1, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.transactionList1 = res.segment1.data;
            this.nextPageUrl1 = res.segment1.next_page_url;
            this.previousPageUrl1 = res.segment1.prev_page_url;
            this.currentPage1 = res.segment1.current_page;
            if(this.nextPageUrl1 == null) 
              this.disableNext1 = true;
            else 
              this.disableNext1 = false;
            if(this.previousPageUrl1 == null) 
              this.disablePrev1 = true;
            else
              this.disablePrev1 = false;
            console.log(res.message);
          } else {
            console.log(res.message);
          }
        },
        error: error => {
          console.error(error);
        }
      });  
      } else if (segment = 2) {
        this.http.get<any>(this.previousPageUrl2, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.transactionList2 = res.segment2.data;
              this.nextPageUrl2 = res.segment2.next_page_url;
              this.previousPageUrl2 = res.segment2.prev_page_url;
              this.currentPage2 = res.segment2.current_page;
              if(this.nextPageUrl2 == null) 
                this.disableNext2 = true;
              else 
                this.disableNext2 = false;
              if(this.previousPageUrl2 == null) 
                this.disablePrev2 = true;
              else
                this.disablePrev2 = false;
              console.log(res.message);
            } else {
              console.log(res.message);
            }
          },
          error: error => {
            console.error(error);
          }
        });  
      } else if (segment = 3) {
        this.http.get<any>(this.previousPageUrl3, { headers }).subscribe({
          next: data => {
            var res = data.data;
            if (res.success === 1) {
              this.transactionList3 = res.segment3.data;
              this.nextPageUrl3 = res.segment3.next_page_url;
              this.previousPageUrl3 = res.segment3.prev_page_url;
              this.currentPage3 = res.segment3.current_page;
              if(this.nextPageUrl3 == null) 
                this.disableNext3 = true;
              else 
                this.disableNext3 = false;
              if(this.previousPageUrl3 == null) 
                this.disablePrev3 = true;
              else
                this.disablePrev3 = false;
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
    } else { 
      this.http.get<any>(`${this.constant.baseUrl}api/admin/transactions-hist`, { headers }).subscribe({
        next: data => {
          var res = data.data;
          if (res.success === 1) {
            this.transactionList1 = res.segment1.data;
            this.nextPageUrl1 = res.segment1.next_page_url;
            this.previousPageUrl1 = res.segment1.prev_page_url;
            this.currentPage1 = res.segment1.current_page;
            if(this.nextPageUrl1 == null) 
              this.disableNext1 = true;
            else 
              this.disableNext1 = false;
            if(this.previousPageUrl1 == null) 
              this.disablePrev1 = true;
            else
              this.disablePrev1 = false;
            // Segment 2
            this.transactionList2 = res.segment2.data;
            this.nextPageUrl2 = res.segment2.next_page_url;
            this.previousPageUrl2 = res.segment2.prev_page_url;
            this.currentPage2 = res.segment2.current_page;
            if(this.nextPageUrl2 == null) 
              this.disableNext2 = true;
            else 
              this.disableNext2 = false;
            if(this.previousPageUrl2 == null) 
              this.disablePrev2 = true;
            else
              this.disablePrev2 = false;
            // Segment 3
            this.transactionList3 = res.segment3.data;
            this.nextPageUrl3 = res.segment3.next_page_url;
            this.previousPageUrl3 = res.segment3.prev_page_url;
            this.currentPage3 = res.segment3.current_page;
            if(this.nextPageUrl3 == null) 
              this.disableNext3 = true;
            else 
              this.disableNext3 = false;
            if(this.previousPageUrl3 == null) 
              this.disablePrev3 = true;
            else
              this.disablePrev3 = false;
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


  exportExcel(): void 
  {
    var dataForExcel = [];
    var dataForExcel2 = [];
    var dataForExcel3 = [];
    var Heading = ['TRANSACTION ID', 'POST ID','JOBS','PAY BY', 'PAY TO', 'DATE', 'AMOUNT (MYR)', 'CHARGES (MYR)', 'PAY (MYR)', 'BANK NAME', 'ACCOUNT NO', 'BENEFICIARY NAME'];
    var Heading2 = ['TRANSACTION ID', 'ADVERTISEMENT ID','TITLE','PAY BY', 'DATE', 'AMOUNT (MYR)'];
    var Heading3 = ['TRANSACTION ID', 'VACANCY ID','TITLE','PAY BY', 'DATE', 'AMOUNT (MYR)'];
    this.transactionList1.forEach((row: any) => {
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
    });
    this.transactionList2.forEach((row: any) => {
      var data = [];
      data.push(row['tran_id']);
      data.push(row['advertise_id']);
      data.push(row['title']);
      data.push(row['pay_by_name']);
      data.push(row['pay_date']);
      data.push(row['amount']);
      dataForExcel2.push(data)
    });
    this.transactionList3.forEach((row: any) => {
      var data = [];
      data.push(row['tran_id']);
      data.push(row['vacancy_id']);
      data.push(row['title']);
      data.push(row['pay_by_name']);
      data.push(row['pay_date']);
      data.push(row['amount']);
      dataForExcel3.push(data)
    })
    let reportData = {
      title: 'Transaction History',
      data: [dataForExcel, dataForExcel2, dataForExcel3],
      header: [Heading, Heading2, Heading3],
      worksheets: ['Segment 1', 'Segment 2', 'Segment 3']
    } 
    this.ete.exportExcel(reportData);			
  }
}
