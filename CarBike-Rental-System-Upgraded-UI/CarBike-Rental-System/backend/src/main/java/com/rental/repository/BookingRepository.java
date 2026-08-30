package com.rental.repository;
import com.rental.model.Booking;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking,Long>{
 @Query("SELECT CASE WHEN COUNT(b)>0 THEN true ELSE false END FROM Booking b WHERE b.vehicle.id=:vehicleId AND b.status=com.rental.model.Booking$BookingStatus.CONFIRMED AND b.startDate<=:endDate AND b.endDate>=:startDate")
 boolean existsOverlappingBooking(@Param("vehicleId")Long vehicleId,@Param("startDate")LocalDate startDate,@Param("endDate")LocalDate endDate);
 List<Booking> findAllByOrderByCreatedAtDesc();
}
