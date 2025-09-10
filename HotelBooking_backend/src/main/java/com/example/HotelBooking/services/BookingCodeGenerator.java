package com.example.HotelBooking.services;

import com.example.HotelBooking.entities.BookingReference;
import com.example.HotelBooking.repositories.BookingReferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class BookingCodeGenerator {
    private final BookingReferenceRepository bookingReferenceRepository;

    public String generateBookingReference() {
        String bookingReference;
        do {
            bookingReference = generateRandomAlphanumbericCode(10); // generate a unique code of length 10
        } while (isBookingReferenceExist(bookingReference));

            saveBookingReferenceToDatabase(bookingReference);
            return bookingReference;
    }

    private String generateRandomAlphanumbericCode(int length){
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWQYZ123456789";

        Random random = new Random();

        StringBuilder stringBuilder = new StringBuilder(length);

        for (int i = 0; i<length; i++){
            int index = random.nextInt(characters.length());
            stringBuilder.append(characters.charAt(index));
        }
        return stringBuilder.toString();

    }

    private boolean isBookingReferenceExist(String bookingReference){
        return bookingReferenceRepository.findByReferenceNo(bookingReference).isPresent();
    }

    private void saveBookingReferenceToDatabase(String bookingReference){
        BookingReference bookingReferenceToSave = BookingReference
                .builder()
                .referenceNo(bookingReference)
                .build();

        bookingReferenceRepository.save(bookingReferenceToSave);
    }


}
