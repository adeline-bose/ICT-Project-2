// Home page functionality
class HomePage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFeaturedListings();
    }

    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                this.filterByCategory(category);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('homeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    loadFeaturedListings() {
        // Simulate loading featured listings
        const featuredContainer = document.getElementById('featuredListings');
        if (!featuredContainer) return;

        const featuredListings = [
            {
                id: 1,
                title: "Premium Copper Wiring",
                type: "metal",
                price: "$8.50/kg",
                location: "Sydney, NSW",
                image: "🔌"
            },
            {
                id: 2,
                title: "Aluminum Cans (Bulk)",
                type: "metal",
                price: "$1.20/kg",
                location: "Melbourne, VIC",
                image: "🥫"
            },
            {
                id: 3,
                title: "Used Laptops",
                type: "electronics",
                price: "$35/unit",
                location: "Brisbane, QLD",
                image: "💻"
            }
        ];

        featuredContainer.innerHTML = featuredListings.map(listing => `
            <div class="card p-4">
                <div class="flex items-start mb-3">
                    <div class="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-2xl mr-3">
                        ${listing.image}
                    </div>
                    <div>
                        <h3 class="font-semibold">${listing.title}</h3>
                        <p class="text-slate-400 text-sm">${listing.type}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-emerald-400 font-bold">${listing.price}</span>
                    <span class="text-slate-400 text-sm">${listing.location}</span>
                </div>
            </div>
        `).join('');
    }

    filterByCategory(category) {
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active-filter');
        });
        event.target.classList.add('active-filter');

        // In a real app, this would filter the listings
        console.log(`Filtering by category: ${category}`);
    }

    handleSearch(query) {
        // In a real app, this would search through listings
        console.log(`Searching for: ${query}`);
    }
}

// Initialize home page when it becomes active
window.addEventListener('pageChanged', (event) => {
    if (event.detail.page === 'home') {
        new HomePage();
    }
});