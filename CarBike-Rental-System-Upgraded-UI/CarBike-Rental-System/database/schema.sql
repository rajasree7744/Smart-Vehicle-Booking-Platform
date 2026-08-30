CREATE DATABASE IF NOT EXISTS rental_db;
USE rental_db;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicles;

CREATE TABLE vehicles (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 brand VARCHAR(80) NOT NULL,
 type ENUM('CAR','BIKE') NOT NULL,
 category VARCHAR(80) NOT NULL,
 registration_number VARCHAR(30) NOT NULL UNIQUE,
 price_per_day DECIMAL(10,2) NOT NULL,
 seats INT NOT NULL,
 fuel_type VARCHAR(30) NOT NULL,
 transmission VARCHAR(30) NOT NULL,
 image_url VARCHAR(500),
 available BOOLEAN NOT NULL DEFAULT TRUE,
 description VARCHAR(500)
);

CREATE TABLE bookings (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 vehicle_id BIGINT NOT NULL,
 customer_name VARCHAR(120) NOT NULL,
 customer_email VARCHAR(160) NOT NULL,
 customer_phone VARCHAR(25) NOT NULL,
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 rental_days INT NOT NULL,
 total_amount DECIMAL(10,2) NOT NULL,
 status ENUM('CONFIRMED','CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE INDEX idx_booking_vehicle_dates ON bookings(vehicle_id, start_date, end_date, status);

INSERT INTO vehicles
(name,brand,type,category,registration_number,price_per_day,seats,fuel_type,transmission,image_url,available,description) VALUES
('City Cruiser','Hyundai','CAR','Hatchback','TN30CA1001',1800,5,'Petrol','Manual','https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',TRUE,'Comfortable city car.'),
('Urban SUV','Kia','CAR','SUV','TN30CB1002',2800,5,'Diesel','Automatic','https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',TRUE,'Spacious automatic SUV.'),
('Premium Sedan','Honda','CAR','Sedan','TN30CC1003',2400,5,'Petrol','Automatic','https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80',TRUE,'Elegant family sedan.'),
('Classic Roadster','Royal Enfield','BIKE','Cruiser','TN30BI2001',950,2,'Petrol','Manual','https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',TRUE,'Classic cruiser bike.'),
('Street Rider','Yamaha','BIKE','Sport','TN30BI2002',1100,2,'Petrol','Manual','https://images.unsplash.com/photo-1558981403-c5f9891e2d3a?auto=format&fit=crop&w=900&q=80',TRUE,'Sporty city motorcycle.'),
('Adventure X','KTM','BIKE','Adventure','TN30BI2003',1250,2,'Petrol','Manual','https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=900&q=80',TRUE,'Adventure motorcycle.');
