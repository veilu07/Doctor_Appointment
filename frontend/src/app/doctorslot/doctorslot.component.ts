import { Component, OnInit, TemplateRef  } from '@angular/core';
import { FrontService } from '../front.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { faCoffee, faCloudSun, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';


declare var require:any;

var timeSlot = require("time-slots-generator");


@Component({
  selector: 'app-doctorslot',
  templateUrl: './doctorslot.component.html',
  styleUrls: ['./doctorslot.component.css']
})
export class DoctorslotComponent implements OnInit {
  timeDiff:Number          = 30;
  mrgShift                 = '09.00 - 14.00'
  eveShift                 = '16.00 - 21.00'
  bsInlineValue:Date       = new Date();  
  timeObject:Object        = {}
  slotFormData:any         = {'from':'','to':'',enable:true,slotDate:new Date()}
  timeKeyArray:any         = [];
  fromtimeValueArray:any   = [];
  totimeValueArray:any     = [];
  getAllSlots:any          = [];
  minDate:Date 		         = new Date();  
  mrngTimeSlots:any        = [];
  eveTimeSlots:any         = [];
  modalRef: any;
  

    constructor(private service : FrontService,              
              private modalService: BsModalService) {     
    this.minDate.setDate(this.minDate.getDate());	 
  }

  ngOnInit(){
    this.service.startLoader()    
 	  this.timeObject = timeSlot.getTimeSlots([ [30,510],[870,930],[1290,1440]],true, "half", false, false) 	  
     console.log('timeObject',this.timeObject);
     if(this.timeObject && typeof this.timeObject != "undefined"){
       this.fromtimeValueArray = Object.values(this.timeObject);
       this.timeKeyArray       = Object.keys(this.timeObject);       
     } 	
     else{
       this.fromtimeValueArray = [];
       this.timeKeyArray       = [];
     }
  }

  createSlot(form:NgForm,addSlot:any){    
    if( form.valid ){
      this.service.startLoader()
      var path:any = 'doctor/createSlot';
      this.service.postData(path,this.slotFormData).subscribe((result:any)=>{
          if( result.status == 200 ){
            this.service.showToaster('success',result.message)
            this.slotFormData.enable = true;
            this.slotFormData.from   = '';
            this.modalRef.hide()
            this.getAllSlots.push(result.data.slots)
            this.sortSlots()
            this.service.stopLoader()  
          }
          else{
            this.service.showToaster('error',result.message)            
            this.service.stopLoader()  
          }
      })
    }
    else{
      this.service.showToaster('error','Please fill all fields')
    }
  }

  openSlotModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
 }

  changeDate(event:any){    
    this.service.startLoader()
    this.slotFormData.slotDate = new Date(event);
    var path:any = 'doctor/listAllSlotByDate';
    this.service.postData(path,{'date':this.slotFormData.slotDate}).subscribe((result:any)=>{      
      if( result.status == 200 ){
        this.getAllSlots   = [];
        this.eveTimeSlots  = [];
        this.mrngTimeSlots = [];
        this.getAllSlots   = result.data.slots;
        this.sortSlots()        
        this.service.stopLoader()
      } 
      else if( result.status == 422 ){
        this.getAllSlots   = [];
        this.eveTimeSlots  = [];
        this.mrngTimeSlots = [];
        this.service.stopLoader()
      }      
      else{
        this.getAllSlots   = [];
        this.eveTimeSlots  = [];
        this.mrngTimeSlots = [];
        this.service.showToaster('error',result.message)
        this.service.stopLoader()
      }
    });    
  }

  changeFromTime(value:any){
    var values:any  = value.viewModel;       
    if( !values || values ==  '' ){
      this.slotFormData.enable = true;      
    }

    else{
      var index:any                    = this.fromtimeValueArray.indexOf(values);      
      var findFromArray                = this.timeKeyArray.flat();    
      var findKeyValue                 = findFromArray[index]      
      this.slotFormData.fromTimeValue  = values;
      this.slotFormData.fromTimeKey    = findKeyValue;

      /* TO TIME VALUE */
      var findkeyNextValue           = findFromArray[index+1];
      var findToArray                = this.fromtimeValueArray.flat();    
      this.slotFormData.toTimeValue  = findToArray[index+1];      
      if(findkeyNextValue){
        this.slotFormData.toTimeKey    = findkeyNextValue;      
        this.slotFormData.enable       = false;
      }
      else{
        this.slotFormData.enable       = true;
        this.service.showToaster('error','You have to choose closing time.Kindly choose valid time')
      }  
    }
  }

  sortSlots(){
    const max = this.getAllSlots.sort(function(prev:any, current:any) {        
      return (Number(prev.fromTimeKey) - Number(current.fromTimeKey))
    })    
    var slotsCopy:any = this.getAllSlots;
    this.mrngTimeSlots     = slotsCopy.filter(function(data:any){
      return Number(data.fromTimeKey) <= 840
    })
    this.eveTimeSlots     = slotsCopy.filter(function(data:any){
      return Number(data.fromTimeKey) >= 840
    })
  }
}
