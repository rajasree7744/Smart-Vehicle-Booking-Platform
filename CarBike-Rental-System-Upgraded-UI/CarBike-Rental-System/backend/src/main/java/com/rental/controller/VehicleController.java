package com.rental.controller;
import com.rental.model.Vehicle;
import com.rental.repository.VehicleRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController @RequestMapping("/api/vehicles")
public class VehicleController {
 private final VehicleRepository repo;
 public VehicleController(VehicleRepository r){repo=r;}
 @GetMapping public List<Vehicle> all(){return repo.findAll();}
 @GetMapping("/{id}") public Vehicle one(@PathVariable Long id){return repo.findById(id).orElseThrow(()->new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND,"Vehicle not found."));}
 @GetMapping("/available") public List<Vehicle> available(@RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate startDate,@RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE)LocalDate endDate){
  if(startDate.isAfter(endDate)) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST,"End date must be on or after start date.");
  return repo.findAvailableBetween(startDate,endDate);
 }
}
