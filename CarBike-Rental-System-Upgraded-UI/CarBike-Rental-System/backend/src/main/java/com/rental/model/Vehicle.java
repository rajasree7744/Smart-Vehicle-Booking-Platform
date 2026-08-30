package com.rental.model;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity @Table(name="vehicles")
public class Vehicle {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String name;
 @Column(nullable=false) private String brand;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private VehicleType type;
 @Column(nullable=false) private String category;
 @Column(name="registration_number",nullable=false,unique=true) private String registrationNumber;
 @Column(name="price_per_day",nullable=false,precision=10,scale=2) private BigDecimal pricePerDay;
 @Column(nullable=false) private Integer seats;
 @Column(name="fuel_type",nullable=false) private String fuelType;
 @Column(nullable=false) private String transmission;
 @Column(name="image_url") private String imageUrl;
 @Column(nullable=false) private Boolean available=true;
 private String description;
 public Vehicle(){}
 public Long getId(){return id;} public String getName(){return name;} public String getBrand(){return brand;}
 public VehicleType getType(){return type;} public String getCategory(){return category;} public String getRegistrationNumber(){return registrationNumber;}
 public BigDecimal getPricePerDay(){return pricePerDay;} public Integer getSeats(){return seats;} public String getFuelType(){return fuelType;}
 public String getTransmission(){return transmission;} public String getImageUrl(){return imageUrl;} public Boolean getAvailable(){return available;}
 public String getDescription(){return description;}
 public void setId(Long v){id=v;} public void setName(String v){name=v;} public void setBrand(String v){brand=v;} public void setType(VehicleType v){type=v;}
 public void setCategory(String v){category=v;} public void setRegistrationNumber(String v){registrationNumber=v;} public void setPricePerDay(BigDecimal v){pricePerDay=v;}
 public void setSeats(Integer v){seats=v;} public void setFuelType(String v){fuelType=v;} public void setTransmission(String v){transmission=v;}
 public void setImageUrl(String v){imageUrl=v;} public void setAvailable(Boolean v){available=v;} public void setDescription(String v){description=v;}
}
