import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomdetailsComponent } from './roomdetails/roomdetails.component';
import { FindbookingComponent } from './findbooking/findbooking.component';
import { AdminhomeComponent } from './admin/adminhome/adminhome.component';
import { ManageroomsComponent } from './admin/managerooms/managerooms.component';
import { AddroomComponent } from './admin/addroom/addroom.component';
import { EditroomComponent } from './admin/editroom/editroom.component';
import { PaymentpageComponent } from './payment/paymentpage/paymentpage.component';
import { PaymentsuccessComponent } from './payment/paymentsuccess/paymentsuccess.component';
import { PaymentfailureComponent } from './payment/paymentfailure/paymentfailure.component';
import { ManagebookingsComponent } from './admin/managebookings/managebookings.component';
import { UpdatebookingComponent } from './admin/updatebooking/updatebooking.component';
import { AdminregisterComponent } from './admin/adminregister/adminregister.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: HomeComponent },

  { path: 'rooms', component: RoomsComponent },
  { path: 'room-details/:id', component: RoomdetailsComponent },
  { path: 'find-booking', component: FindbookingComponent },

  //ADMIN ROUTES OR PAGES
  {
    path: 'admin',
    component: AdminhomeComponent,
    data: { requireAdmin: true },
  },
  {
    path: 'admin/manage-rooms',
    component: ManageroomsComponent,
    data: { requireAdmin: true },
  },

  {
    path: 'admin/add-room',
    component: AddroomComponent,
    data: { requireAdmin: true },
  },

  {
    path: 'admin/edit-room/:id',
    component: EditroomComponent,
    data: { requireAdmin: true },
  },

  {
    path: 'admin/manage-bookings',
    component: ManagebookingsComponent,
    data: { requireAdmin: true },
  },

  {
    path: 'admin/edit-booking/:bookingCode',
    component: UpdatebookingComponent,
    data: { requireAdmin: true },
  },
  {
    path: 'admin/admin-register',
    component: AdminregisterComponent,
    data: { requireAdmin: true },
  },

  { path: 'edit-profile', component: EditprofileComponent },

  //PAYMENT ROUTES
  {
    path: 'payment/:bookingReference/:amount',
    component: PaymentpageComponent,
  },
  {
    path: 'payment-success/:bookingReference',
    component: PaymentsuccessComponent,
  },
  {
    path: 'payment-failure/:bookingReference',
    component: PaymentfailureComponent,
  },

  { path: '**', redirectTo: 'home' },
];
