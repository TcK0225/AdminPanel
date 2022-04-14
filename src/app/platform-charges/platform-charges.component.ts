import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from '../global-variables';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-platform-charges',
  templateUrl: './platform-charges.component.html',
  styleUrls: ['./platform-charges.component.css']
})
export class PlatformChargesComponent implements OnInit {

  public ref: any;

  public chargesArray = [];

  public chargesPage = 1;

  public transactionID: string;

  constructor(private globalVar: GlobalVariable, private afs: AngularFirestore) {
    this.globalVar.currentPageURL = 'platform-charges';
    this.ref = afs.collection('JOBS_IT_DEV').doc('hH03mmFJ8Tb2sbPEkRr3');
  }

  ngOnInit(): void {
    this.getChargesDetails();
  }

  getChargesDetails() {
    this.ref.collection('PLATFORM_CHARGES', ref => ref.orderBy('DATE', 'desc')).get().subscribe(resp => {
      resp.forEach(async element => {
        this.transactionID = element.get('TRAN_ID');
        const amount = element.get('AMOUNT');
        const date = element.get('DATE');
        const status = element.get('STATUS');
        const userID = element.get('OWED_BY');
        const transID = element.get('TRAN_ID');
        this.getNameAndSaveToArray(amount, date, status, userID, transID);
      });
    });
  }

  getNameAndSaveToArray(amount: string, date: string, status: string, userID: string, transID: string) {
    this.ref.collection('REGISTERED_USERS', ref => ref.where('USER_ID', '==', userID)).get().subscribe(resp => {
      resp.forEach(element => {
        this.chargesArray.push({
          userName: element.get('FULL_NAME'),
          amount: amount,
          date: date,
          status: status,
          transID: transID
        });
      });
    });
  }

  trackItem(index, item: any) {
    return item.transactionID;
  }

}
