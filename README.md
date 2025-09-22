# 🏨 Hotel Booking Application

## 📌 Overview
This is a **Full-Stack Hotel Booking Web Application** that allows users to browse hotels, check available rooms, make reservations, and manage bookings.  
The project includes both **frontend** and **backend**, providing a complete solution for hotel management and user booking.

---

## ✨ Features

### User
- Browse available hotels and rooms.
- View detailed room information (price, amenities, availability).
- Book rooms with date selection.
- Modify or cancel existing bookings.
- View booking history.

### Admin
- Add, edit, or delete hotels and rooms.
- Manage reservations and customers.
- Secure authentication and authorization.

---

## 🛠 Tech Stack
- **Frontend:** Angular  
- **Backend:** Spring Boot (Java)  
- **Database:** MySQL  
- **Authentication:** JWT (JSON Web Token)  
- **Build Tools:** Maven (backend), Angular CLI (frontend)
- **Online payment gateway:** Stripe
---

## 📂 Project Structure
```bash
Hotel-Booking/
│── HotelBooking_backend/ # Spring Boot backend
│ ├── src/main/java/com/hotel/ # Controllers, Entities, Services
│ ├── src/main/resources/ # Configs & Properties
│ └── pom.xml # Maven dependencies
│
│── HotelApp_frontend/ # Angular frontend
│ ├── src/app/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Booking pages
│ │ ├── services/ # API calls
│ │ └── models/ # Interfaces
│ ├── angular.json # Angular config
│ └── package.json # Dependencies
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/OmarMohamedElqady/Hotel-Booking.git
cd Hotel-Booking
```

### 2️⃣ Backend Setup (Spring Boot)
```bash
cd HotelBooking_backend
# Configure MySQL database in application.properties
mvn spring-boot:run
```
### 3️⃣ Frontend Setup (Angular)
```bash
cd HotelApp_frontend
npm install
ng serve -o
```

### 4️⃣ Access the App

Frontend: http://localhost:4200

Backend API: http://localhost:8080


## 🚀 Future Improvements

Advanced search & filtering for rooms.

Multi-language support.

Dockerize full application for deployment.

## 👨‍💻Author

#### Omar Mohamed Elqady
Full-Stack Developer | Angular • Spring Boot • SQL/NoSQL


