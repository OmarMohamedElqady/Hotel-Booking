import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { every } from 'rxjs';

@Component({
  selector: 'app-updatebooking',
  imports: [FormsModule, CommonModule],
  templateUrl: './updatebooking.component.html',
  styleUrl: './updatebooking.component.css',
})
export class UpdatebookingComponent {
  bookingCode: string = '';
  bookingDetails: any = null;

  formState = {
    id: '',
    bookingStatus: '',
    paymentStatus: '',
  };
  message = '';
  error = '';

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.bookingCode =
      this.activatedRoute.snapshot.paramMap.get('bookingCode') || '';
    this.fetchBookingDetails();
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = '';
    }, 4000);
  }

  fetchBookingDetails(): void {
    this.apiService.getBookingByReference(this.bookingCode).subscribe({
      next: (response: any) => {
        this.bookingDetails = response.booking;
        this.formState = {
          id: this.bookingDetails.id,
          bookingStatus: this.bookingDetails.bookingStatus || '',
          paymentStatus: this.bookingDetails.paymentStatus || '',
        };
        console.log('Response details: ', response.booking);
      },
      error: (error) => {
        this.showError(error.error?.message || error.message);
      },
    });
  }

  handleChange(event: any) {
    const { name, value } = event.target;
    this.formState = { ...this.formState, [name]: value };
  }

  handleUpdate(): void {
    if (!this.formState.bookingStatus && !this.formState.paymentStatus) {
      this.showError('Please update at least one field.');
      return;
    }

    this.apiService.updateBooking(this.formState).subscribe(
      () => {
        this.message = 'Booking updated successfully';
        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/admin-manage-bookings']);
        }, 3000);
      },
      (error) => {
        this.showError(error.error?.message || error.message);
      }
    );
  }

  get isLoading(): boolean {
    return !this.bookingDetails;
  }
}
