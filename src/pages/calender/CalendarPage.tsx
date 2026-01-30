import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core";

const CalendarUI = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  /* ADD AVAILABILITY */
  const handleSelect = (info: DateSelectArg) => {
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "Available",
        start: info.startStr,
        end: info.endStr,
        backgroundColor: "#3b82f6",
      },
    ]);
  };

  
  const handleEventClick = (info: EventClickArg) => {
    setSelectedEventId(info.event.id);
  };

  const updateEventStatus = (status: "accepted" | "declined") => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === selectedEventId
          ? {
              ...event,
              title: status === "accepted" ? "Confirmed Meeting" : "Declined",
              backgroundColor: status === "accepted" ? "#22c55e" : "#ef4444",
            }
          : event,
      ),
    );

    setSelectedEventId(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable
        editable
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
      />

      {/* ACTION PANEL */}
      {selectedEventId && (
        <div style={panelStyle}>
          <h3 style={{ marginBottom: "8px" }}>Meeting Request</h3>

          <button
            onClick={() => updateEventStatus("accepted")}
            style={{ background: "green", color: "white", marginRight: 5, padding:'2px', borderRadius:"3px"}}
          >
            Accept
          </button>

          <button
            onClick={() => updateEventStatus("declined")}
            style={{ background: "red", color: "white", padding:'2px', borderRadius:"3px"}}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarUI;

const panelStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 20,
  right: 20,
  background: "white",
  padding: 15,
  borderRadius: 10,
  boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  zIndex: 1,
};
