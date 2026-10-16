import axios from 'axios';
import { INITIAL_BOOKS, INITIAL_BORROWED, INITIAL_HISTORY } from '../data/initialData';

/**
 * Experiment 7: CRUD REST API Service with Axios
 * Topics: CRUD Operations (GET, POST, PUT/PATCH, DELETE), Borrowing API Operations (7.a - 7.f)
 */

export const httpLogs = [];
const MAX_LOGS = 10;

function logHttp(method, url, status, payload = null) {
  const timestamp = new Date().toLocaleTimeString();
  const entry = {
    id: Date.now() + Math.random(),
    time: timestamp,
    method,
    url,
    status,
    payload: payload ? JSON.stringify(payload) : null
  };

  httpLogs.unshift(entry);
  if (httpLogs.length > MAX_LOGS) httpLogs.pop();

  console.groupCollapsed(`[REST API ${method} ${status}] ${url} @ ${timestamp}`);
  if (payload) console.log('Payload / Data:', payload);
  console.groupEnd();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('http-request-logged', { detail: entry }));
  }
}

// LocalStorage Persistence Helpers
function loadBooks() {
  try {
    const data = localStorage.getItem('lib_crud_books');
    if (data) return JSON.parse(data);
    localStorage.setItem('lib_crud_books', JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  } catch {
    return INITIAL_BOOKS;
  }
}

function saveBooks(books) {
  try {
    localStorage.setItem('lib_crud_books', JSON.stringify(books));
  } catch (e) {
    console.error(e);
  }
}

function loadBorrowed() {
  try {
    const data = localStorage.getItem('lib_crud_borrowed');
    return data ? JSON.parse(data) : INITIAL_BORROWED;
  } catch {
    return INITIAL_BORROWED;
  }
}

function saveBorrowed(borrowed) {
  try {
    localStorage.setItem('lib_crud_borrowed', JSON.stringify(borrowed));
  } catch (e) {
    console.error(e);
  }
}

function loadHistory() {
  try {
    const data = localStorage.getItem('lib_crud_history');
    return data ? JSON.parse(data) : INITIAL_HISTORY;
  } catch {
    return INITIAL_HISTORY;
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem('lib_crud_history', JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }
}

// Global flag to simulate network failure
let simulateError = false;
export function toggleCrudError(flag) {
  simulateError = flag;
}

/**
 * a) GET /api/books: Retrieve books from catalog
 */
export async function getBooksApi({ search = '', category = 'All' } = {}) {
  await new Promise((r) => setTimeout(r, 450)); // Network latency

  if (simulateError) {
    logHttp('GET', '/api/books', 500);
    throw new Error('HTTP 500 Internal Server Error: Failed to retrieve books from database.');
  }

  const books = loadBooks();
  const q = search.toLowerCase().trim();
  const filtered = books.filter((b) => {
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchCat = category === 'All' || b.category === category;
    return matchSearch && matchCat;
  });

  logHttp('GET', `/api/books${q ? `?q=${q}` : ''}`, 200, { count: filtered.length });
  return { status: 200, data: filtered };
}

/**
 * GET /api/books/:id: Retrieve single book by ID
 */
export async function getBookByIdApi(id) {
  await new Promise((r) => setTimeout(r, 350));

  if (simulateError) {
    logHttp('GET', `/api/books/${id}`, 500);
    throw new Error('HTTP 500 Internal Server Error.');
  }

  const books = loadBooks();
  const book = books.find((b) => b.id === id);
  if (!book) {
    logHttp('GET', `/api/books/${id}`, 404);
    throw new Error(`HTTP 404 Not Found: Book #${id} does not exist.`);
  }

  logHttp('GET', `/api/books/${id}`, 200, book);
  return { status: 200, data: book };
}

/**
 * b) POST /api/books: Add a new book to catalog
 */
export async function createBookApi(bookData) {
  await new Promise((r) => setTimeout(r, 500));

  if (simulateError) {
    logHttp('POST', '/api/books', 500, bookData);
    throw new Error('HTTP 500: Database insertion failed.');
  }

  const books = loadBooks();
  const newId = (Math.max(...books.map((b) => parseInt(b.id, 10) || 100)) + 1).toString();

  const newBook = {
    id: newId,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    category: bookData.category || 'Computer Science',
    publishedYear: parseInt(bookData.publishedYear, 10) || new Date().getFullYear(),
    isbn: bookData.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    shelfLocation: bookData.shelfLocation || 'Main-Rack-1',
    totalCopies: parseInt(bookData.totalCopies, 10) || 3,
    availableCopies: parseInt(bookData.totalCopies, 10) || 3,
    description: bookData.description || 'No description provided.'
  };

  books.unshift(newBook);
  saveBooks(books);

  logHttp('POST', '/api/books', 201, newBook);
  return { status: 201, data: newBook, message: 'Book created successfully.' };
}

/**
 * c) PUT/PATCH /api/books/:id: Update book information
 */
export async function updateBookApi(id, updatedFields) {
  await new Promise((r) => setTimeout(r, 450));

  if (simulateError) {
    logHttp('PUT', `/api/books/${id}`, 500, updatedFields);
    throw new Error('HTTP 500: Failed to update book record.');
  }

  const books = loadBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    logHttp('PUT', `/api/books/${id}`, 404);
    throw new Error(`HTTP 404: Book #${id} not found.`);
  }

  const updated = {
    ...books[index],
    ...updatedFields,
    id // Preserve primary key
  };

  books[index] = updated;
  saveBooks(books);

  logHttp('PUT', `/api/books/${id}`, 200, updated);
  return { status: 200, data: updated, message: 'Book updated successfully.' };
}

/**
 * d) DELETE /api/books/:id: Delete a book from catalog
 */
export async function deleteBookApi(id) {
  await new Promise((r) => setTimeout(r, 400));

  if (simulateError) {
    logHttp('DELETE', `/api/books/${id}`, 500);
    throw new Error('HTTP 500: Failed to delete book.');
  }

  const books = loadBooks();
  const exists = books.some((b) => b.id === id);
  if (!exists) {
    logHttp('DELETE', `/api/books/${id}`, 404);
    throw new Error(`HTTP 404: Book #${id} not found.`);
  }

  const remaining = books.filter((b) => b.id !== id);
  saveBooks(remaining);

  logHttp('DELETE', `/api/books/${id}`, 200, { deletedId: id });
  return { status: 200, success: true, message: `Book #${id} deleted successfully.` };
}

/**
 * e) POST /api/borrow: Create a new borrowing record
 */
export async function createBorrowRecordApi(book, memberInfo) {
  await new Promise((r) => setTimeout(r, 450));

  if (simulateError) {
    logHttp('POST', '/api/borrow', 500);
    throw new Error('HTTP 500: Borrowing transaction failed.');
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  const newRecord = {
    borrowId: `BRW-${Date.now().toString().slice(-4)}`,
    bookId: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    borrowDate: todayStr,
    dueDate: dueDateStr,
    renewalCount: 0,
    status: 'Active',
    memberId: memberInfo.id,
    memberName: memberInfo.name
  };

  const borrowed = loadBorrowed();
  borrowed.unshift(newRecord);
  saveBorrowed(borrowed);

  // Decrement book inventory
  const books = loadBooks();
  const bookRecord = books.find((b) => b.id === book.id);
  if (bookRecord && bookRecord.availableCopies > 0) {
    bookRecord.availableCopies -= 1;
    saveBooks(books);
  }

  logHttp('POST', '/api/borrow', 201, newRecord);
  return { status: 201, data: newRecord };
}

/**
 * e) PUT /api/borrow/:id: Update borrowing record (Renew / Return)
 */
export async function updateBorrowRecordApi(borrowId, actionType, updates = {}) {
  await new Promise((r) => setTimeout(r, 400));

  if (simulateError) {
    logHttp('PATCH', `/api/borrow/${borrowId}`, 500);
    throw new Error('HTTP 500: Failed to update borrowing status.');
  }

  const borrowed = loadBorrowed();
  const index = borrowed.findIndex((b) => b.borrowId === borrowId);
  if (index === -1) {
    logHttp('PATCH', `/api/borrow/${borrowId}`, 404);
    throw new Error(`HTTP 404: Borrow record ${borrowId} not found.`);
  }

  const item = borrowed[index];

  if (actionType === 'RENEW') {
    const currentDue = new Date(item.dueDate);
    currentDue.setDate(currentDue.getDate() + 7);
    item.dueDate = currentDue.toISOString().split('T')[0];
    item.renewalCount += 1;
    saveBorrowed(borrowed);

    logHttp('PATCH', `/api/borrow/${borrowId}`, 200, { action: 'RENEW', newDueDate: item.dueDate });
    return { status: 200, data: item, message: 'Loan renewed for 7 additional days.' };
  }

  if (actionType === 'RETURN') {
    // Remove from active loans
    const remaining = borrowed.filter((b) => b.borrowId !== borrowId);
    saveBorrowed(remaining);

    // Increment book inventory
    const books = loadBooks();
    const bookRecord = books.find((b) => b.id === item.bookId);
    if (bookRecord) {
      bookRecord.availableCopies += 1;
      saveBooks(books);
    }

    // Add to history
    const history = loadHistory();
    const historyEntry = {
      historyId: `HIST-${Date.now().toString().slice(-3)}`,
      bookId: item.bookId,
      title: item.title,
      author: item.author,
      borrowDate: item.borrowDate,
      returnDate: new Date().toISOString().split('T')[0],
      feedback: updates.feedback || 'Returned on schedule.'
    };
    history.unshift(historyEntry);
    saveHistory(history);

    logHttp('DELETE', `/api/borrow/${borrowId}`, 200, { action: 'RETURN', archivedToHistory: true });
    return { status: 200, success: true, message: 'Book returned and restored to inventory.' };
  }

  return { status: 200, data: item };
}

export async function getBorrowRecordsApi() {
  return { status: 200, data: loadBorrowed() };
}

export async function getHistoryRecordsApi() {
  return { status: 200, data: loadHistory() };
}
