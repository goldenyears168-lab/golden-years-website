import { createContext, useReducer, type ReactNode } from 'react';
import { bookingReducer, initialState } from './bookingReducer';
import type { BookingState, BookingAction } from './bookingReducer';

export interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

export const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}