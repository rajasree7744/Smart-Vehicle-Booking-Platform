package com.rental.repository;
import com.rental.model.Vehicle;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle,Long>{
 @Query("SELECT v FROM Vehicle v WHERE v.available=true AND NOT EXISTS (SELECT b.id FROM Booking b WHERE b.vehicle=v AND b.status=com.rental.model.Booking$BookingStatus.CONFIRMED AND b.startDate<=:endDate AND b.endDate>=:startDate) ORDER BY v.type,v.pricePerDay")
 List<Vehicle> findAvailableBetween(@Param("startDate")LocalDate startDate,@Param("endDate")LocalDate endDate);
}
