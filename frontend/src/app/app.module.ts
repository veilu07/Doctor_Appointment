import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontService } from './front.service';
import { PatientlistComponent } from './patientlist/patientlist.component';
import { DoctorslotComponent } from './doctorslot/doctorslot.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule,NgxUiLoaderConfig,SPINNER,POSITION,PB_DIRECTION} from "ngx-ui-loader";
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from "angular-datatables";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {  
  bgsPosition: POSITION.bottomCenter,
  bgsSize    : 40,
  bgsType    : SPINNER.doubleBounce, 
  fgsType    : SPINNER.ballSpinFadeRotating, 
  pbDirection: PB_DIRECTION.leftToRight, 
  pbThickness: 5,
};

const toastConfig =  {
  timeOut          : 2000,
  preventDuplicates: true,
  progressBar:true
};


@NgModule({
  declarations: [
    AppComponent,
    PatientlistComponent,
    DoctorslotComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTabsModule,
    FontAwesomeModule,
    FormsModule,
    ToastrModule.forRoot(toastConfig),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [FrontService],
  bootstrap: [AppComponent]
})
export class AppModule { }
