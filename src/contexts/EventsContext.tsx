import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Event, EventsState } from "../types/events";
import { eventsService } from "../services/eventsService";

type EventsAction =
  | { type: "FETCH_EVENTS_START" }
  | { type: "FETCH_EVENTS_SUCCESS"; payload: Event[] }
  | { type: "FETCH_EVENTS_ERROR"; payload: string }
  | { type: "ADD_EVENT_SUCCESS"; payload: Event }
  | { type: "UPDATE_EVENT_SUCCESS"; payload: Event }
  | { type: "DELETE_EVENT_SUCCESS"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

interface EventsContextType extends EventsState {
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, "id">) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

function eventsReducer(state: EventsState, action: EventsAction): EventsState {
  switch (action.type) {
    case "FETCH_EVENTS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_EVENTS_SUCCESS":
      return { ...state, loading: false, events: action.payload };
    case "FETCH_EVENTS_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_EVENT_SUCCESS":
      return { ...state, events: [...state.events, action.payload] };
    case "UPDATE_EVENT_SUCCESS":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case "DELETE_EVENT_SUCCESS":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function EventsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const fetchEvents = async () => {
    dispatch({ type: "FETCH_EVENTS_START" });
    try {
      const events = await eventsService.getEvents();
      dispatch({ type: "FETCH_EVENTS_SUCCESS", payload: events });
    } catch (error) {
      dispatch({
        type: "FETCH_EVENTS_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to fetch events",
      });
    }
  };

  const addEvent = async (event: Omit<Event, "id">) => {
    try {
      const newEvent = await eventsService.addEvent(event);
      dispatch({ type: "ADD_EVENT_SUCCESS", payload: newEvent });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Failed to add event",
      });
    }
  };

  const updateEvent = async (event: Event) => {
    try {
      const updatedEvent = await eventsService.updateEvent(event);
      dispatch({ type: "UPDATE_EVENT_SUCCESS", payload: updatedEvent });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update event",
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventsService.deleteEvent(id);
      dispatch({ type: "DELETE_EVENT_SUCCESS", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete event",
      });
    }
  };

  return (
    <EventsContext.Provider
      value={{
        ...state,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
