// Listings page functionality
class ListingsPage {
    constructor() {
        this.listings = [];
        this.filteredListings = [];
        this.activeFilter = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        this.itemsPerPage = 6;

        this.init();
    }

    init() {
        this.loadListings(); // This function is now changed
        this.setupEventListeners();
        this.loadCategoryFromURL();
        this.renderListings();
    }

    // --- THIS IS THE FIXED FUNCTION ---
    loadListings() {
        // Check if our PHP file gave us real data
        if (typeof window.PHP_LISTINGS !== 'undefined' && Array.isArray(window.PHP_LISTINGS)) {
            
            // Map the PHP data (e.g., 'scrap_name') to the format our JS expects (e.g., 'title')
            this.listings = window.PHP_LISTINGS.map(item => ({
                id: item.id,
                title: item.scrap_name,
                type: item.scrap_type,
                weight: `${item.weight_kg} kg`,
                price: `$${item.unit_price}/kg`, // Format price
                location: item.address,
                // Check for a photo, otherwise use a fallback icon
                image: item.photo_url 
                    ? `<img src="${item.photo_url}" alt="${item.scrap_name}" class="w-full h-full object-cover">` 
                    : '<img src="uploads/Logo.png" alt="Default Scrap Image" class="w-full h-full object-cover rounded-lg">', 
                seller: item.bname,
                rating: 4.5, // Your DB doesn't have ratings yet, so we'll fake this
                posted: new Date(item.created_at).toLocaleDateString(), // Format the date
                gradient: "from-blue-500 to-cyan-600" // Can be randomized later
            }));
            
        } else {
            // Fallback in case something breaks
            console.warn("PHP_LISTINGS data not found. Loading empty list.");
            this.listings = [];
        }

        this.filteredListings = [...this.listings];
    }
    // --- END OF FIXED FUNCTION ---

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.setSearchQuery(e.target.value);
            });
        }

        // Search button
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // --- THIS IS THE NEW, MISSING CODE ---
        // We'll use event delegation on the bar that holds the buttons
        const filterBar = document.querySelector('.flex.overflow-x-auto');
        if (filterBar) {
            filterBar.addEventListener('click', (e) => {
                const filterBtn = e.target.closest('.filter-btn');
                if (filterBtn) {
                    this.setActiveFilter(filterBtn.getAttribute('data-filter'));
                }
            });
        }
        // --- END OF NEW CODE ---

        // Pagination - use event delegation since buttons are dynamically created
        document.addEventListener('click', (e) => {
            const pageBtn = e.target.closest('.page-btn');
            if (pageBtn) {
                const page = parseInt(pageBtn.getAttribute('data-page'));
                if (!isNaN(page) && page > 0) {
                    this.setCurrentPage(page);
                }
            }

            // View details buttons
            if (e.target.closest('.view-details')) {
                const listingId = e.target.closest('.view-details').getAttribute('data-id');
                this.viewListingDetails(listingId);
            }
        });
    }

    loadCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            this.activeFilter = category.toLowerCase();
        } else {
            this.activeFilter = 'all';
        }

        // Update UI to reflect active filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active-filter');
            if (btn.getAttribute('data-filter') === this.activeFilter) {
                btn.classList.add('active-filter');
            }
        });

        // Apply the filter
        this.applyFilters();
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        // Update UI
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active-filter');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active-filter');
            }
        });

        this.applyFilters();
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        // Trigger search on input change, no need for button
        this.applyFilters();
    }

    setCurrentPage(page) {
        const totalPages = Math.ceil(this.filteredListings.length / this.itemsPerPage);
        if (page < 1 || (totalPages > 0 && page > totalPages)) {
            return;
        }

        this.currentPage = page;
        this.renderListings();

        // Scroll to top of listings with offset
        const listingsContainer = document.getElementById('listingsContainer');
        if (listingsContainer) {
            const offset = 100; // for a gap from the header
            const elementPosition = listingsContainer.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    applyFilters() {
        this.filteredListings = this.listings.filter(item => {
            const matchesFilter = this.activeFilter === 'all' || item.type.toLowerCase() === this.activeFilter;
            const matchesSearch = item.title.toLowerCase().includes(this.searchQuery) || 
                                 item.seller.toLowerCase().includes(this.searchQuery);
            return matchesFilter && matchesSearch;
        });

        this.currentPage = 1; // Reset to first page when filters change
        this.renderListings();
    }

    renderListings() {
        const container = document.getElementById('listingsContainer');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentListings = this.filteredListings.slice(startIndex, endIndex);

        if (currentListings.length === 0) {
            container.innerHTML = `
                <div class="col-span-1 sm:col-span-2 lg:col-span-3 card p-8 text-center">
                    <i class="fas fa-box-open text-4xl mb-4 text-slate-500"></i>
                    <h3 class="text-xl font-semibold mb-2">No Listings Found</h3>
                    <p class="text-slate-400">No listings match your search criteria. Try removing some filters.</p>
                </div>
            `;
            this.renderPagination(); // Render empty pagination
            return;
        }

        // --- UPDATED RENDER FUNCTION ---
        // This now matches the new card style from your buyer dashboard
        container.innerHTML = currentListings.map(item => `
            <div class="card flex flex-col overflow-hidden">
                <div class="h-48 w-full bg-slate-700 flex items-center justify-center text-3xl">
                    ${item.image} </div>
                
                <div class="p-4 flex flex-col flex-1">
                    <h3 class="text-xl font-semibold mb-2">${item.title}</h3>
                    
                    <p class="text-sm text-slate-400 mb-2">
                        Sold by: <strong class="text-slate-300">@${item.seller}</strong>
                    </p>
                    
                    <div class="flex gap-2 mb-4">
                        <span class="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300 capitalize">
                            ${item.type}
                        </span>
                        <span class="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-300">
                            ${item.weight}
                        </span>
                    </div>
                    
                    <p class="text-2xl font-bold text-emerald-400 mb-4">
                        ${item.price}
                    </p>
                    
                    <div class="text-sm text-slate-400 flex items-center mb-4">
                         <i class="fas fa-map-marker-alt mr-2"></i>
                         <span>${item.location}</span>
                    </div>

                    <div class="flex-1"></div> 
                    
                    <button class="view-details w-full btn-primary text-center" data-id="${item.id}">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');

        this.renderPagination();
    }

    renderStars(rating) {
        // This function is no longer used in the new card, but we can leave it
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star filled"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt half-filled"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star"></i>';
        }
        return stars;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredListings.length / this.itemsPerPage);
        // --- PAGINATION FIX ---
        // Find the div you originally had
        const paginationContainer = document.getElementById('pagination');

        if (!paginationContainer) {
            console.warn('Pagination container not found');
            return;
        }

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            paginationContainer.parentElement.style.display = 'none';
            return;
        }

        paginationContainer.parentElement.style.display = 'flex';

        let paginationHTML = `
            <button class="page-btn px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-l-lg hover:bg-slate-700/50 ${
                this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }"
                    ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
                Previous
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="page-btn px-4 py-2 border border-slate-700/50 ${
                    i === this.currentPage
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        paginationHTML += `
            <button class="page-btn px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-r-lg hover:bg-slate-700/50 ${
                this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }"
                    ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                Next
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    viewListingDetails(listingId) {
        // Go to the new details page, passing the ID in the URL
        window.location.href = `src/details.php?id=${listingId}`;
    }
}

// Initialize listings page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('listingsContainer')) {
        new ListingsPage();
    }
});

// Remove the 'pageChanged' event listener, as it's not needed