
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId();
  let isDismissing = false; // Flag local to this toast instance's closure

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  
  const dismissThisToast = () => {
    if (isDismissing) { // Prevent re-entry for this specific dismiss operation
      return;
    }

    // Check global state: is this toast currently considered open?
    const toastInGlobalState = memoryState.toasts.find(t => t.id === id);
    if (toastInGlobalState && toastInGlobalState.open) {
      isDismissing = true; // Mark that this instance is processing a dismiss
      dispatch({ type: "DISMISS_TOAST", toastId: id });
    } else {
      // If already closed or not found in global state, ensure isDismissing is true
      // to prevent onOpenChange (if it fires late) from trying again.
      isDismissing = true;
    }
  };

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (newOpenStateFromPrimitive) => {
        if (!newOpenStateFromPrimitive) { // Radix component indicates it wants to close
          // Check global state: is this toast currently considered open?
          const toastInGlobalState = memoryState.toasts.find(t => t.id === id);
          if (toastInGlobalState && toastInGlobalState.open) {
            // If global state says it's open, attempt to dismiss.
            // dismissThisToast will handle the isDismissing flag and re-check global state.
            dismissThisToast();
          }
        }
      },
    },
  });

  return {
    id: id,
    dismiss: dismissThisToast,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    const currentSetState = setState;
    listeners.push(currentSetState);
    return () => {
      const index = listeners.indexOf(currentSetState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []); 

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      // For generic dismiss call from outside, find the specific toast instance's dismiss if possible,
      // otherwise, dispatch directly. For simplicity here, we dispatch.
      // A more complex system might retrieve the specific 'dismissThisToast' if needed.
      dispatch({ type: "DISMISS_TOAST", toastId });
    }
  };
}

export { useToast, toast }
