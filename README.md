# Try & Buy Platform

A full-stack role-based e-commerce workflow for trial-first orders.

## Folder structure

```text
shopping project/
  Backend/
    src/
      config/
      constants/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
    .env.example
    package.json
  Frontend/
    src/
      api/
      components/
      context/
      pages/
    .env.example
    package.json
```

## Core features

- JWT authentication with customer, vendor, rider, and admin roles
- Product catalog with images, inventory, pricing, and vendor ownership
- Customer trial cart and Try & Buy order placement
- OTP verification at delivery handoff
- Mock payment authorization and capture/void flow
- Vendor order assignment and inventory management
- Rider delivery progression and customer decision confirmation
- Responsive React + Tailwind dashboards

## Sample data

Run the backend seed command after setting `.env` values:

```bash
cd Backend
npm install
npm run seed
```

Sample credentials after seeding:

- `admin@trybuy.com / Password123`
- `vendor@trybuy.com / Password123`
- `rider@trybuy.com / Password123`
- `user@trybuy.com / Password123`

## Backend API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/products`
- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:productId`
- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/:orderId/decision`
- `GET /api/vendor/dashboard`
- `PATCH /api/vendor/orders/:orderId/assign-rider`
- `GET /api/rider/dashboard`
- `PATCH /api/rider/orders/:orderId/status`
- `PATCH /api/rider/orders/:orderId/verify-otp`
- `PATCH /api/rider/orders/:orderId/decision`

## Local run

Backend:

```bash
cd Backend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL` to the backend API URL if you change the default port.
