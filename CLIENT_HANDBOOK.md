# 📖 Maison de Parfum — Client Operations Handbook & Admin Guide

Welcome to the **Maison de Parfum** E-Commerce Management Handbook. This manual provides complete instructions for operating your luxury perfume store, managing products, setting prices, handling discounts, and processing customer orders via the **Medusa Admin Dashboard**.

---

## 📌 1. Quick Access Summary

| Environment | Access Link | Credentials / Info |
| :--- | :--- | :--- |
| **Storefront (Website)** | [http://localhost:8000](http://localhost:8000) | Public customer storefront |
| **Admin Dashboard** | [http://localhost:9000/app](http://localhost:9000/app) | **Email**: `admin@gmail.com`<br>**Password**: `admin123456` |
| **Backend API Server** | [http://localhost:9000](http://localhost:9000) | Medusa.js v2 Engine |

---

## 🚀 2. Server Startup Guide (Starting the Website)

If your laptop or server restarts, follow these 2 steps to launch both the backend server and frontend storefront:

### **Step 1: Launch the Medusa Backend Server**
Open a terminal (Command Prompt or PowerShell) and run:
```bash
cd d:\Perfume\backend\apps\backend
node node_modules\@medusajs\cli\cli.js develop
```
*Wait until you see:* `√ Server is ready on port: 9000`

### **Step 2: Launch the Next.js Storefront**
Open a **second** terminal window and run:
```bash
cd d:\Perfume\frontend
npm run dev -- -p 8000
```
*Now visit [http://localhost:8000](http://localhost:8000) in your browser!*

---

## 🛠️ 3. Admin Dashboard Operations Guide

To log into your admin panel, go to **[http://localhost:9000/app](http://localhost:9000/app)** and log in with:
- **Email**: `admin@gmail.com`
- **Password**: `admin123456`

---

### 3.1 Managing Existing Fragrances

1. Click **Products** in the left sidebar menu. You will see all **15 Extrait de Parfum products**.
2. **Editing a Product**:
   - Click on any perfume title (e.g. *Noir Élégance*).
   - Update the **Title**, **Description**, **Category**, or **Images**.
   - Under **Variants**, click on `50ml` or `100ml` to modify prices or inventory stock.
   - Click **Save Changes**.
3. **Deleting a Product**:
   - Click the **three dots (`...`)** icon on the right side of the product row.
   - Select **Delete Product** and confirm.

---

### 3.2 Adding a New Fragrance (Step-by-Step)

To add a new perfume release to your store:

1. Go to **Products** and click the golden **"+ Create"** button in the top-right corner.
2. **General Details**:
   - **Title**: Enter perfume name (e.g., *Amber de Soir*).
   - **Subtitle**: Enter olfactory family or tagline (e.g., *Oriental Extrait de Parfum*).
   - **Description**: Add scent notes (Top, Heart, Base) and atelier story.
3. **Product Options**:
   - Create an option called `Bottle Size` with values `50ml` and `100ml`.
4. **Variants & Pricing**:
   - Set USD price for `50ml` (e.g., `$135.00`).
   - Set USD price for `100ml` (e.g., `$215.00`).
   - Enter starting stock level (e.g., `500` units per size).
5. **Media / Images**:
   - Upload high-resolution bottle photography.
6. Click **Publish** — your new perfume will immediately appear live on your storefront!

---

### 3.3 Inventory & Stock Management

1. Click **Inventory** or view **Variants** inside any product page.
2. To replenish stock after receiving a new shipment from the atelier:
   - Click on the target variant (`50ml` or `100ml`).
   - Adjust the **Quantity in Stock** count.
   - Save changes. Items will automatically mark as *In Stock* on the storefront.

---

### 3.4 Creating Promotional Discount Codes

To create promotional codes for marketing campaigns (e.g., VIP sales or newsletter subscribers):

1. Click **Promotions** in the left menu.
2. Click **"+ Create Promotion"**.
3. Select **Promotion Type**:
   - **Percentage**: (e.g., `20% OFF` total bag value).
   - **Fixed Amount**: (e.g., `$30 OFF` order).
4. Enter the **Promo Code** (e.g. `PARIS20` or `WELCOME10`).
5. (Optional) Set an expiration date or maximum redemption limit.
6. Click **Save**. Customers can enter this code at checkout to claim their discount!

---

### 3.5 Fragrance Catalog Original Base Prices Reference (INR)

When setting discounted sale prices for Campaigns or Price Lists (e.g. **Summer Flash Sale**), use this table as a reference for original base prices:

| Perfume Title | 50ml Base Price | 100ml Base Price |
| :--- | :--- | :--- |
| **Amber Nocturne** | ₹11,205 | ₹17,430 |
| **Ambre Impérial** | ₹13,280 | ₹20,750 |
| **Cedar Drift** | ₹9,960 | ₹15,770 |
| **Celestial Bergamot** | ₹9,960 | ₹15,770 |
| **Cypress Shadow** | ₹10,375 | ₹16,185 |
| **Figue Sauvage** | ₹9,545 | ₹15,355 |
| **Iris Royale** | ₹12,035 | ₹18,675 |
| **Jasmine Nuit** | ₹11,620 | ₹18,260 |
| **Musc Absolu** | ₹11,205 | ₹17,845 |
| **Néroli Solaire** | ₹10,375 | ₹16,185 |
| **Noir Élégance** | ₹12,035 | ₹18,260 |
| **Santal Impérial** | ₹12,450 | ₹19,505 |
| **Smoked Vanilla & Tabac** | ₹10,790 | ₹17,015 |
| **Velvet Rose & Oud** | ₹12,865 | ₹19,920 |
| **Vétiver Sublime** | ₹10,790 | ₹16,600 |

---

### 3.6 Processing Customer Orders

1. Click **Orders** in the left sidebar menu.
2. When a customer places an order on the storefront, it will appear at the top of the list with:
   - Order Number & Timestamp
   - Selected Bottle Volume (50ml or 100ml) & Quantity
   - Order Total ($ USD)
   - Customer Shipping Address
3. Click on the order to view full details.
4. Once the bottle is packed and handed to the courier:
   - Click **Create Fulfillment**.
   - (Optional) Enter the tracking number.
   - Mark the order as **Shipped**.

---

## 🔒 4. Admin Security & Account Management

### **How to Change Your Admin Password**
1. Click your profile icon at the bottom-left of the admin sidebar.
2. Select **Profile Settings**.
3. Enter your new password and click **Update Password**.

---

## 📞 5. Technical Support Contact

For technical assistance, server migration, or custom code additions:
- **Database Name**: `medusa_perfume`
- **Database Engine**: PostgreSQL 18
- **Documentation**: Refer to `CLIENT_HANDBOOK.md` in the project root directory.
