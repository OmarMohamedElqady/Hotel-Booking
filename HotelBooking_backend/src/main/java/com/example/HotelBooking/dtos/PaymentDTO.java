package com.example.HotelBooking.dtos;


import com.example.HotelBooking.entities.User;
import com.example.HotelBooking.enums.PaymentGateway;
import com.example.HotelBooking.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentDTO {

    private Long id;
    private BookingDTO booking;

    private String transactionId;

    private BigDecimal amount;

    private PaymentGateway paymentMethod;

    private LocalDateTime paymentDate;

    private PaymentStatus status;

    private String bookingReference;
    private String failureReason;

    private String approveLink;


}
