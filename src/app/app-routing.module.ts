import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsComponent } from './jobs/jobs.component';
import { UsersComponent } from './users/users.component';
import { SignInUpComponent } from './sign-in-up/sign-in-up.component';
import { ViewEditUserComponent } from './users/view-edit-user/view-edit-user.component';
import { ViewEditJobComponent } from './jobs/view-edit-job/view-edit-job.component';
import { TasksComponent } from './tasks/tasks.component';
import { ViewTaskComponent } from './tasks/view-task/view-task.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NotificationComponent } from './notification/notification.component';
import { PlatformChargesComponent } from './platform-charges/platform-charges.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { PaymentConfigComponent } from './payment-config/payment-config.component';
import { ViewEditAdsComponent } from './ads/view-edit-ads/view-edit-ads.component';
import { AdsComponent } from './ads/ads.component';
import { ViewEditVacancyComponent } from './vacancy/view-edit-vacancy/view-edit-vacancy.component';
import { VacancyComponent } from './vacancy/vacancy.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: SignInUpComponent },
  { path: 'users/view-edit-user', component: ViewEditUserComponent },
  { path: 'jobs/view-edit-job', component: ViewEditJobComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'tasks/view-task', component: ViewTaskComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'payment-config', component: PaymentConfigComponent },
  { path: 'transaction-history', component: TransactionHistoryComponent },
  { path: 'ads', component: AdsComponent },
  { path: 'ads/view-edit-ads', component: ViewEditAdsComponent },
  { path: 'vac', component: VacancyComponent },
  { path: 'vac/view-edit-vac', component: ViewEditVacancyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
