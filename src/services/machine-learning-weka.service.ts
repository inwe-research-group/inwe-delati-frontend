import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MachineLearningWekaService {    
  readonly URL = 'http://128.199.1.222:8080';
  //readonly URL = 'http://127.0.0.1:5001';
  
  constructor(private http: HttpClient) { }

  //getAlgorithms(){ return this.http.get(this.URL + '/algorithms'); }

  runKmeans(form: any) {
    return this.http.post(this.URL+ '/kmeansweka', form);
  }

}
