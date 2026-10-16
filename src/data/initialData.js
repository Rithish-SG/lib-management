// Initial mock data for the Library Management System
// Simulates database records for books and member profile

export const INITIAL_BOOKS = [
  {
    id: "101",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Computer Science",
    publishedYear: 2008,
    isbn: "978-0132350884",
    shelfLocation: "CS-Rack-A1",
    totalCopies: 5,
    availableCopies: 3,
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book teaches software craftsmanship principles."
  },
  {
    id: "102",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    publishedYear: 2009,
    isbn: "978-0262033848",
    shelfLocation: "CS-Rack-A2",
    totalCopies: 4,
    availableCopies: 1,
    description: "Comprehensive textbook covering modern study of computer algorithms with depth and mathematical rigor."
  },
  {
    id: "103",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    category: "Computer Science",
    publishedYear: 2008,
    isbn: "978-0596517748",
    shelfLocation: "CS-Rack-A3",
    totalCopies: 3,
    availableCopies: 0, // Currently out of stock / for demonstrating unavailable & hold
    description: "Unearths the shallow elegance and deep beauty of JavaScript, guiding programmers through functions, objects, and best practices."
  },
  {
    id: "104",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    category: "Computer Science",
    publishedYear: 1994,
    isbn: "978-0201633610",
    shelfLocation: "CS-Rack-A4",
    totalCopies: 4,
    availableCopies: 2,
    description: "Captures a wealth of experience about the design of object-oriented software and 23 fundamental design patterns."
  },
  {
    id: "105",
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    publishedYear: 1965,
    isbn: "978-0441013593",
    shelfLocation: "SCIFI-Rack-B1",
    totalCopies: 6,
    availableCopies: 4,
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world."
  },
  {
    id: "106",
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    publishedYear: 2021,
    isbn: "978-0593135204",
    shelfLocation: "SCIFI-Rack-B2",
    totalCopies: 3,
    availableCopies: 2,
    description: "A lone astronaut must save the earth from disaster in this propulsive, science-based space adventure."
  },
  {
    id: "107",
    title: "1984",
    author: "George Orwell",
    category: "Literature",
    publishedYear: 1949,
    isbn: "978-0451524935",
    shelfLocation: "LIT-Rack-C1",
    totalCopies: 5,
    availableCopies: 3,
    description: "A chilling prophecy about the future and totalitarianism following Winston Smith as he navigates the party apparatus."
  },
  {
    id: "108",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Literature",
    publishedYear: 1960,
    isbn: "978-0060935467",
    shelfLocation: "LIT-Rack-C2",
    totalCopies: 4,
    availableCopies: 0, // Demonstrates hold functionality
    description: "A classic of modern American literature exploring racial injustice and the destruction of innocence in the deep South."
  },
  {
    id: "109",
    title: "Discrete Mathematics and Its Applications",
    author: "Kenneth Rosen",
    category: "Mathematics",
    publishedYear: 2018,
    isbn: "978-1259676512",
    shelfLocation: "MATH-Rack-D1",
    totalCopies: 3,
    availableCopies: 2,
    description: "Focused introduction to mathematical reasoning, combinatorial analysis, sets, and graph theory."
  }
];

export const INITIAL_MEMBER = {
  id: "MEM-2024-001",
  name: "Alex Johnson",
  email: "alex.johnson@college.edu",
  phone: "9876543210",
  memberType: "Student",
  department: "Computer Science & Engineering",
  maxAllowed: 4,
  joinedDate: "2024-08-15"
};

export const INITIAL_BORROWED = [
  {
    borrowId: "BRW-1001",
    bookId: "102",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    borrowDate: "2026-09-20",
    dueDate: "2026-10-04", // Today or near overdue
    renewalCount: 0,
    status: "Active"
  },
  {
    borrowId: "BRW-1002",
    bookId: "107",
    title: "1984",
    author: "George Orwell",
    category: "Literature",
    borrowDate: "2026-09-15",
    dueDate: "2026-09-29", // Overdue for demonstration
    renewalCount: 1,
    status: "Overdue"
  }
];

export const INITIAL_HISTORY = [
  {
    historyId: "HIST-501",
    bookId: "101",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    borrowDate: "2026-08-10",
    returnDate: "2026-08-24",
    feedback: "Excellent guide for structuring functions."
  }
];
