import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editprofile',
  imports: [CommonModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.css',
})
export class EditprofileComponent implements OnInit {
  user: any = null;
  error: any = null;

  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.apiService.myProfile().subscribe({
      next: (response: any) => {
        this.user = response.user;
        console.log(this.user);
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Error fetching user profile');
      },
    });
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }

  handleDeleteProfile(): void {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? if you delete your account, you will lose your account...'
      )
    ) {
      return;
    }
    this.apiService.deleteAccount().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Error Deleteing account');
      },
    });
  }
}
