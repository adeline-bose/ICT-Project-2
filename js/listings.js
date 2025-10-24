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
            }
        ];

        this.filteredListings = [...this.listings];
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveFilter(btn.getAttribute('data-filter'));
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.setSearchQuery(e.target.value);
            });
        }

        // Pagination
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                this.setCurrentPage(page);
            });
        });

        // View details buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-details')) {
                const listingId = e.target.closest('.view-details').getAttribute('data-id');
                this.viewListingDetails(listingId);
            }
        });
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
        this.currentPage = page;
        this.renderListings();
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
        
        if (!paginationContainer || totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        
        let paginationHTML = `
            <button class="page-btn px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-l-lg hover:bg-slate-700/50" 
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
            <button class="page-btn px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-r-lg hover:bg-slate-700/50" 
                    ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
                Next
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    viewListingDetails(listingId) {
        // Store the listing ID for the details page
        sessionStorage.setItem('currentListingId', listingId);
        window.scrapSmartApp.showPage('details');
    }
}

// Initialize listings page when it becomes active
window.addEventListener('pageChanged', (event) => {
    if (event.detail.page === 'listings') {
        new ListingsPage();
    }
});