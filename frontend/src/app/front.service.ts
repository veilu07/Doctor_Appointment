import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map,catchError, retry } from 'rxjs/operators';
import { backendHost }from './host/host'
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})

export class FrontService {

  constructor(private http:HttpClient,
              public toastr:ToastrService,
              private loader:NgxUiLoaderService) { 
  }

  public postData(routePath:string,details:any):Observable<any>{
  	var data:any = this.http.post(backendHost+routePath,details)
  	return data;
  }

  public getData(routePath:string):Observable<any>{
  	var data:any = this.http.get(backendHost+routePath)
  	return data;
  }

  startLoader(){
    this.loader.start()
  }

  stopLoader(){
    this.loader.stop()
  }

  showToaster(type:String,message:any){
    type == 'success' ? this.toastr.success(message,'Success') :type == 'error' ? this.toastr.error(message,'Warning') : this.toastr.info(message,'Info');
  }
}
