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
        this.loadListings();
        this.setupEventListeners();
        this.loadCategoryFromURL();
        this.renderListings();
    }

    loadListings() {
        // Sample data - in a real app, this would come from an API
        this.listings = [
            {
                id: 1,
                title: "Copper Wiring (High Purity)",
                type: "metal",
                weight: "25kg",
                price: "$8.50/kg",
                location: "Sydney, NSW",
                image: "🔌",
                seller: "MetalRecycler123",
                rating: 4.8,
                posted: "2h ago",
                gradient: "from-orange-500 to-amber-600"
            },
            {
                id: 2,
                title: "Aluminum Cans (Bulk)",
                type: "metal",
                weight: "120kg",
                price: "$1.20/kg",
                location: "Melbourne, VIC",
                image: "🥫",
                seller: "EcoCollector",
                rating: 4.5,
                posted: "5h ago",
                gradient: "from-blue-500 to-cyan-600"
            },
            {
                id: 3,
                title: "Used Laptops (Working)",
                type: "electronics",
                weight: "8 units",
                price: "$35/unit",
                location: "Brisbane, QLD",
                image: "💻",
                seller: "TechSalvage",
                rating: 4.9,
                posted: "1d ago",
                gradient: "from-purple-500 to-indigo-600"
            },
            {
                id: 4,
                title: "Car Batteries",
                type: "batteries",
                weight: "6 units",
                price: "$18/unit",
                location: "Perth, WA",
                image: "🔋",
                seller: "AutoPartsWA",
                rating: 4.3,
                posted: "1d ago",
                gradient: "from-green-500 to-emerald-600"
            },
            {
                id: 5,
                title: "Steel Scrap (Mixed)",
                type: "metal",
                weight: "500kg",
                price: "$0.80/kg",
                location: "Adelaide, SA",
                image: "🛠️",
                seller: "SteelMasters",
                rating: 4.6,
                posted: "2d ago",
                gradient: "from-red-500 to-pink-600"
            },
            {
                id: 6,
                title: "Copper Pipes (Clean)",
                type: "metal",
                weight: "45kg",
                price: "$7.20/kg",
                location: "Newcastle, NSW",
                image: "🚰",
                seller: "PlumbRight",
                rating: 4.7,
                posted: "3d ago",
                gradient: "from-yellow-500 to-amber-600"
            },
            {
                id: 7,
                title: "Electrical Wiring (Stripped)",
                type: "wires",
                weight: "30kg",
                price: "$5.50/kg",
                location: "Gold Coast, QLD",
                image: "⚡",
                seller: "WireRecyclers",
                rating: 4.4,
                posted: "4d ago",
                gradient: "from-indigo-500 to-purple-600"
            },
            {
                id: 8,
                title: "Car Parts (Various)",
                type: "automotive",
                weight: "Mixed lot",
                price: "$250",
                location: "Canberra, ACT",
                image: "🚗",
                seller: "AutoSalvageAU",
                rating: 4.6,
                posted: "5d ago",
                gradient: "from-red-500 to-orange-600"
            },
            {
                id: 9,
                title: "Lithium Batteries (Rechargeable)",
                type: "batteries",
                weight: "12 units",
                price: "$22/unit",
                location: "Sydney, NSW",
                image: "🔋",
                seller: "BatteryWorld",
                rating: 4.7,
                posted: "6d ago",
                gradient: "from-teal-500 to-green-600"
            },
            {
                id: 10,
                title: "Circuit Boards (E-waste)",
                type: "electronics",
                weight: "15kg",
                price: "$12/kg",
                location: "Melbourne, VIC",
                image: "💾",
                seller: "TechRecyclers",
                rating: 4.4,
                posted: "1w ago",
                gradient: "from-violet-500 to-purple-600"
            },
            {
                id: 11,
                title: "Brass Fittings",
                type: "metal",
                weight: "35kg",
                price: "$6.50/kg",
                location: "Brisbane, QLD",
                image: "🔩",
                seller: "MetalWorks",
                rating: 4.5,
                posted: "1w ago",
                gradient: "from-yellow-600 to-orange-500"
            },
            {
                id: 12,
                title: "LED Light Strips (Bulk)",
                type: "electronics",
                weight: "50 units",
                price: "$3/unit",
                location: "Perth, WA",
                image: "💡",
                seller: "LightingPro",
                rating: 4.6,
                posted: "1w ago",
                gradient: "from-cyan-500 to-blue-600"
            }
        ];

        this.filteredListings = [...this.listings];
    }

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
        // Get the category from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        // If category exists in URL, set it as active filter
        if (category) {
            this.activeFilter = category.toLowerCase();
            console.log('Category from URL:', this.activeFilter);
        } else {
            this.activeFilter = 'all';
            console.log('No category in URL, showing all');
        }

        // Update UI to reflect active filter
        const filterButtons = document.querySelectorAll('.filter-btn');
        console.log('Found', filterButtons.length, 'filter buttons');

        filterButtons.forEach(btn => {
            const btnFilter = btn.getAttribute('data-filter');
            btn.classList.remove('active-filter');
            if (btnFilter === this.activeFilter) {
                btn.classList.add('active-filter');
                console.log('Set active filter on button:', btnFilter);
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
        this.applyFilters();
    }

    setCurrentPage(page) {
        const totalPages = Math.ceil(this.filteredListings.length / this.itemsPerPage);

        // Validate page number
        if (page < 1 || page > totalPages) {
            console.warn('Invalid page number:', page);
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

        console.log('Changed to page:', page);
    }

    applyFilters() {
        this.filteredListings = this.listings.filter(item => {
            const matchesFilter = this.activeFilter === 'all' || item.type === this.activeFilter;
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

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentListings = this.filteredListings.slice(startIndex, endIndex);

        if (currentListings.length === 0) {
            container.innerHTML = `
                <div class="col-span-3 card p-8 text-center">
                    <p class="text-slate-400">No listings match your search criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = currentListings.map(item => `
            <div class="listing-card">
                <div class="listing-gradient-bar bg-gradient-to-r ${item.gradient}"></div>
                <div class="p-5">
                    <div class="flex items-start">
                        <div class="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center text-3xl mr-4">
                            ${item.image}
                        </div>
                        <div class="flex-1">
                            <h3 class="font-semibold text-lg mb-1">${item.title}</h3>
                            <div class="flex items-center text-sm text-slate-400 mb-2">
                                <span class="capitalize">${item.type}</span>
                                <span class="mx-2">•</span>
                                <span>${item.weight}</span>
                            </div>
                            <div class="star-rating">
                                ${this.renderStars(item.rating)}
                                <span class="text-sm text-slate-400 ml-2">${item.rating}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 flex justify-between items-center">
                        <div>
                            <p class="text-emerald-400 font-bold text-xl">${item.price}</p>
                            <div class="flex items-center text-sm text-slate-400 mt-1">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                <span>${item.location}</span>
                            </div>
                        </div>
                        <button class="view-details flex items-center text-emerald-400 hover:text-emerald-300" data-id="${item.id}">
                            <span class="mr-1">View</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="px-5 py-3 bg-slate-800/30 border-t border-slate-700/50 flex justify-between items-center">
                    <span class="text-sm text-slate-400">@${item.seller}</span>
                    <span class="text-xs text-slate-500">${item.posted}</span>
                </div>
            </div>
        `).join('');

        this.renderPagination();
    }

    renderStars(rating) {
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
        const paginationContainer = document.getElementById('pagination');

        if (!paginationContainer) {
            console.warn('Pagination container not found');
            return;
        }

        // hide pagination if only one page or no results
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
        console.log('Pagination rendered:', totalPages, 'pages, current page:', this.currentPage);
    }

    viewListingDetails(listingId) {
        // store the listing ID for the details page
        sessionStorage.setItem('currentListingId', listingId);
        window.scrapSmartApp.showPage('details');
    }
}

// Initialize listings page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // only initialize if we're on the listings page
    if (document.getElementById('listingsContainer')) {
        new ListingsPage();
    }
});

// Initialize listings page when it becomes active (for SPA navigation)
window.addEventListener('pageChanged', (event) => {
    if (event.detail.page === 'listings') {
        new ListingsPage();
    }
});