package com.example.HotelBooking.payments.stripe.dto;

import com.example.HotelBooking.dtos.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<Response> initializePayment(@RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(paymentService.initializePayment(paymentRequest));
    }

    @PutMapping("/update")
    public void  updatePaymentBooking(@RequestBody PaymentRequest paymentRequest){
        paymentService.updatePaymentBooking(paymentRequest);
    }

}
