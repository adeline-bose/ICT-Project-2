// Test setup file for Jest
// This file runs before all tests

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock window.scrapSmartApp
global.window.scrapSmartApp = {
  showPage: jest.fn(),
};

// Mock window.location
delete window.location;
window.location = {
  search: '',
  href: '',
};

// Helper to reset DOM between tests
global.resetDOM = () => {
  document.body.innerHTML = '';
};

// Helper to create a mock listings container
global.createListingsContainer = () => {
  document.body.innerHTML = `
    <div id="listingsContainer"></div>
    <div id="pagination"></div>
    <input id="searchInput" />
    <button id="searchBtn"></button>
    <div class="filter-btn" data-filter="all"></div>
    <div class="filter-btn" data-filter="metal"></div>
    <div class="filter-btn" data-filter="electronics"></div>
  `;
};
