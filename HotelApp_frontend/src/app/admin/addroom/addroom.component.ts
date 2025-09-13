import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addroom',
  imports: [FormsModule, CommonModule],
  templateUrl: './addroom.component.html',
  styleUrl: './addroom.component.css',
})
export class AddroomComponent {
  roomDetails = {
    imageUrl: null,
    type: '',
    roomNumber: '',
    pricePerNight: '',
    capacity: '',
    description: '',
  };

  file: File | null = null;
  preview: string | null = null;
  roomTypes: string[] = [];
  newRoomType: string = '';
  error: any = null;
  success: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRoomType();
  }
  showError(msg: string) {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }
  fetchRoomType() {
    this.apiService.getRoomType().subscribe({
      next: (types: string[]) => {
        this.roomTypes = types;
      },
      error: (err) => {
        this.showError(
          err?.error?.message || 'Error fetching room types: ' + err
        );
      },
    });
  }

  handleChange(event: Event) {
    const { name, value } = <HTMLInputElement>event.target;
    this.roomDetails = { ...this.roomDetails, [name]: value };
  }
  handleRoomTypeChange(event: Event) {
    this.roomDetails.type = (<HTMLSelectElement>event.target).value;
  }

  handleFileChange(event: Event) {
    const input = <HTMLInputElement>event.target;
    const selectedFile = input.files ? input.files[0] : null;
    if (selectedFile) {
      this.file = selectedFile;
      this.preview = URL.createObjectURL(selectedFile);
    } else {
      this.file = null;
      this.preview = null;
    }
  }
  addRoom() {
    if (
      !this.roomDetails.type ||
      !this.roomDetails.pricePerNight ||
      !this.roomDetails.capacity ||
      !this.roomDetails.roomNumber
    ) {
      this.showError('All room details must be provided.');
      return;
    }
    if (!window.confirm('Do you want to add this room?')) {
      return;
    }
    const formData = new FormData();
    formData.append('type', this.roomDetails.type);
    formData.append('pricePerNight', this.roomDetails.pricePerNight);
    formData.append('capacity', this.roomDetails.capacity);
    formData.append('roomNumber', this.roomDetails.roomNumber);
    formData.append('description', this.roomDetails.description);

    if (this.file) {
      formData.append('imageFile', this.file);
    }

    this.apiService.addRoom(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.success = 'Room Added successfully.';
        setTimeout(() => {
          this.success = '';
          this.router.navigate(['/admin/manage-rooms']);
        }, 5000);
      },
      error: (error) => {
        console.log(error);
        this.showError(error?.error?.message || 'Error adding room');
      },
    });
  }
}
