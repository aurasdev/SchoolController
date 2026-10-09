import { useCallback, useReducer } from 'react';

type AddClassFormStatus = 'idle' | 'missingFields' | 'saved';

type AddClassFormState = {
  className: string;
  day: string;
  room: string;
  status: AddClassFormStatus;
  teacher: string;
  time: string;
};

type AddClassFormAction =
  | {
      field: 'className' | 'day' | 'room' | 'teacher' | 'time';
      type: 'fieldChanged';
      value: string;
    }
  | { type: 'submitted' };

const initialState: AddClassFormState = {
  className: '',
  day: '',
  room: '',
  status: 'idle',
  teacher: '',
  time: ''
};

function hasRequiredFields({ className, day, room, teacher, time }: AddClassFormState) {
  return [className, day, room, teacher, time].every((value) => value.trim().length > 0);
}

function addClassFormReducer(
  state: AddClassFormState,
  action: AddClassFormAction
): AddClassFormState {
  switch (action.type) {
    case 'fieldChanged':
      return {
        ...state,
        [action.field]: action.value,
        status: state.status === 'idle' ? state.status : 'idle'
      };
    case 'submitted':
      return {
        ...state,
        status: hasRequiredFields(state) ? 'saved' : 'missingFields'
      };
    default:
      return state;
  }
}

export function useAddClassForm() {
  const [state, dispatch] = useReducer(addClassFormReducer, initialState);

  const onClassNameChange = useCallback((value: string) => {
    dispatch({ field: 'className', type: 'fieldChanged', value });
  }, []);

  const onDayChange = useCallback((value: string) => {
    dispatch({ field: 'day', type: 'fieldChanged', value });
  }, []);

  const onRoomChange = useCallback((value: string) => {
    dispatch({ field: 'room', type: 'fieldChanged', value });
  }, []);

  const onTeacherChange = useCallback((value: string) => {
    dispatch({ field: 'teacher', type: 'fieldChanged', value });
  }, []);

  const onTimeChange = useCallback((value: string) => {
    dispatch({ field: 'time', type: 'fieldChanged', value });
  }, []);

  const onSubmit = useCallback(() => {
    dispatch({ type: 'submitted' });
  }, []);

  return {
    handlers: {
      onClassNameChange,
      onDayChange,
      onRoomChange,
      onSubmit,
      onTeacherChange,
      onTimeChange
    },
    state
  };
}
