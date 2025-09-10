package com.example.HotelBooking.payments.stripe.dto;

import com.example.HotelBooking.dtos.NotificationDTO;
import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.entities.Booking;
import com.example.HotelBooking.entities.PaymentEntity;
import com.example.HotelBooking.enums.NotificationType;
import com.example.HotelBooking.enums.PaymentGateway;
import com.example.HotelBooking.enums.PaymentStatus;
import com.example.HotelBooking.exceptions.NotFoundException;
import com.example.HotelBooking.notification.NotificationService;
import com.example.HotelBooking.repositories.BookingRepository;
import com.example.HotelBooking.repositories.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.HotelBooking.notification.NotificationService.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Value("${stripe.api.secret.key}")
    private String secretkey;

    //we are initializing a payment, this will return a unique transaction is called secret which
    // well be used to process,complete the payment in the frontend
    public Response initializePayment(PaymentRequest paymentRequest){
        log.info("Inside createPaymentIntent()");
        Stripe.apiKey = secretkey;

        String bookingReference = paymentRequest.getBookingReference();

        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking Not Found"));

        if (booking.getPaymentStatus() == PaymentStatus.COMPLETED){
            throw new NotFoundException("Payment Already Made For This Booking");
        }

        if (booking.getTotalPrice().compareTo(paymentRequest.getAmount()) != 0){
             throw new NotFoundException("Payment Amount Does Not Tally. Please Contact Our Customer Support Agent");
        }

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequest.getAmount().multiply(BigDecimal.valueOf(100)).longValue())  // converting to cent
                    .setCurrency("usd")
                    .putMetadata("bookingReference", bookingReference)
                    .build() ;

            PaymentIntent intent = PaymentIntent.create(params);
            String uniquetransactionId = intent.getClientSecret();

            return Response.builder()
                    .status(200)
                    .message("success")
                    .transactionId(uniquetransactionId)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error Creating payment unique transaction id");
        }
    }

    public void updatePaymentBooking(PaymentRequest paymentRequest){
        log.info("inside updatePaymentBooking");

        String bookingReference = paymentRequest.getBookingReference();

        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new NotFoundException("Booking Not Found"));

        PaymentEntity payment = new PaymentEntity();
        payment.setPaymentGateway(PaymentGateway.STRIPE);
        payment.setAmount(paymentRequest.getAmount());
        payment.setTransactionId(paymentRequest.getTransactionId());
        payment.setPaymentStatus(paymentRequest.isSuccess() ? PaymentStatus.COMPLETED : PaymentStatus.FAILED );
        payment.setPaymentDate(LocalDateTime.now());
        payment.setBookingReference(bookingReference);
        payment.setUser(booking.getUsers());

        if (!paymentRequest.isSuccess()) {
            payment.setFailureReason(paymentRequest.getFailureReason());
        }

        paymentRepository.save(payment); // save to our payment table

        //create and send notification via email
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(booking.getUsers().getEmail())
                .type(NotificationType.EMAIL)
                .build();

        if (paymentRequest.isSuccess()) {

            booking.setPaymentStatus(PaymentStatus.COMPLETED);
            bookingRepository.save(booking);

            notificationDTO.setSubject("BOOKING PAYMENT SUCCESSFUL");
            notificationDTO.setBody("Congratulations!! Your payment for booking with reference: " + bookingReference + "is successful");
            notificationService.sendEmail(notificationDTO);

        }else {

            booking.setPaymentStatus(PaymentStatus.FAILED);
            bookingRepository.save(booking);  //UPDATE THE BOOKING

            notificationDTO.setSubject("BOOKING PAYMENT FAILED");
            notificationDTO.setBody("Your payment for booking with reference: " + bookingReference + " failed with reason: " + paymentRequest.getFailureReason());
            notificationService.sendEmail(notificationDTO);

        }

    }

}
