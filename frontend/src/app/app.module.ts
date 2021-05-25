import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontService } from './front.service';
import { PatientlistComponent } from './patientlist/patientlist.component';
import { DoctorslotComponent } from './doctorslot/doctorslot.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientlistComponent,
    DoctorslotComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [FrontService],
  bootstrap: [AppComponent]
})
export class AppModule { }
