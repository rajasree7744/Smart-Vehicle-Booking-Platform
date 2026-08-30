package com.rental.service;
import com.rental.dto.BookingRequest;
import com.rental.model.*;
import com.rental.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {
 private final BookingRepository bookings; private final VehicleRepository vehicles;
 public BookingService(BookingRepository b,VehicleRepository v){bookings=b;vehicles=v;}
 public List<Booking> findAll(){return bookings.findAllByOrderByCreatedAtDesc();}
 public Booking create(BookingRequest r){
  if(r.getStartDate().isAfter(r.getEndDate())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"End date must be on or after start date.");
  Vehicle v=vehicles.findById(r.getVehicleId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Vehicle not found."));
  if(!Boolean.TRUE.equals(v.getAvailable())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Vehicle is unavailable.");
  if(bookings.existsOverlappingBooking(v.getId(),r.getStartDate(),r.getEndDate())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Vehicle is already booked for selected dates.");
  long days=ChronoUnit.DAYS.between(r.getStartDate(),r.getEndDate())+1;
  Booking b=new Booking(); b.setVehicle(v); b.setCustomerName(r.getCustomerName().trim()); b.setCustomerEmail(r.getCustomerEmail().trim());
  b.setCustomerPhone(r.getCustomerPhone().trim()); b.setStartDate(r.getStartDate()); b.setEndDate(r.getEndDate()); b.setRentalDays((int)days);
  b.setTotalAmount(v.getPricePerDay().multiply(BigDecimal.valueOf(days))); b.setStatus(Booking.BookingStatus.CONFIRMED);
  return bookings.save(b);
 }
 public void cancel(Long id){
  Booking b=bookings.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Booking not found."));
  b.setStatus(Booking.BookingStatus.CANCELLED); bookings.save(b);
 }
}
