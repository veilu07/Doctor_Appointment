import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map,catchError, retry } from 'rxjs/operators';
import { backendHost }from './host/host'

@Injectable({
  providedIn: 'root'
})

export class FrontService {

  constructor(private http:HttpClient) { 
  }

  public postData(routePath:string,details:any):Observable<any>{
  	var data:any = this.http.post(backendHost+routePath,details)
  	return data;
  }

  public getData(routePath:string):Observable<any>{
  	var data:any = this.http.get(backendHost+routePath)
  	return data;
  }
}
