# ScrapSmart: Online Scrap Marketplace

ScrapSmart is a full-stack web application designed to be a seamless, transparent marketplace connecting scrap sellers with buyers. The platform allows sellers to list their scrap materials, and buyers to browse, filter, and purchase them.

## 🚀 Key Features

### 1. User Authentication
* **Triple Roles:** Separate registration flows for "Buyers" and "Sellers. "Admin" roles can be assigned only by modifying the `role` column directly from the database"
* **Account Management:** Secure login and registration system.
* **PHP Backend:** Forms are set up to post to a PHP backend (`src/login.php`, `src/register.php` etc).

### 2. Seller Dashboard
* **List New Scrap:** A detailed form for sellers to list new items (title, type, weight, photo, description, price, location).
* **Manage Listings:** View all current listings, with options to edit or delete.
* **Recent Activity:** A feed showing recent orders, inquiries, and reviews.

### 3. Buyer Marketplace 
* **Browse & Search:** A full marketplace page to browse all available scrap.
* **Dynamic Filtering:** Filter listings by category (e.g., Metal, Electronics, Batteries, Automotive).
* **Detailed View:** Each listing has a detailed page showing:
    * Image gallery
    * Item specifications, description, and condition
    * Key stats (available quantity, minimum order)
    * Seller information and rating
* **Purchase Workflow:** Buyers can select a quantity, see a full price breakdown, and proceed to "Purchase" or "Send Inquiry."

### 4. Database Structure
* **MySQL Database:** The project is powered by a MySQL database named `scrap_smart`.
* **Users Table:** Stores user information, including their `role` ('buyer', 'seller', 'admin').
* **Scrap Requests Table:** Manages all scrap listings, tracking their name, type, weight, price, and `status` ('pending', 'accepted', 'completed', etc.).

## 🛠️ Technologies Used

* **Frontend:**
    * HTML5
    * Tailwind CSS (CDN)
    * JavaScript
    * Font Awesome (for icons)
* **Backend:**
    * PHP 
* **Database:**
    * MySQL

## 🔧 How to Set Up and Run

To get this project running locally, you will need a local server environment that supports PHP and MySQL (like XAMPP, MAMP, or WAMP).

### 1. Database Setup
1.  Start your MySQL server.
2.  Open a database management tool (like phpMyAdmin).
3.  Create a new database named `scrap_smart`.
4.  Run the SQL commands in `MySQL_DB_Setup_Query.txt` to create the `users` and `scrap_requests` tables.

### 2. Backend Server
1.  Place the entire project folder (including `index.html`, `auth.html`, etc.) inside your local server's web directory (e.g., `htdocs` in XAMPP).

### 3. Running the Application
1.  Start your local server (e.g., Apache in XAMPP).
2.  Open your web browser and navigate to the project's local URL (e.g., `http://localhost/your-project-folder-name/`).
3.  You should see the `index.html` homepage. You can now navigate to the Login/Signup, Buy Scrap, and Sell Scrap pages.

## 📁 File Structure

Here is a brief overview of the key files:

* `index.html`: The main landing page for the website.
* `auth.html`: Handles both user Login and Signup (for Buyers and Sellers).
* `listings.html`: The main marketplace page where buyers browse all listings.
* `scrap-detail.html`: The detailed view for a single scrap item.
* `seller.html`: The seller-facing dashboard for managing listings and sales.
* `MySQL_DB_Setup_Query.txt`: The SQL script to set up the necessary database tables.
* `components/`: Contains JSX components.
* `css/`: Contains stylesheets.
* `js/`: Contains JavaScript files.
* `src/`: Contains Backend PHP files.
* `uploads/`: Contains uploaded photos.
```
