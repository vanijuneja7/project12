# Surplus Food Rescue & NGO Matchmaking Platform

A full-stack web application designed to connect hostel messes, hotels, and restaurants with surplus food to local NGOs and charities for efficient, urgent food redistribution.

---

## 🌟 Key Features

1. **Role-Based Authentication (JWT & bcrypt)**:
   - **Food Donors** (Hostel Mess, Hotel, Restaurant, Corporate Cafeteria).
   - **NGOs** (Food distribution charities with specified daily serving capacity and dietary preferences).

2. **Surplus Food Donation Requests**:
   - Donors specify food type (Veg, Non-Veg, etc.), quantity (servings/kg), freshness/food age (e.g., *Fresh*, *1-2 hrs ago*, *3-4 hrs ago (Urgent)*), notes, and photos.

3. **Intelligent AI NGO Matchmaking Engine**:
   - Automatically scores and ranks registered NGOs using:
     - **Capacity Fit**: Matches food quantity against NGO daily capacity.
     - **Dietary Compatibility**: Matches food type (Veg, Non-Veg) to NGO preferences.
     - **Location/Proximity**: Prioritizes local NGOs in the same city for swift dispatch.
     - **Freshness Urgency**: Identifies urgent requests (e.g. prepared 3-4 hours ago) and matches NGOs capable of rapid distribution.
   - Provides a match score percentage (e.g., `96% Match`) and an explanation.

4. **Mutual Privacy Protection**:
   - While a food request is pending, contact details (phone number and detailed street address) are **locked and hidden**.
   - As soon as an NGO clicks **Accept**, the status becomes `accepted`, and **phone numbers and pickup addresses unlock for both sides** to coordinate handover.

5. **Google Maps NGO Search & Packaging**:
   - Search Google Maps listings near the current GPS location or selected city, with driving-time limits of **1 hour** or **1.5 hours**.
   - Results are filtered and sorted by Google Routes driving estimates. Public listings should be confirmed directly before assigning a donation.
   - Live in-app results require `GOOGLE_MAPS_API_KEY` in `backend/.env`, with **Places API (New)** and **Routes API** enabled for the same Google Cloud project and billing configured. Keep this key server-side; do not add it to the frontend.
   - Without a configured key, the nearby search opens Google Maps search as a fallback.
   - The receiving NGO provides food-safe packaging and transport containers for accepted pickups.

---

## 📁 Project Structure

```text
project11/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # User registration & login
│   │   ├── donationController.js # Food request lifecycle & privacy filtering
│   │   └── recommendationController.js # AI matching endpoint
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema (Donor & NGO fields)
│   │   └── Donation.js           # Food donation schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── donationRoutes.js     # /api/donations routes
│   │   ├── mapRoutes.js          # /api/maps routes
│   │   └── recommendationRoutes.js # /api/recommendations routes
│   ├── controllers/
│   │   └── mapController.js      # Google Places search + driving-time filtering
│   ├── services/
│   │   └── aiMatchingService.js  # Intelligent scoring algorithm
│   ├── uploads/                  # Uploaded food photos directory
│   ├── .env                      # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│   ├── package.json
│   └── server.js                 # Express server entry point
│
└── Frontend/
    ├── src/
    │   ├── api.js                # Centralized API service with auth token headers
    │   ├── App.css               # Clean modern responsive UI styles
    │   ├── App.jsx               # Donor & NGO portals, AI cards, request feeds
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 How to Run

### Database connection
The backend reads its database connection from `MONGO_URI`. For local development, copy `backend/.env.example` to `backend/.env` and fill in your connection string. To use Atlas, create an Atlas database user and add the Render service's outbound IP ranges to the Atlas project's Network Access list, then set the Atlas `mongodb+srv://` URI as `MONGO_URI` in the Render backend environment. Get the URI from Atlas's **Connect → Drivers** dialog. Atlas database users are separate from Atlas website accounts; the application connects using the database user and an IP access list entry. See the [Atlas connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/) and [Render outbound IP guide](https://render.com/docs/outbound-ip-addresses).

Do not commit `backend/.env` or put database credentials in frontend variables. Render needs its own `MONGO_URI` value in the backend service settings. Switching the URI connects to Atlas but does not copy documents from a local MongoDB server; migrate local data separately if you need it.

### Deploy the full app on Render
The root `render.yaml` defines a Node web service for the backend and a static site for the Vite frontend. Push the project to a Git provider, then create a **Blueprint** in Render from that repository. Render will prompt for `MONGO_URI`; enter the Atlas connection string there. `JWT_SECRET` is generated by Render. The backend selects the `food_rescue` database.

After Render creates the backend service, open its **Connect → Outbound** panel and add the listed CIDR ranges to Atlas **Network Access**. The IP entry for your laptop only covers local development. The frontend receives the deployed API URL from the backend service automatically. If you want live Google Maps NGO search in production, add `GOOGLE_MAPS_API_KEY` to the backend service's Environment settings after deployment.

### 1. Ensure MongoDB is Running
For local development, make sure your MongoDB server is active. When using Atlas, the database runs remotely and the backend uses the configured `MONGO_URI`.

### 2. Start the Backend Server
Open a terminal in `backend/`:
```bash
cd backend
npm run dev
# or: node server.js
```
The server will start at: `http://localhost:5000` (`MongoDB Connected: 127.0.0.1`)

### 3. Start the Frontend Application
Open a second terminal in `Frontend/`:
```bash
cd Frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Quick Test Walkthrough

1. **Register an NGO**:
   - Role: **NGO (Food Distribution / Charity)**
   - Name: `Feeding Hope Foundation`
   - Capacity: `150` servings/day
   - Phone: `9876543210`, City: `Mumbai`
   - Email: `ngo@feedinghope.org`, Password: `password123`

2. **Register a Donor**:
   - Role: **Food Donor**
   - Donor Type: `Hostel Mess`
   - Name: `Campus Central Mess`
   - Phone: `9123456789`, City: `Mumbai`
   - Email: `mess@campus.edu`, Password: `password123`

3. **Post Surplus Food with AI Matching**:
   - Fill in: `60 servings`, `Veg`, Food Age: `3-4 hours ago (Urgent)`.
   - Click **Run AI NGO Match** 🤖.
   - See the AI score (e.g., `95% Match`) with reasoning and click to select the NGO.
   - Click **Submit Food Donation Request**.
   - Notice that contact details show locked (`🔒 Contact details locked`).

4. **NGO Accepts & Phone Numbers Unlock**:
   - Log out and log in as the NGO (`ngo@feedinghope.org`).
   - Find the request in **Available Food Donation Requests** with the urgency tag.
   - Click **Accept Request**.
   - Contact details immediately unlock (`📞 Donor Phone: 9123456789`, `📍 Full Address`).
