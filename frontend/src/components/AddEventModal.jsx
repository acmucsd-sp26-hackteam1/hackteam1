import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddEventModal({
  isOpen,
  onClose,
  onAddEvent,
}) {
  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (!isOpen) {
    return null;
  }

  function handleDayChange(day) {
    if (days.includes(day)) {
      setDays(
        days.filter((currentDay) => currentDay !== day)
      );
    } else {
      setDays([...days, day]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if(!currentUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          ownerUid: currentUser.uid,
          startDate,
          startTime,
          endTime,
          isRecurring: days.length > 0,
          recurringDays: days,
          location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const savedEvent = await response.json();
      console.log("Saved event:", savedEvent);
      onAddEvent(savedEvent);

      setName("");
      setDays([]);
      setStartDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");

      onClose();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="add-event-modal">
        <h2>Add Event</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Event Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Start Date</label>

            <input
              type = "date"
              value = {startDate}
              onChange = {(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <p>Days</p>

            <div className="day-options">
              {weekdays.map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={days.includes(day)}
                    onChange={() => handleDayChange(day)}
                  />

                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label>Start Time</label>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label>End Time</label>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Location</label>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}