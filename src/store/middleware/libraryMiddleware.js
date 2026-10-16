/**
 * Experiment 6: Redux Custom Middleware
 * Topics: Middleware, Action Monitoring, LocalStorage Synchronization (6.d, 6.e)
 */

// Global in-memory log of recent monitored actions for the UI devtools monitor
export const actionHistory = [];
const MAX_HISTORY = 10;

export function getActionHistory() {
  return [...actionHistory];
}

/**
 * d) Action Monitoring Middleware:
 * Intercepts all actions, logs them with timestamp and payload, and records them
 */
export const actionMonitoringMiddleware = (store) => (next) => (action) => {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = {
    id: Date.now() + Math.random(),
    time: timestamp,
    type: action.type,
    payload: action.payload ? JSON.stringify(action.payload) : 'none'
  };

  actionHistory.unshift(logEntry);
  if (actionHistory.length > MAX_HISTORY) {
    actionHistory.pop();
  }

  console.groupCollapsed(`[Redux Middleware] ⚡ Action: ${action.type} @ ${timestamp}`);
  console.log('Action Payload:', action.payload);
  console.log('State Before:', store.getState());

  const result = next(action);

  console.log('State After:', store.getState());
  console.groupEnd();

  // Notify any subscribed UI listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('redux-action-logged', { detail: logEntry }));
  }

  return result;
};

/**
 * e) Browser Storage Synchronization Middleware:
 * Automatically synchronizes updated Redux state to localStorage on relevant actions
 */
export const storageSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Actions that require persisting state to localStorage
  const syncActions = [
    'books/decrementCopies',
    'books/incrementCopies',
    'books/restoreAllInventory',
    'borrow/borrowBook',
    'borrow/returnBook',
    'borrow/renewBook',
    'borrow/placeHold',
    'borrow/clearAllBorrowing',
    'member/updateMemberProfile',
    'member/setMemberInfo'
  ];

  if (syncActions.some((type) => action.type.startsWith(type.split('/')[0]))) {
    try {
      const state = store.getState();
      localStorage.setItem('lib_redux_books', JSON.stringify(state.books.items));
      localStorage.setItem('lib_redux_borrowed', JSON.stringify(state.borrow.borrowedBooks));
      localStorage.setItem('lib_redux_history', JSON.stringify(state.borrow.readingHistory));
      localStorage.setItem('lib_redux_holds', JSON.stringify(state.borrow.holdList));
      localStorage.setItem('lib_redux_member', JSON.stringify(state.member.memberInfo));
      console.log(`[LocalStorage Middleware] 💾 Synchronized state for action: ${action.type}`);
    } catch (err) {
      console.error('Failed to synchronize Redux state to localStorage:', err);
    }
  }

  return result;
};
