package com.rental.dto;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class BookingRequest {
 @NotNull private Long vehicleId;
 @NotBlank private String customerName;
 @NotBlank @Email private String customerEmail;
 @NotBlank private String customerPhone;
 @NotNull private LocalDate startDate;
 @NotNull private LocalDate endDate;
 public Long getVehicleId(){return vehicleId;} public String getCustomerName(){return customerName;} public String getCustomerEmail(){return customerEmail;}
 public String getCustomerPhone(){return customerPhone;} public LocalDate getStartDate(){return startDate;} public LocalDate getEndDate(){return endDate;}
 public void setVehicleId(Long v){vehicleId=v;} public void setCustomerName(String v){customerName=v;} public void setCustomerEmail(String v){customerEmail=v;}
 public void setCustomerPhone(String v){customerPhone=v;} public void setStartDate(LocalDate v){startDate=v;} public void setEndDate(LocalDate v){endDate=v;}
}
