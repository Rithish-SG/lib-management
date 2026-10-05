import axios from 'axios';
import { INITIAL_BOOKS, INITIAL_MEMBER } from '../data/initialData';

/**
 * Experiment 5: REST API Client with Axios & Async/Await
 * Topics: REST API, Axios, Fetch, Async Data, Loading & Error States (5.a - 5.f)
 */

// Create dedicated Axios instance
const apiClient = axios.create({
  baseURL: 'https://api.campuslibrary.edu/v1', // Standard REST base URL representation
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Mock in-memory database stored in localStorage for live CRUD simulation
function getStoredBooks() {
  try {
    const data = localStorage.getItem('lib_rest_books');
    if (data) return JSON.parse(data);
    localStorage.setItem('lib_rest_books', JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  } catch {
    return INITIAL_BOOKS;
  }
}

function saveStoredBooks(books) {
  try {
    localStorage.setItem('lib_rest_books', JSON.stringify(books));
  } catch (e) {
    console.error(e);
  }
}

// Global flag to demonstrate error state handling in lab viva
let simulateNetworkError = false;

export function toggleNetworkError(enable) {
  simulateNetworkError = enable;
}

export function isNetworkErrorSimulated() {
  return simulateNetworkError;
}

/**
 * a & b) REST API: Fetch all books with optional search query & category filter
 * Demonstrates: async/await, query params, network delay, loading & error handling
 */
export async function fetchBooksApi({ search = '', category = 'All', author = 'All' } = {}) {
  // Simulate network latency (400ms - 600ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (simulateNetworkError) {
    throw new Error('HTTP 500: Internal Server Error - Failed to connect to Library REST API service.');
  }

  const allBooks = getStoredBooks();
  const query = search.toLowerCase().trim();

  const filtered = allBooks.filter((book) => {
    const matchesSearch =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);

    const matchesCategory = category === 'All' || book.category === category;
    const matchesAuthor = author === 'All' || book.author === author;

    return matchesSearch && matchesCategory && matchesAuthor;
  });

  return {
    status: 200,
    data: filtered,
    total: filtered.length
  };
}

/**
 * c) REST API: Fetch individual book details dynamically by ID
 * Demonstrates: GET /api/books/:id
 */
export async function fetchBookByIdApi(bookId) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (simulateNetworkError) {
    throw new Error('HTTP 500: Database connection error while retrieving book record.');
  }

  const allBooks = getStoredBooks();
  const book = allBooks.find((b) => b.id === bookId);

  if (!book) {
    const error = new Error(`HTTP 404: Book with ID #${bookId} not found in catalog.`);
    error.status = 404;
    throw error;
  }

  return {
    status: 200,
    data: book
  };
}

/**
 * a) REST API: Fetch Member Profile information
 * Demonstrates: GET /api/member
 */
export async function fetchMemberProfileApi() {
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (simulateNetworkError) {
    throw new Error('HTTP 503: Member service temporarily unavailable.');
  }

  try {
    const saved = localStorage.getItem('lib_auth_current_user') || localStorage.getItem('lib_member');
    const member = saved ? JSON.parse(saved) : INITIAL_MEMBER;
    return { status: 200, data: member };
  } catch {
    return { status: 200, data: INITIAL_MEMBER };
  }
}

/**
 * f) REST API: Fetch personalized book recommendations
 * Demonstrates: GET /api/recommendations
 */
export async function fetchRecommendationsApi(preferredCategory = 'Computer Science') {
  await new Promise((resolve) => setTimeout(resolve, 450));

  if (simulateNetworkError) {
    throw new Error('HTTP 500: Recommendation engine service timed out.');
  }

  const allBooks = getStoredBooks();
  const matching = allBooks.filter((b) => b.category === preferredCategory);
  const recommendations = matching.length > 0 ? matching.slice(0, 3) : allBooks.slice(0, 3);

  return {
    status: 200,
    data: recommendations
  };
}

/**
 * REST API: Update book copy inventory upon borrow or return
 */
export async function updateBookInventoryApi(bookId, delta) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const books = getStoredBooks();
  const updated = books.map((b) => {
    if (b.id === bookId) {
      return { ...b, availableCopies: Math.max(0, b.availableCopies + delta) };
    }
    return b;
  });
  saveStoredBooks(updated);
  return { status: 200, success: true };
}

export default apiClient;
