import { Component, OnInit } from '@angular/core';
import { FrontService } from '../front.service';

declare var require:any;

var ts = require("time-slots-generator");


@Component({
  selector: 'app-doctorslot',
  templateUrl: './doctorslot.component.html',
  styleUrls: ['./doctorslot.component.css']
})
export class DoctorslotComponent implements OnInit {

  constructor(private service : FrontService) { }

  ngOnInit(): void {
 	var d:any = ts.getTimeSlots([],true, "half", false, false)
 	console.log("d",d)
 	
  }


  createSlot(){

  }
}
