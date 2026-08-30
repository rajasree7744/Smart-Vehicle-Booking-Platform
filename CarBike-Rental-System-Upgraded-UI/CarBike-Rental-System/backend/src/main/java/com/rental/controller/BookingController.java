package com.rental.controller;
import com.rental.dto.BookingRequest;
import com.rental.model.Booking;
import com.rental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/bookings")
public class BookingController {
 private final BookingService service;
 public BookingController(BookingService s){service=s;}
 @GetMapping public List<Booking> all(){return service.findAll();}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Booking create(@Valid @RequestBody BookingRequest r){return service.create(r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void cancel(@PathVariable Long id){service.cancel(id);}
}
