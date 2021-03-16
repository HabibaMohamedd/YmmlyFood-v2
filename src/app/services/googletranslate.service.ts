import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleObj } from '../models/translated';

@Injectable({
  providedIn: 'root',
})
export class GoogletranslateService {
  url = 'https://translation.googleapis.com/language/translate/v2?key=';
  key = 'AIzaSyC_cxvMw_nc8E817rKtv7eSWC2WR8mRitk';
  constructor(private http: HttpClient) {}
  translate(obj: GoogleObj) {
    return this.http.post(this.url + this.key, obj);
  }
}
