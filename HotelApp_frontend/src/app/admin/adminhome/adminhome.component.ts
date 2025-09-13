import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminhome',
  imports: [CommonModule],
  templateUrl: './adminhome.component.html',
  styleUrl: './adminhome.component.css',
})
export class AdminhomeComponent {
  adminName: string = '';
  error: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAdminName();
  }

  fetchAdminName(): void {
    this.apiService.myProfile().subscribe({
      next: (res: any) => {
        this.adminName = res.user.firstName;
      },
      error: (error) => {
        this.error = error.message;
        console.error('Error fetching admin name:', error);
      },
    });
  }

  navigateToManageRooms(): void {
    this.router.navigate(['/admin/manage-rooms']);
  }
  navigateToManageBookings(): void {
    this.router.navigate(['/admin/manage-bookings']);
  }
}
