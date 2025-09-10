package com.example.HotelBooking.services;

import com.example.HotelBooking.dtos.Response;
import com.example.HotelBooking.dtos.RoomDTO;
import com.example.HotelBooking.entities.Room;
import com.example.HotelBooking.enums.RoomType;
import com.example.HotelBooking.exceptions.InvalidBookingStateAndDateException;
import com.example.HotelBooking.exceptions.NotFoundException;
import com.example.HotelBooking.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService{

    private final RoomRepository roomRepository;

    private final ModelMapper modelMapper;

//    private final static String IMAGE_DIRECTORY = System.getProperty("user.dir") + "/product-image";

    // image directory for our frontend app
    private final static String IMAGE_DIRECTORY_FRONTEND = "D:/Spring Boot Projects/HotelApp/src/assets/";


    @Override
    public Response addRoom(RoomDTO roomDTO, MultipartFile imageFile) {
        Room roomToSave = modelMapper.map(roomDTO, Room.class);
        if (imageFile != null){
            String imagePath = saveImageToFrontend(imageFile);
            roomToSave.setImageUrl(imagePath);
        }
        roomRepository.save(roomToSave);
        return Response.builder()
                .status(200)
                .message("Room Successfully added")
                .build();
    }

    @Override
    public Response updateRoom(RoomDTO roomDTO, MultipartFile imageFile) {
        Room existingRoom = roomRepository.findById(roomDTO.getId())
                .orElseThrow(() -> new NotFoundException("Room does not exists"));

        if (imageFile != null && !imageFile.isEmpty()){
            String imagePath = saveImageToFrontend(imageFile);
            existingRoom.setImageUrl(imagePath);
        }
        if (roomDTO.getRoomNumber() != null && roomDTO.getRoomNumber() >= 0){
            existingRoom.setRoomNumber(roomDTO.getRoomNumber());
        }

        if (roomDTO.getPricePerNight() != null && roomDTO.getPricePerNight().compareTo(BigDecimal.ZERO) >= 0){
            existingRoom.setPricePerNight(roomDTO.getPricePerNight());
        }

        if (roomDTO.getCapacity() != null && roomDTO.getCapacity() >= 0){
            existingRoom.setCapacity(roomDTO.getCapacity());
        }

        if (roomDTO.getType() != null ){
            existingRoom.setType(roomDTO.getType());
        }

        if (roomDTO.getDescription() != null){
            existingRoom.setDescription(roomDTO.getDescription());
        }

        roomRepository.save(existingRoom);
        return Response.builder()
                .message("Room updated Successfully")
                .status(200)
                .build();
   }

    @Override
    public Response getAllRooms() {
        List<Room> roomList = roomRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<RoomDTO> roomDTOList = modelMapper.map(roomList, new TypeToken<List<RoomDTO>>() {}.getType());
        return Response.builder()
                .status(200)
                .rooms(roomDTOList)
                .message("success")
                .build();
    }

    @Override
    public Response getRoomById(Long Id) {
        Room room = roomRepository.findById(Id)
                .orElseThrow(() -> new NotFoundException("Room not found"));

        RoomDTO roomDTO = modelMapper.map(room, RoomDTO.class);

        return Response.builder()
                .status(200)
                .room(roomDTO)
                .message("success")
                .build();
    }

    @Override
    public Response deleteRoom(Long Id) {
        if (!roomRepository.existsById(Id)){
            throw new NotFoundException("Room not found");
        }
        roomRepository.deleteById(Id);

        return Response.builder()
                .status(200)
                .message("Room Deleted Successfully")
                .build();

    }

    @Override
    public Response getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, RoomType roomType) {
        // VALIDATION: ENSURE CHECK IN DATE IS NOT BEFORE TODAY
        if (checkInDate.isBefore(LocalDate.now())){
            throw new InvalidBookingStateAndDateException("Check in date must be before today");
        }

        // VALIDATION: ENSURE CHECK OUT DATE IS NOT BEFORE CHECK IN DATE
        if (checkOutDate.isBefore(checkInDate)){
            throw new InvalidBookingStateAndDateException("Check out date must be before check in date");
        }

        // VALIDATION: ENSURE CHECK IN DATE IS NOT SAME AS CHECK OUT DATE
        if (checkInDate.isEqual(checkOutDate)){
            throw new InvalidBookingStateAndDateException("Check in date cannot be equal to check Out date");
        }

        List<Room> roomList = roomRepository.findAvailableRooms(checkInDate, checkOutDate, roomType);
        List<RoomDTO> roomDTOList = modelMapper.map(roomList, new TypeToken<List<RoomDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .rooms(roomDTOList)
                .build();

    }

    @Override
    public List<RoomType> getAllRoomTypes() {
        return Arrays.asList(RoomType.values());
    }

    @Override
    public Response searchRoom(String input) {
        List<Room> roomList = roomRepository.searchRooms(input);

        List<RoomDTO> roomDTOList = modelMapper.map(roomList, new TypeToken<List<RoomDTO>>() {}.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .rooms(roomDTOList)
                .build();

    }


    /** SAVE IMAGES TO DIRECTORY */
//    private String saveImage(MultipartFile imageFile){
//        if (!imageFile.getContentType().startsWith("image/")){
//            throw new IllegalArgumentException("Only Image file is allowed");
//        }
//
//        /// Create directory if it don't exists
//        File directory = new File(IMAGE_DIRECTORY);
//
//        if (!directory.exists()){
//            directory.mkdir();
//        }
//
//        // GENERATE UNIQUE FILE NAME FOR THE IMAGE
//        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
//        String imagePath = IMAGE_DIRECTORY + uniqueFileName;
//
//        try {
//            File destinationFile = new File(imagePath);
//            imageFile.transferTo(destinationFile);
//        } catch (Exception ex){
//            throw new IllegalArgumentException(ex.getMessage());
//        }
//
//        return imagePath;
//
//    }


    // SAVE IMAGE TO FRONTEND FOLDER
    private String saveImageToFrontend(MultipartFile imageFile){
        if (!imageFile.getContentType().startsWith("image/")){
            throw new IllegalArgumentException("Only Image file is allowed");
        }

        /// Create directory if it don't exists
        File directory = new File(IMAGE_DIRECTORY_FRONTEND);

        if (!directory.exists()){
            directory.mkdir();
        }

        // GENERATE UNIQUE FILE NAME FOR THE IMAGE
        String uniqueFileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
        String imagePath = IMAGE_DIRECTORY_FRONTEND + uniqueFileName;

        try {
            File destinationFile = new File(imagePath);
            imageFile.transferTo(destinationFile);
        } catch (Exception ex){
            throw new IllegalArgumentException(ex.getMessage());
        }

//        return "/rooms/"+uniqueFileName;
        return "/assets/" + uniqueFileName;
    }



}
