document.addEventListener("DOMContentLoaded", function () {
    const seatsContainer = document.getElementById("seats");
    const messageDiv = document.getElementById("message");

    const bookButton = document.getElementById("bookButton");
    const resetButton = document.getElementById("resetButton");
    const emptySeatsButton = document.getElementById("emptySeatsButton");
    const bookedSeatsButton = document.getElementById("bookedSeatsButton");
    const passengersButton = document.getElementById("passengersButton");

    const totalSeats = 40;
    let seats = JSON.parse(localStorage.getItem("seats")) || Array(totalSeats).fill(null);

    function renderSeats() {
        seatsContainer.innerHTML = "";
        for (let i = 0; i < totalSeats; i++) {
            const seatDiv = document.createElement("div");
            seatDiv.classList.add("seat");

            if (seats[i]) {
                seatDiv.textContent = "محجوز";
                seatDiv.classList.add("booked");
            } else {
                seatDiv.textContent = i + 1;
                seatDiv.classList.add("available");
            }

            seatsContainer.appendChild(seatDiv);

            if ((i + 1) % 3 === 0) {
                seatsContainer.appendChild(document.createElement("br"));
            }
        }
    }

    function bookSeat() {
        const name = document.getElementById("passengerName").value.trim();
        const gender = document.getElementById("gender").value;
        const mahram = document.getElementById("mahram").value === "yes";
        const seatNumber = parseInt(document.getElementById("seatNumber").value, 10);

        if (!name) {
            showMessage("⚠️ يرجى إدخال الاسم!", "red");
            return;
        }

        if (isNaN(seatNumber) || seatNumber < 1 || seatNumber > totalSeats) {
            showMessage("⚠️ يرجى إدخال رقم مقعد صحيح بين 1 و 40!", "red");
            return;
        }

        const index = seatNumber - 1;

        if (seats[index]) {
            showMessage("⚠️ هذا المقعد محجوز بالفعل!", "red");
            return;
        }

        if (!isValidSeat(index, gender, mahram)) {
            showMessage("⚠️ لا يمكن حجز المقعد بجوار شخص من الجنس الآخر إلا إذا كان محرمًا!", "red");
            return;
        }

        seats[index] = { name, gender, mahram };
        localStorage.setItem("seats", JSON.stringify(seats));
        renderSeats();
        showMessage("✅ تم الحجز بنجاح!", "green");
    }

    function isValidSeat(index, gender, mahram) {
        const left = index % 3 !== 0 ? seats[index - 1] : null;
        const right = (index + 1) % 3 !== 0 ? seats[index + 1] : null;

        if (left && left.gender !== gender && !mahram && !left.mahram) return false;
        if (right && right.gender !== gender && !mahram && !right.mahram) return false;

        return true;
    }

    function showEmptySeats() {
        const emptySeats = seats.map((seat, i) => seat === null ? i + 1 : null).filter(s => s);
        showMessage(`🟢 المقاعد الفارغة: ${emptySeats.join(", ")}`, "blue");
    }

    function showBookedSeats() {
        const bookedSeats = seats.map((seat, i) => seat !== null ? i + 1 : null).filter(s => s);
        showMessage(`🔴 المقاعد المحجوزة: ${bookedSeats.join(", ")}`, "blue");
    }

    function showMessage(text, color) {
        messageDiv.textContent = text;
        messageDiv.style.color = color;
    }

    bookButton.addEventListener("click", bookSeat);
    resetButton.addEventListener("click", () => { localStorage.clear(); location.reload(); });
    emptySeatsButton.addEventListener("click", showEmptySeats);
    bookedSeatsButton.addEventListener("click", showBookedSeats);

    renderSeats();
});