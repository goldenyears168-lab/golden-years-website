export type AdditionalField = {
  id: string;
  name: string;
  title: string;
  type: string;
  values: string[] | null;
  default: string | null;
  is_null: string;
  pos: string;
};

export type SelectedSlot = {
  date: string;
  time: string;
  appointmentId?: string;
};

export type ClientData = {
  name: string;
  email: string;
  phone: string;
};

export type BookingItem = {
  id: string;
  code: string;
  start_date_time: string;
  end_date_time: string;
  is_confirmed: string;
  hash: string;
};

export type BookingResult = {
  require_confirm: boolean;
  bookings: BookingItem[];
};

export type BookingSummary = {
  booking: BookingItem;
  serviceLabel: string;
  storeLabel: string;
  client: ClientData;
  additionalAnswers: { title: string; value: string }[];
  arrivalTime?: string | null;
};

export type AppPage = 'browse' | 'form' | 'thanks';