# Car & Bike Rental System

Full-stack rental app:
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Java 25 + Spring Boot 3.5.16 REST API
- Database: MySQL 8
- Build: Maven
- Features: vehicle listing, car/bike filtering, date availability, customer bookings, rental-date validation, automatic total calculation, overlap protection, booking cancellation.

## Run
1. Run `database/schema.sql` in MySQL.
2. Edit `backend/src/main/resources/application.properties` and replace `YOUR_MYSQL_PASSWORD`.
3. Terminal 1: `cd backend` then `mvn clean spring-boot:run`
4. Terminal 2: open `frontend/index.html` with VS Code Live Server.
5. Open the Live Server URL, normally `http://127.0.0.1:5500/index.html`.

## REST API
GET `/api/vehicles`
GET `/api/vehicles/{id}`
GET `/api/vehicles/available?startDate=2026-09-01&endDate=2026-09-03`
GET `/api/bookings`
POST `/api/bookings`
DELETE `/api/bookings/{id}`

POST example:
{
  "vehicleId": 1,
  "customerName": "Rajasree",
  "customerEmail": "rajasree@example.com",
  "customerPhone": "9876543210",
  "startDate": "2026-09-01",
  "endDate": "2026-09-03"
}

Do not upload your real MySQL password to GitHub.
