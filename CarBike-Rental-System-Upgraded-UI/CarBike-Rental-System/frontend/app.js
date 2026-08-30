const API = "http://localhost:8080/api";

let vehicles = [];
let bookings = [];
let displayedVehicles = [];
let selected = null;

const $ = id => document.getElementById(id);

function iso(d) {
    return d.toISOString().slice(0, 10);
}

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    $("ds").value = iso(today);
    $("de").value = iso(tomorrow);
    $("start").value = iso(today);
    $("end").value = iso(tomorrow);

    loadVehicles();
    loadBookings();

    document.querySelectorAll(".nav").forEach(a => {
        a.onclick = () => page(a.dataset.page);
    });

    $("browse").onclick = () => page("vehicles");

    $("newBtn").onclick = () => {
        if (vehicles.length > 0) {
            openBook(vehicles[0].id);
        }
    };

    $("check").onclick = availability;

    $("refresh").onclick = async () => {
        await loadVehicles();
        await loadBookings();
    };

    $("search").oninput = render;
    $("filter").onchange = render;

    $("close").onclick = closeBook;

    $("modal").onclick = e => {
        if (e.target.id === "modal") {
            closeBook();
        }
    };

    $("start").onchange = estimate;
    $("end").onchange = estimate;

    $("form").onsubmit = submit;
});

function page(p) {
    document.querySelectorAll(".page").forEach(x => {
        x.classList.remove("active");
    });

    $(p).classList.add("active");

    document.querySelectorAll(".nav").forEach(x => {
        x.classList.toggle("active", x.dataset.page === p);
    });

    $("title").textContent =
        p.charAt(0).toUpperCase() + p.slice(1);
}

// ==============================
// LOAD ALL VEHICLES
// ==============================

async function loadVehicles() {
    try {
        const response = await fetch(`${API}/vehicles`);

        if (!response.ok) {
            throw new Error("Unable to load vehicles.");
        }

        vehicles = await response.json();

        displayedVehicles = [...vehicles];

        stats();
        render();

    } catch (error) {
        console.error(error);
        toast(
            "Cannot connect to backend. Start Spring Boot on port 8080.",
            true
        );
    }
}

// ==============================
// LOAD BOOKINGS
// ==============================

async function loadBookings() {
    try {
        const response = await fetch(`${API}/bookings`);

        if (!response.ok) {
            throw new Error("Unable to load bookings.");
        }

        bookings = await response.json();

        $("bookCount").textContent = bookings.length;

        rows();

        // Re-render vehicles so each vehicle gets
        // its own booking information.
        render();

    } catch (error) {
        console.error(error);
    }
}

// ==============================
// DASHBOARD STATISTICS
// ==============================

function stats() {
    const cars = vehicles.filter(v => v.type === "CAR").length;
    const bikes = vehicles.filter(v => v.type === "BIKE").length;

    $("carsAll").textContent = vehicles.length;
    $("cars").textContent = cars;
    $("bikes").textContent = bikes;

    $("heroCount").textContent =
        vehicles.filter(v => v.available).length;
}

// ==============================
// FIND VEHICLE BOOKINGS
// ==============================

function getVehicleBookings(vehicleId) {
    return bookings.filter(
        booking =>
            booking.vehicle &&
            booking.vehicle.id === vehicleId &&
            booking.status === "CONFIRMED"
    );
}

// ==============================
// CHECK VEHICLE AVAILABILITY
// ==============================

function isVehicleAvailable(vehicleId, startDate, endDate) {
    const vehicleBookings = getVehicleBookings(vehicleId);

    return !vehicleBookings.some(booking => {
        return (
            booking.startDate <= endDate &&
            booking.endDate >= startDate
        );
    });
}

// ==============================
// RENDER VEHICLES
// ==============================

function render(list = null) {
    const search =
        $("search").value.toLowerCase().trim();

    const filter = $("filter").value;

    const source = list || vehicles;

    displayedVehicles = source.filter(v =>
        (filter === "ALL" || v.type === filter) &&
        `${v.brand} ${v.name} ${v.category}`
            .toLowerCase()
            .includes(search)
    );

    $("grid").innerHTML = displayedVehicles.map(v => {

        const vehicleBookings = getVehicleBookings(v.id);

        const currentStart = $("ds")?.value;
        const currentEnd = $("de")?.value;

        const availableForSelectedDates =
            currentStart &&
            currentEnd &&
            currentStart <= currentEnd
                ? isVehicleAvailable(
                    v.id,
                    currentStart,
                    currentEnd
                )
                : true;

        let bookingInfo = "";

        if (vehicleBookings.length > 0) {

            const latestBooking =
                vehicleBookings[0];

            bookingInfo = `
                <div class="booking-info">
                    <span>📅 Booked</span>
                    <small>
                        ${latestBooking.startDate}
                        → 
                        ${latestBooking.endDate}
                    </small>
                </div>
            `;
        } else {
            bookingInfo = `
                <div class="booking-info available-info">
                    <span>✓ Available</span>
                    <small>No confirmed bookings</small>
                </div>
            `;
        }

        const buttonText =
            availableForSelectedDates
                ? "Rent this vehicle"
                : "Booked for selected dates";

        const disabled =
            availableForSelectedDates
                ? ""
                : "disabled";

        return `
            <article class="vehicle">

                <div class="pic">
                    <img
                        src="${esc(v.imageUrl)}"
                        alt="${esc(v.brand + " " + v.name)}"
                        onerror="this.style.display='none'"
                    >
                </div>

                <div class="vbody">

                    <div class="vtop">

                        <div class="vname">
                            ${esc(v.brand)} ${esc(v.name)}

                            <span class="sub">
                                ${esc(v.category)}
                            </span>
                        </div>

                        <span class="tag">
                            ${v.type}
                        </span>

                    </div>

                    <div class="meta">
                        👥 ${v.seats}
                        &nbsp;
                        ⛽ ${esc(v.fuelType)}
                        &nbsp;
                        ⚙ ${esc(v.transmission)}
                    </div>

                    <div class="price">
                        ₹${Number(v.pricePerDay).toLocaleString("en-IN")}
                        <small>/ day</small>
                    </div>

                    ${bookingInfo}

                    <button
                        class="rent"
                        onclick="openBook(${v.id})"
                        ${disabled}
                    >
                        ${buttonText}
                    </button>

                </div>
            </article>
        `;
    }).join("");

    updateVehicleBookingStyles();
}

// ==============================
// VEHICLE BOOKING CSS CLASSES
// ==============================

function updateVehicleBookingStyles() {
    document.querySelectorAll(".booking-info").forEach(info => {

        if (info.classList.contains("available-info")) {
            info.style.background = "#e8f6ea";
            info.style.color = "#32783d";
        } else {
            info.style.background = "#fff2f2";
            info.style.color = "#a13d3d";
        }

        info.style.padding = "9px";
        info.style.borderRadius = "8px";
        info.style.marginTop = "10px";
        info.style.fontSize = "9px";
    });

    document.querySelectorAll(".booking-info span").forEach(span => {
        span.style.display = "block";
        span.style.fontWeight = "800";
    });

    document.querySelectorAll(".booking-info small").forEach(small => {
        small.style.display = "block";
        small.style.marginTop = "3px";
        small.style.opacity = "0.8";
    });

    document.querySelectorAll(".rent:disabled").forEach(button => {
        button.style.opacity = "0.55";
        button.style.cursor = "not-allowed";
    });
}

// ==============================
// DATE AVAILABILITY SEARCH
// ==============================

async function availability() {

    const start = $("ds").value;
    const end = $("de").value;

    if (!valid(start, end)) {
        return;
    }

    try {

        const response = await fetch(
            `${API}/vehicles/available?startDate=${start}&endDate=${end}`
        );

        if (!response.ok) {
            throw new Error(
                await err(response)
            );
        }

        const availableVehicles =
            await response.json();

        // IMPORTANT:
        // Do NOT replace the full vehicles array.
        displayedVehicles = availableVehicles;

        // Render only search results.
        $("search").value = "";
        $("filter").value = "ALL";

        render(availableVehicles);

        page("vehicles");

        toast(
            `${availableVehicles.length} vehicle(s) available.`
        );

    } catch (error) {

        console.error(error);

        toast(
            error.message || "Could not check availability.",
            true
        );
    }
}

// ==============================
// OPEN BOOKING MODAL
// ==============================

function openBook(id) {

    // Always search the COMPLETE fleet.
    selected = vehicles.find(v => v.id === id);

    if (!selected) {
        toast("Vehicle not found.", true);
        return;
    }

    const start = $("start").value;
    const end = $("end").value;

    if (
        start &&
        end &&
        start <= end &&
        !isVehicleAvailable(
            selected.id,
            start,
            end
        )
    ) {

        toast(
            `Vehicle is already booked from ${getBookedDateRange(selected.id)}`,
            true
        );

        return;
    }

    $("vid").value = id;

    $("chosen").textContent =
        `${selected.brand} ${selected.name} • ₹${Number(
            selected.pricePerDay
        ).toLocaleString("en-IN")} / day`;

    $("modal").classList.add("open");

    estimate();
}

// ==============================
// GET BOOKED DATE RANGE
// ==============================

function getBookedDateRange(vehicleId) {

    const vehicleBookings =
        getVehicleBookings(vehicleId);

    if (vehicleBookings.length === 0) {
        return "selected dates";
    }

    const booking =
        vehicleBookings[0];

    return `${booking.startDate} → ${booking.endDate}`;
}

// ==============================
// CLOSE BOOKING MODAL
// ==============================

function closeBook() {
    $("modal").classList.remove("open");
}

// ==============================
// PRICE CALCULATION
// ==============================

function estimate() {

    if (!selected) {
        return;
    }

    const start = $("start").value;
    const end = $("end").value;

    if (
        start &&
        end &&
        start <= end
    ) {

        const rentalDays =
            days(start, end);

        $("total").textContent =
            `₹${(
                Number(selected.pricePerDay) *
                rentalDays
            ).toLocaleString("en-IN")}`;

    } else {

        $("total").textContent = "₹0";

    }
}

// ==============================
// SUBMIT BOOKING
// ==============================

async function submit(e) {

    e.preventDefault();

    const start = $("start").value;
    const end = $("end").value;

    if (!valid(start, end)) {
        return;
    }

    // Final frontend availability check
    if (
        selected &&
        !isVehicleAvailable(
            selected.id,
            start,
            end
        )
    ) {

        toast(
            `Vehicle is already booked from ${getBookedDateRange(selected.id)}.`,
            true
        );

        return;
    }

    const body = {

        vehicleId: Number(
            $("vid").value
        ),

        customerName:
            $("name").value.trim(),

        customerEmail:
            $("email").value.trim(),

        customerPhone:
            $("phone").value.trim(),

        startDate: start,

        endDate: end
    };

    try {

        const response =
            await fetch(
                `${API}/bookings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );

        if (!response.ok) {

            const message =
                await err(response);

            throw new Error(message);
        }

        const booking =
            await response.json();

        closeBook();

        $("form").reset();

        await loadVehicles();
        await loadBookings();

        toast(
            `Booking #${booking.id} confirmed successfully.`
        );

        page("bookings");

    } catch (error) {

        console.error(error);

        toast(
            error.message ||
            "Booking failed.",
            true
        );
    }
}

// ==============================
// BOOKINGS TABLE
// ==============================

function rows() {

    const empty =
        $("empty");

    if (empty) {
        empty.style.display =
            bookings.length
                ? "none"
                : "block";
    }

    $("rows").innerHTML =
        bookings.map(b => `

            <tr>

                <td>
                    <b>
                        ${esc(b.customerName)}
                    </b>

                    <span class="sub">
                        ${esc(b.customerPhone)}
                    </span>
                </td>

                <td>

                    ${esc(
                        b.vehicle.brand
                    )}
                    ${esc(
                        b.vehicle.name
                    )}

                    <span class="sub">
                        ${b.vehicle.type}
                    </span>

                </td>

                <td>
                    ${b.startDate}
                    →
                    ${b.endDate}
                </td>

                <td>
                    ${b.rentalDays}
                </td>

                <td>
                    <b>
                        ₹${Number(
                            b.totalAmount
                        ).toLocaleString("en-IN")}
                    </b>
                </td>

                <td>
                    <span class="status">
                        ${b.status}
                    </span>
                </td>

                <td>

                    ${
                        b.status === "CONFIRMED"
                            ? `
                                <button
                                    class="cancel"
                                    onclick="cancelBook(${b.id})"
                                >
                                    Cancel
                                </button>
                            `
                            : ""
                    }

                </td>

            </tr>

        `).join("");
}

// ==============================
// CANCEL BOOKING
// ==============================

async function cancelBook(id) {

    if (!confirm("Cancel this booking?")) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API}/bookings/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            throw new Error(
                await err(response)
            );

        }

        await loadVehicles();
        await loadBookings();

        toast("Booking cancelled successfully.");

    } catch (error) {

        console.error(error);

        toast(
            error.message ||
            "Could not cancel booking.",
            true
        );
    }
}

// ==============================
// DATE VALIDATION
// ==============================

function valid(start, end) {

    if (!start || !end) {

        toast(
            "Select both dates.",
            true
        );

        return false;
    }

    if (start > end) {

        toast(
            "Return date must be on or after pick-up.",
            true
        );

        return false;
    }

    return true;
}

// ==============================
// NUMBER OF DAYS
// ==============================

function days(start, end) {

    return (
        Math.floor(
            (
                new Date(end) -
                new Date(start)
            ) / 86400000
        ) + 1
    );
}

// ==============================
// ERROR MESSAGE
// ==============================

async function err(response) {

    try {

        const data =
            await response.json();

        return (
            data.detail ||
            data.message ||
            "Request failed."
        );

    } catch {

        return "Request failed.";

    }
}

// ==============================
// TOAST MESSAGE
// ==============================

function toast(message, error = false) {

    const element =
        $("toast");

    element.textContent =
        message;

    element.className =
        "show" +
        (error ? " error" : "");

    clearTimeout(window.tt);

    window.tt =
        setTimeout(() => {

            element.className = "";

        }, 3500);
}

// ==============================
// HTML ESCAPE
// ==============================

function esc(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character])
    );
}