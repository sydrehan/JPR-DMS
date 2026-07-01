# Hybrid Disaster Resilience & Rescue Infrastructure - Web Platform

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure
- `src/components`: Reusable UI components.
- `src/pages`: Application pages.
- `src/context`: React Context providers (Auth, etc.).
- `src/firebase`: Firebase configuration.
- `src/hooks`: Custom React hooks.
- `src/utils`: Helper functions.

## 🔐 Access & Authentication

### Login Credentials (Development Mode)
Since the full Firebase Auth configuration requires a private API key, the system includes a **Development Fallback** mode.

- **Email**: `admin@sih.gov.in`
- **Password**: `admin`
- **Role**: Super Admin (Full Access)

### User Roles
The platform supports role-based access control (RBAC). Currently configured roles:
1.  **Super Admin**: Full access to all dashboards, mesh networks, tower controls, and emergency broadcasts.
2.  **Rescue Team**: (Future) Access to local maps and assigned rescue tasks.
3.  **Public**: Read-only access to safety status and evacuation routes.

### 🌍 Public Interfaces
These pages are designed for specific hardware or public use and do not require standard login:

- **Tower Public Display**: `http://localhost:5173/public`
    - *Usage*: Displayed on the large screen attached to the Disaster Information Tower.
- **QR Route Viewer**: `http://localhost:5173/routes`
    - *Usage*: Mobile-optimized page loaded when a user scans a QR code on the tower.
- **Training Center**: `http://localhost:5173/training`
    - *Usage*: Educational portal for community awareness.
