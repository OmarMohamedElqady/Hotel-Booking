package com.example.HotelBooking.dtos;

import com.example.HotelBooking.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    // generic
    private int status;
    private String message;

    // for login
    private String token;
    private UserRole role;
    private boolean active;
    private String expirationTime;

    //user data
    private UserDTO user;
    private List<UserDTO> users;

    //booking data
    private BookingDTO booking;
    private List<BookingDTO> bookings;

    //room data
    private RoomDTO room;
    private List<RoomDTO> rooms;

    //room payments
    private String transactionId;
    private PaymentDTO payment;
    private List<PaymentDTO> payments;

    //room payments
    private NotificationDTO notification;
    private List<NotificationDTO> notifications;

    private final LocalDateTime timestamp = LocalDateTime.now();

}
