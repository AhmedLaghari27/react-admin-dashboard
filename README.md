# MANTIX - React Admin Dashboard

A modern, full-featured admin dashboard built with React, Mantine UI, and Keycloak authentication. Features role-based access control, user management, and a stunning dark futuristic UI.

![MANTIX Dashboard](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Keycloak](https://img.shields.io/badge/Keycloak-23.x-red)

## 🚀 Features

### Authentication & Authorization
- 🔐 Keycloak integration for enterprise-grade security
- 🎨 Custom login & registration pages (no Keycloak redirects)
- 👥 Role-based access control (Admin & User roles)
- 🔑 JWT token management with auto-refresh

### Admin Dashboard
- 📊 User analytics and statistics
- 👤 Full user management (CRUD operations)
- 📦 Product inventory management
- 🛒 Order tracking and status updates
- 🔍 Real-time user data from Keycloak

### User Dashboard
- 📈 Personal order history
- 💰 Spending analytics
- 🛍️ Product browsing
- ✅ Order status tracking

### UI/UX
- 🌙 Dark futuristic theme with glassmorphism
- 🎨 Gradient animations and glow effects
- 📱 Fully responsive design
- ⚡ Fast and smooth transitions

## 🛠️ Tech Stack

**Frontend:**
- React 18 (Vite)
- TypeScript
- Mantine UI v7
- React Router v6
- Recharts (data visualization)
- Tabler Icons

**Backend:**
- Keycloak 23.0.0 (Authentication & Authorization)

## 📋 Prerequisites

- Node.js 18+ and npm
- Java JDK 11+ (for Keycloak)
- Git

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/mantix-admin-dashboard.git
cd mantix-admin-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Keycloak

**Download & Start:**
```bash
# Download Keycloak 23.0.0 from https://www.keycloak.org/downloads
# Extract to C:\keycloak-23.0.0 (Windows) or ~/keycloak-23.0.0 (Linux/Mac)

# Start Keycloak
cd C:\keycloak-23.0.0\bin
kc.bat start-dev  # Windows
./kc.sh start-dev  # Linux/Mac
```

**Configure Keycloak:**

1. Open http://localhost:8080
2. Create admin account (first time only)
3. Create realm: `mantix`
4. Create client: `mantix-app`
   - Client authentication: ON
   - Direct access grants: ON
   - Service accounts roles: ON
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
5. Go to **Credentials** tab → Copy **Client Secret**
6. Create roles: `admin`, `user`
7. Assign service account permissions:
   - Service account roles → realm-management → `realm-admin`

### 4. Configure Environment

Update `src/services/keycloakService.ts`:
```typescript
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
```

Update `src/contexts/AppDataContext.tsx`:
```typescript
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
```

### 5. Create Admin User

In Keycloak Admin Console:
1. Users → Add user
2. Username: `admin.user`
3. Email: `admin@mantix.com`
4. First name: `Admin`, Last name: `User`
5. Save → Credentials → Set password: `Admin@123`
6. Role mapping → Assign `admin` role

## 🚀 Running the Application

```bash
# Start Keycloak (in separate terminal)
cd C:\keycloak-23.0.0\bin
kc.bat start-dev

# Start React app
npm run dev
```

Open http://localhost:5173

**Login credentials:**
- Admin: `admin.user` / `Admin@123`
- Or register new user at `/signup`

## 📁 Project Structure

```
mantix-admin-dashboard/
├── src/
│   ├── auth/
│   │   └── AuthContexts.tsx          # Authentication context
│   ├── components/
│   │   ├── ProtectedRoute.tsx        # Route protection
│   │   └── RoleBasedDashboard.tsx
│   ├── contexts/
│   │   └── AppDataContext.tsx        # Global state management
│   └── services/
│       └── keycloakService.ts        # Keycloak API integration
├── Frontend/src/
│   ├── layouts/
│   │   └── DashboardLayout.tsx       # Main layout with navbar
│   └── pages/
│       ├── Login.tsx                 # Custom login page
│       ├── Signin.tsx                # Registration page
│       ├── Dashboard.tsx             # Role-based dashboard
│       ├── Users.tsx                 # User management (Admin)
│       ├── Products.tsx              # Product management
│       └── Orders.tsx                # Order management
└── README.md
```

## 🎯 Usage

### For Users:
1. Register at `/signup`
2. Login with credentials
3. View personal dashboard with order history
4. Browse products and track orders

### For Admins:
1. Login with admin credentials
2. Access admin dashboard with analytics
3. Manage users (create, edit, delete)
4. View all orders and user activity
5. Manage products and inventory

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Protected routes
- Service account for admin operations
- Auto token refresh (every 60 seconds)
- Secure password storage in Keycloak

## 🎨 Design System

**Colors:**
- Primary: `#4988C4`
- Secondary: `#667eea`
- Success: `#51cf66`
- Warning: `#ffa94d`
- Error: `#ff6b6b`

**Theme:**
- Dark background with gradient
- Glassmorphism cards
- Glow effects on hover
- Smooth animations

## 🐛 Troubleshooting

**Users not showing:**
- Verify Keycloak is running on port 8080
- Check CLIENT_SECRET is correct
- Ensure service account has `realm-admin` role

**Login redirect not working:**
- Clear browser localStorage
- Hard refresh (Ctrl + Shift + R)
- Check browser console for errors

**Registration fails:**
- Verify admin credentials in `keycloakService.ts`
- Check Keycloak admin token permissions
- Enable service accounts in client settings

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React + Keycloak**

⭐ Star this repo if you find it helpful!
