import { Component, OnInit,OnDestroy } from '@angular/core';
import { FrontService } from '../front.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css']
})
export class PatientlistComponent implements OnInit,OnDestroy {
  bsInlineValue:Date       = new Date();  
  selectDate               = new Date();
  todayPatientList:any     = [];
  historyPatientList:any   = [];    
  dtOptions: DataTables.Settings = {};
  dtOptions1: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger1: Subject<any> = new Subject<any>();

  constructor(private service : FrontService) { 
  	
  }

  ngOnInit() {    
    this.dtOptions = {      
      columns: [{
        title: 'S.No',
      }, {
        title: 'Token No'        
      }, {
        title: 'patient Name'        
      }, {
        title: 'Phone Number'        
      }, {
        title: 'Slot Time'        
      }],
      searching:false,
      paging:false
    };
    this.dtOptions1 = {      
      columns: [{
        title: 'S.No',
      }, {
        title: 'Token No'        
      }, {
        title: 'patient Name'        
      }, {
        title: 'Phone Number'        
      }, {
        title: 'Slot Time'        
      }],
      searching:false,
      paging:false
    };
  }

  changeDate(event:any){    
    this.selectDate = new Date(event);
    var path:any = 'patient/getPatientAppointmentsByDate';
    this.service.postData(path,{'date':this.selectDate}).subscribe((result:any)=>{            
      if( result.status == 200 ){
        this.todayPatientList     = [];
        this.historyPatientList   = [];        
        result.validation == 1 ? this.todayPatientList = result.data : this.historyPatientList = result.data;
        this.dtTrigger.next();
        this.dtTrigger1.next();

      }
      else if( result.status == 422 ){
        this.todayPatientList     = [];
        this.historyPatientList   = [];
        
      }
      else{
        this.todayPatientList     = [];
        this.historyPatientList   = [];
        
      }
    });
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtTrigger1.unsubscribe();
  }
}
