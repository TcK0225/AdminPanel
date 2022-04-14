import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVariable {
  public fireCol = 'JOBS_IT_DEV';
  public fireDoc = 'hH03mmFJ8Tb2sbPEkRr3';

  public clickedUser = '';  // USER_ID
  public clickedPost = '';  // USER_ID
  public clickedAds = '';  // ADS_ID
  public clickedVac = '';  // VAC_ID
  public subscribeDoc = '';  // DOC NAME

  public currentPageURL = '';
  public authUserInfo: any = {
    FULL_NAME: '',
    ROLE: '',
    USER_ID: '',
    PROFILE_IMAGE_URL: '',
    STATUS: true
  };

  public loadSpinner = true;
  public accountantRole: boolean = false;

  // Internet Connection Error Message
  public internetError = 'Please check your internet connection and try again.';
  public loggingError = 'Please login before continuing.';
}
