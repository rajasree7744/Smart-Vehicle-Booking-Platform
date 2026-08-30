package com.rental.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;

@Entity @Table(name="bookings")
public class Booking {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="vehicle_id",nullable=false) private Vehicle vehicle;
 @Column(name="customer_name",nullable=false) private String customerName;
 @Column(name="customer_email",nullable=false) private String customerEmail;
 @Column(name="customer_phone",nullable=false) private String customerPhone;
 @Column(name="start_date",nullable=false) private LocalDate startDate;
 @Column(name="end_date",nullable=false) private LocalDate endDate;
 @Column(name="rental_days",nullable=false) private Integer rentalDays;
 @Column(name="total_amount",nullable=false,precision=10,scale=2) private BigDecimal totalAmount;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private BookingStatus status=BookingStatus.CONFIRMED;
 @Column(name="created_at",nullable=false) private LocalDateTime createdAt;
 public enum BookingStatus{CONFIRMED,CANCELLED}
 @PrePersist public void beforeCreate(){if(createdAt==null)createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public Vehicle getVehicle(){return vehicle;} public String getCustomerName(){return customerName;}
 public String getCustomerEmail(){return customerEmail;} public String getCustomerPhone(){return customerPhone;} public LocalDate getStartDate(){return startDate;}
 public LocalDate getEndDate(){return endDate;} public Integer getRentalDays(){return rentalDays;} public BigDecimal getTotalAmount(){return totalAmount;}
 public BookingStatus getStatus(){return status;} public LocalDateTime getCreatedAt(){return createdAt;}
 public void setVehicle(Vehicle v){vehicle=v;} public void setCustomerName(String v){customerName=v;} public void setCustomerEmail(String v){customerEmail=v;}
 public void setCustomerPhone(String v){customerPhone=v;} public void setStartDate(LocalDate v){startDate=v;} public void setEndDate(LocalDate v){endDate=v;}
 public void setRentalDays(Integer v){rentalDays=v;} public void setTotalAmount(BigDecimal v){totalAmount=v;} public void setStatus(BookingStatus v){status=v;}
}
