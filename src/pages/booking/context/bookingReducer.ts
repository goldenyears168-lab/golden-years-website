import type { ExternalService, ServiceVariant } from '../config-services';
import type { StoreKey } from '../config';
import type { SelectedSlot } from '../types';

export type WizardStep = 1 | 2 | 3 | 4;

export interface BookingState {
  step: WizardStep;
  visitedSteps: Set<number>;
  externalService: ExternalService | null;
  selectedVariant: ServiceVariant | null;
  storeKey: StoreKey | null;
  selectedSlot: SelectedSlot | null;
  submitting: boolean;
  bookError: string | null;
}

export const initialState: BookingState = {
  step: 1,
  visitedSteps: new Set([1]),
  externalService: null,
  selectedVariant: null,
  storeKey: null,
  selectedSlot: null,
  submitting: false,
  bookError: null,
};

export type BookingAction =
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'SELECT_SERVICE'; service: ExternalService; variant: ServiceVariant }
  | { type: 'SELECT_STORE'; storeKey: StoreKey }
  | { type: 'SELECT_SLOT'; slot: SelectedSlot }
  | { type: 'SET_SUBMITTING'; submitting: boolean }
  | { type: 'SET_BOOK_ERROR'; error: string | null }
  | { type: 'RESET_BOOKING' };

export function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case 'GO_TO_STEP': {
      return {
        ...state,
        step: action.step as WizardStep,
        visitedSteps: new Set([...state.visitedSteps, action.step]),
      };
    }

    case 'SELECT_SERVICE': {
      const changed =
        state.externalService?.id !== action.service.id ||
        state.selectedVariant?.simplybookId !== action.variant.simplybookId;
      return {
        ...state,
        externalService: action.service,
        selectedVariant: action.variant,
        ...(changed
          ? {
              storeKey: null,
              selectedSlot: null,
              bookError: null,
            }
          : {}),
      };
    }

    case 'SELECT_STORE': {
      const changed = state.storeKey !== action.storeKey;
      return {
        ...state,
        storeKey: action.storeKey,
        step: 3,
        visitedSteps: new Set([...state.visitedSteps, 3]),
        ...(changed
          ? {
              selectedSlot: null,
              bookError: null,
            }
          : {}),
      };
    }

    case 'SELECT_SLOT': {
      return {
        ...state,
        selectedSlot: action.slot,
        step: 4,
        visitedSteps: new Set([...state.visitedSteps, 4]),
      };
    }

    case 'SET_SUBMITTING': {
      return { ...state, submitting: action.submitting };
    }

    case 'SET_BOOK_ERROR': {
      return { ...state, bookError: action.error };
    }

    case 'RESET_BOOKING': {
      return initialState;
    }

    default:
      return state;
  }
}