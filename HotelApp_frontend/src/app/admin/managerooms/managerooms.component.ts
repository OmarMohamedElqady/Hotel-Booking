import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomsearchComponent } from '../../roomsearch/roomsearch.component';
import { RoomresultComponent } from '../../roomresult/roomresult.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-managerooms',
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    RoomresultComponent,
  ],
  templateUrl: './managerooms.component.html',
  styleUrl: './managerooms.component.css',
})
export class ManageroomsComponent {
  rooms: any[] = [];
  filteredRooms: any[] = [];
  roomTypes: string[] = [];
  selectedRoomType: string = '';
  currentPage: number = 1;
  roomsPerPage: number = 5;
  error: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchRooms();
    this.fetchRoomTypes();
  }

  showError(msg: string) {
    this.error = msg;
    setTimeout(() => {
      this.error = '';
    }, 4000);
  }

  fetchRooms() {
    this.apiService.getAllRooms().subscribe({
      next: (response: any) => {
        this.rooms = response.rooms;
        this.filteredRooms = response.rooms;
      },
      error: (error) => {
        this.showError('Error fetching rooms:' + error);
      },
    });
  }
  fetchRoomTypes() {
    this.apiService.getRoomType().subscribe({
      next: (types: string[]) => {
        this.roomTypes = types;
      },
      error: (error) => {
        this.showError('Error fetching room types: ' + error);
      },
    });
  }
  handleRoomTypeChange(event: any) {
    const selectedType = event.target.value;
    this.selectedRoomType = selectedType;
    this.filterRooms(selectedType);
  }

  filterRooms(type: string) {
    if (type === '') {
      this.filteredRooms = this.rooms;
    } else {
      this.filteredRooms = this.rooms.filter((room) => room.type === type);
    }
    this.currentPage = 1;
  }

  get indexOfLastRoom() {
    return this.currentPage * this.roomsPerPage;
  }

  get indexOfFirstRoom() {
    return this.indexOfLastRoom - this.roomsPerPage;
  }

  get currentRoom() {
    return this.filteredRooms.slice(
      this.indexOfFirstRoom,
      this.indexOfLastRoom
    );
  }

  paginate(pageNumber: number) {
    this.currentPage = pageNumber;
  }
  navigateToAddRoom() {
    this.router.navigate(['/admin/add-room']);
  }
}
