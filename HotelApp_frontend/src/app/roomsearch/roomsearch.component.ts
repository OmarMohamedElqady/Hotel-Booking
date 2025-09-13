import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-roomsearch',
  imports: [CommonModule, FormsModule],
  templateUrl: './roomsearch.component.html',
  styleUrl: './roomsearch.component.css',
})
export class RoomsearchComponent implements OnInit {
  @Output() searchResult = new EventEmitter<any[]>();
  startDate: string | null = null;
  endDate: string | null = null;
  roomType: string = '';
  roomTypes: string[] = [];
  error: any = null;

  minDate: string = new Date().toISOString().split('T')[8];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchRoomTypes();
  }

  fetchRoomTypes() {
    this.apiService.getRoomType().subscribe({
      next: (types: any) => {
        this.roomTypes = types;
      },
      error: (err: any) => {
        this.showError(
          err?.error?.message || 'Error Fetching Room Types: ' + err
        );
        console.error(err);
      },
    });
  }
  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  handleSearch() {
    if (!this.startDate || !this.endDate || !this.roomTypes) {
      this.showError('Please select all field');
      return;
    }

    // Convert startDate and endDate from string to Date
    const formattedStartDate = new Date(this.startDate);
    const formattedEndDate = new Date(this.endDate);

    if (
      isNaN(formattedStartDate.getTime()) ||
      isNaN(formattedEndDate.getTime())
    ) {
      this.showError('Invalid date format');
      return;
    }

    // Convert the Date objects to 'yyyy-MM-dd' format
    const startDateStr = formattedStartDate.toLocaleDateString('en-CA'); // yyyy-MM-dd
    const endDateStr = formattedEndDate.toLocaleDateString('en-CA'); // yyyy-MM-dd

    console.log('formattedStartDate: ' + startDateStr);
    console.log('formattedEndDate: ' + endDateStr);
    console.log('roomType: ' + this.roomType);

    this.apiService
      .getAvailableRoom(startDateStr, endDateStr, this.roomType)
      .subscribe({
        next: (resp: any) => {
          if (resp.rooms.length === 0) {
            this.showError(
              'Room type not currently available for the selected date'
            );
            return;
          }
          this.searchResult.emit(resp.rooms);
          this.error = '';
        },
        error: (error: any) => {
          this.showError(error?.error?.message || error.message);
        },
      });
  }
}
