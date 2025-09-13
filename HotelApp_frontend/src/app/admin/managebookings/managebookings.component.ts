import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-managebookings',
  imports: [PaginationComponent, CommonModule, FormsModule],
  templateUrl: './managebookings.component.html',
  styleUrl: './managebookings.component.css',
})
export class ManagebookingsComponent {
  bookings: any[] = []; // store all bookings
  filteredBookings: any[] = []; // store filtered bookings based on search term
  searchTerm: string = '';
  currentPage: number = 1;
  bookingPerPage: number = 3;
  error: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.apiService.getAllBookings().subscribe({
      next: (response: any) => {
        this.bookings = response.bookings || [];
        this.filteredBookings = this.bookings;
      },
      error: (error) => {
        this.error('Error fetching bookings: ', error.message);
      },
    });
  }

  handleSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter((booking) =>
        booking.bookingReference
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  get currentBookings(): any[] {
    const indexOfLastBooking = this.currentPage * this.bookingPerPage;
    const indexOfFirstBooking = indexOfLastBooking - this.bookingPerPage;
    return this.filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  }

  manageBooking(bookingReference: string): void {
    this.router.navigate([`/admin/edit-booking/${bookingReference}`]);
  }
}
