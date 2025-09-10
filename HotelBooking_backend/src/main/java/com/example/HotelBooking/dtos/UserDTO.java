package com.example.HotelBooking.dtos;

import com.example.HotelBooking.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
//معناها: لما ييجي Jackson يحوّل JSON → Object، اتجاهل أي حقول موجودة في الـ JSON ومش موجودة في الكلاس.
@JsonInclude(JsonInclude.Include.NON_NULL)
//معناها: لما تحوّل Object → JSON، ما تضيفش الحقول اللي قيمتها null.
public class UserDTO {

    private Long id;
    private String email;
    @JsonIgnore
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private UserRole role;
    private boolean active;
    private  LocalDate createdAt ;

}
