import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientlistComponent } from './patientlist/patientlist.component';
import { DoctorslotComponent } from './doctorslot/doctorslot.component';

const routes: Routes = [
	{path:'',component:PatientlistComponent},
	{path:'slot',component:DoctorslotComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
