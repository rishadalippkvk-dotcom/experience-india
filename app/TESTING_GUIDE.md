# 🧪 Admin Panel Testing Guide

## Quick Start

Your servers are already running! Open your browser and test the admin panel:

### 1️⃣ Login to Admin Panel

**URL**: http://localhost:5173/admin

**Credentials**:
- Username: `admin`
- Password: `admin123`

---

## 2️⃣ Test Each Page

### Dashboard Overview
**URL**: http://localhost:5173/admin/dashboard

**What to Check**:
- ✅ Stats cards show correct counts (Destinations, Food Spots, Hostels, Pending Reviews)
- ✅ System Overview section displays
- ✅ Quick Action buttons navigate correctly
- ✅ Top Destinations table shows data

---

### Destinations Manager
**URL**: http://localhost:5173/admin/dashboard/destinations

**Test Actions**:
1. **Search**: Type a destination name in the search box
2. **Filter**: Select a category from the dropdown (History, Nature, Mystery, etc.)
3. **Sort**: Try sorting by Rating, Name, or Recent
4. **Create**: Click "Add Destination" button
   - Fill in all fields (Name, Location, Category, Rating, etc.)
   - Click "Create"
5. **Edit**: Hover over a destination card and click the edit icon
   - Modify some fields
   - Click "Update"
6. **Delete**: Hover over a destination card and click the trash icon
   - Confirm deletion

---

### Food Spots Manager
**URL**: http://localhost:5173/admin/dashboard/food-spots

**Test Actions**:
1. **Search**: Search by restaurant name or cuisine
2. **Create**: Click "Add Food Spot"
   - Select a destination
   - Enter name, cuisine, rating, price range
   - Click "Create"
3. **Edit**: Click edit icon on a food spot card
4. **Delete**: Click trash icon and confirm

---

### Hostels Manager
**URL**: http://localhost:5173/admin/dashboard/hostels

**Test Actions**:
1. **Search**: Search by hostel name
2. **Create**: Click "Add Hostel"
   - Select a destination
   - Enter name, rating, price range
   - **Select amenities** (WiFi, AC, Kitchen, etc.) - they should toggle gold when selected
   - Click "Create"
3. **Edit**: Modify a hostel
4. **Delete**: Remove a hostel

---

### Reviews Manager ⭐ (Most Important!)
**URL**: http://localhost:5173/admin/dashboard/reviews

**Test Actions**:
1. **View Stats**: Check Total, Approved, and Pending counts at the top
2. **Filter by Status**: 
   - Select "Pending" to see unapproved reviews (orange border)
   - Select "Approved" to see approved reviews (green badge)
3. **Filter by Rating**: Select 5 Stars, 4 Stars, etc.
4. **Search**: Search by author name or review content
5. **Approve Review**: 
   - Find a pending review (orange "Pending" badge)
   - Click the green "Approve" button
   - Review should update to show green "Approved" badge
6. **Delete Review**: Click trash icon and confirm

---

## 3️⃣ Expected Behavior

### ✅ Success Indicators
- No console errors (press F12 to check)
- Smooth navigation between pages
- Forms submit successfully with toast notifications
- Data updates immediately after operations
- Search and filters work in real-time
- Loading spinners appear during API calls

### ❌ Common Issues

**If you see "Failed to load data"**:
- Check that backend server is running on port 5000
- Check browser console for CORS errors

**If login doesn't work**:
- Verify credentials: `admin` / `admin123`
- Check that JWT token is being stored in localStorage

**If reviews don't show approval status**:
- The database schema was updated - existing reviews might need the `approved` field
- New reviews will have `approved: false` by default

---

## 4️⃣ Quick API Tests (Optional)

Open a new terminal and test the API directly:

```powershell
# Test destinations endpoint
curl http://localhost:5000/api/destinations

# Test reviews endpoint
curl http://localhost:5000/api/destinations/reviews/all

# Test filtering
curl "http://localhost:5000/api/destinations?category=history&sort=rating"
```

---

## 5️⃣ Demo Flow for Examiner

1. **Login** → Show authentication
2. **Dashboard** → Point out real-time stats and pending reviews
3. **Destinations** → Demonstrate search, filter, and sort
4. **Reviews** → Show approval workflow (pending → approved)
5. **Create New** → Add a hostel with amenities selection

**Key Talking Points**:
- "Full CRUD operations on all entities"
- "Review approval workflow for content moderation"
- "Search and filtering across all pages"
- "Real-time dashboard with statistics"
- "Protected routes with JWT authentication"

---

## 🎯 Examiner Question

**Q: "What can admin do?"**

**A**: "Admin can manage destinations, restaurants, hostels, and user reviews through full CRUD operations with search and filtering capabilities. The system includes a review approval workflow where admins can moderate user-submitted reviews before they appear publicly."

---

## 📸 Screenshots to Take

For your project documentation, capture:
1. Dashboard overview with stats
2. Destinations manager with filters
3. Reviews manager showing pending/approved reviews
4. Hostel creation form with amenities
5. Review approval action (before/after)

---

**Ready to test!** Open http://localhost:5173/admin in your browser now. 🚀
