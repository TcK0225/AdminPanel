import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { UsersComponent } from './users/users.component';
import { SignInUpComponent } from './sign-in-up/sign-in-up.component';
import { ViewEditUserComponent } from './users/view-edit-user/view-edit-user.component';
import { ViewEditJobComponent } from './jobs/view-edit-job/view-edit-job.component';
import { TasksComponent } from './tasks/tasks.component';
import { ViewTaskComponent } from './tasks/view-task/view-task.component';

import { GlobalVariable } from './global-variables';
import { GlobalFunction } from './global-functions';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { RatingModule } from 'ng-starrating';
import { TransactionsComponent } from './transactions/transactions.component';
import { NotificationComponent } from './notification/notification.component';
import { PlatformChargesComponent } from './platform-charges/platform-charges.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { HttpClientModule } from '@angular/common/http';
import { PaymentConfigComponent } from './payment-config/payment-config.component';
import { ViewEditAdsComponent } from './ads/view-edit-ads/view-edit-ads.component';
import { AdsComponent } from './ads/ads.component';
import { VacancyComponent } from './vacancy/vacancy.component';
import { ViewEditVacancyComponent } from './vacancy/view-edit-vacancy/view-edit-vacancy.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NoSanitizePipe } from './util/nosanitizerpipe';

const firebaseConfig = {
  apiKey: 'AIzaSyBZlW1h3h8rrd-ZyztvOaw8KY3O1WNrJ6U',
  authDomain: 'jobs-it-sdn-bhd.firebaseapp.com',
  databaseURL: 'https://jobs-it-sdn-bhd.firebaseio.com',
  projectId: 'jobs-it-sdn-bhd',
  storageBucket: 'jobs-it-sdn-bhd.appspot.com',
  messagingSenderId: '782282447376',
  appId: '1:782282447376:web:6046738660c1bf5c28c895',
  measurementId: 'G-M7N2XER8C4'
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    JobsComponent,
    UsersComponent,
    SignInUpComponent,
    ViewEditUserComponent,
    ViewEditJobComponent,
    TasksComponent,
    ViewTaskComponent,
    TransactionsComponent,
    NotificationComponent,
    PlatformChargesComponent,
    TransactionHistoryComponent,
    PaymentConfigComponent,
    ViewEditAdsComponent,
    AdsComponent,
    VacancyComponent,
    ViewEditVacancyComponent,
    NoSanitizePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    NgxSpinnerModule,
    NgxSliderModule,
    ToastrModule.forRoot(),
    Ng2SearchPipeModule,
    NgxPaginationModule,
    RatingModule,
    AngularFireStorageModule,
    HttpClientModule,
    CKEditorModule,
    ReactiveFormsModule
  ],
  providers: [
    GlobalVariable,
    GlobalFunction
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
