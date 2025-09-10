package com.example.HotelBooking;

import com.example.HotelBooking.dtos.NotificationDTO;
import com.example.HotelBooking.notification.NotificationService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@RequiredArgsConstructor
public class HotelBookingApplication {

	private final NotificationService notificationService;

	public static void main(String[] args) {
		SpringApplication.run(HotelBookingApplication.class, args);
	}

	@PostConstruct
	public void sendDummyEmail(){
		NotificationDTO notificationDTO = NotificationDTO.builder()
				.recipient("omarqady100@gmail.com")
				.subject("Hello Testing")
				.body("Hello Bro, I am running an email sending test")
				.build();
		notificationService.sendEmail(notificationDTO);
	}

}
