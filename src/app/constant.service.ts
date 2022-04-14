import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  readonly baseUrl: string = 'http://v2.jobsit.com.my/';
  // readonly baseUrl: string = 'http://192.168.0.193:8000/'

  constructor() { }

  removeEmptyStringsFrom = (obj) => Object
      .entries({ ...obj })
      .filter(([key, val]) => val !== null)
      .reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {});
}
