import { Component, OnInit } from '@angular/core';
import { FrontService } from '../front.service';

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css']
})
export class PatientlistComponent implements OnInit {

  constructor(private service : FrontService) { 
  	// this.getPatientList();
  }

  ngOnInit(): void {
  }

  getPatientList(){
  	var path:any = 'doctor/checkget';
  	this.service.postData(path,{"name":"Veilu"}).subscribe((res:any)=>{
  		
  	});	
  }
}
