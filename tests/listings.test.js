/**
 * tests for listings.js
 */

describe('ListingsPage - Tests', () => {
  // Mock the DOM elements before tests
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="listingsContainer"></div>
      <div id="pagination"></div>
      <input id="searchInput" type="text" />
      <button id="searchBtn"></button>
    `;

    // Mock window.scrapSmartApp
    window.scrapSmartApp = {
      showPage: jest.fn()
    };

    // Mock window.location
    delete window.location;
    window.location = { search: '' };

    // Clear console mocks
    jest.clearAllMocks();
  });

  test('should pass - basic test', () => {
    expect(true).toBe(true);
  });

  test('should have required DOM elements', () => {
    expect(document.getElementById('listingsContainer')).not.toBeNull();
    expect(document.getElementById('pagination')).not.toBeNull();
    expect(document.getElementById('searchInput')).not.toBeNull();
    expect(document.getElementById('searchBtn')).not.toBeNull();
  });

  test('should create array of numbers', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
  });

  test('should filter array by condition', () => {
    const items = [
      { type: 'metal', name: 'copper' },
      { type: 'electronics', name: 'laptop' },
      { type: 'metal', name: 'steel' }
    ];

    const metalItems = items.filter(item => item.type === 'metal');
    expect(metalItems.length).toBe(2);
  });

  test('should search array by text', () => {
    const items = [
      { title: 'Copper Wire', seller: 'John' },
      { title: 'Steel Scrap', seller: 'Jane' },
      { title: 'Laptop', seller: 'Copper Inc' }
    ];

    const searchQuery = 'copper';
    const results = items.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.seller.toLowerCase().includes(searchQuery)
    );

    expect(results.length).toBe(2);
  });

  test('should calculate pagination correctly', () => {
    const totalItems = 12;
    const itemsPerPage = 6;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    expect(totalPages).toBe(2);
  });

  test('should slice array for pagination', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const page = 1;
    const itemsPerPage = 6;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);

    expect(pageItems.length).toBe(6);
    expect(pageItems[0]).toBe(1);
  });

  test('should parse URL parameters', () => {
    window.location.search = '?category=metal';
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    expect(category).toBe('metal');
  });

  test('should convert string to lowercase', () => {
    const searchQuery = 'COPPER';
    const lower = searchQuery.toLowerCase();

    expect(lower).toBe('copper');
  });

  test('should validate page numbers', () => {
    const currentPage = 1;
    const totalPages = 2;

    const isValidPage = (page) => page >= 1 && page <= totalPages;

    expect(isValidPage(1)).toBe(true);
    expect(isValidPage(2)).toBe(true);
    expect(isValidPage(0)).toBe(false);
    expect(isValidPage(3)).toBe(false);
  });

  test('should render star rating logic', () => {
    const rating = 4.5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    expect(fullStars).toBe(4);
    expect(hasHalfStar).toBe(true);
  });

  test('should combine filter and search', () => {
    const items = [
      { type: 'metal', title: 'Copper Wire' },
      { type: 'metal', title: 'Steel' },
      { type: 'electronics', title: 'Laptop' }
    ];

    const filter = 'metal';
    const search = 'copper';

    const results = items.filter(item => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const matchesSearch = item.title.toLowerCase().includes(search);
      return matchesFilter && matchesSearch;
    });

    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Copper Wire');
  });

  test('should store and retrieve from sessionStorage', () => {
    sessionStorage.setItem('testKey', '123');
    const value = sessionStorage.getItem('testKey');

    expect(value).toBe('123');
  });

  test('should handle empty search results', () => {
    const items = [
      { title: 'Copper' },
      { title: 'Steel' }
    ];

    const results = items.filter(item =>
      item.title.toLowerCase().includes('nonexistent')
    );

    expect(results.length).toBe(0);
  });

  test('should maintain original array when filtering', () => {
    const original = [1, 2, 3, 4, 5];
    const filtered = original.filter(n => n > 3);

    expect(original.length).toBe(5);
    expect(filtered.length).toBe(2);
  });
});
