
# LeadDesk Mini

A full-stack lead management application that helps businesses collect, track, and manage customer enquiries through an admin dashboard.

## Features

- Customer lead submission form
- Input validation
- Secure admin login using JWT authentication
- Protected admin routes
- Dashboard to view and manage leads
- Update lead status
- Edit and delete leads
- Search, sorting, and pagination
- Dashboard statistics
- Responsive user interface

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Project Structure

```text
LeadDesk-Mini/
├── client/
│   └── src/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── createAdmin.js
│   └── server.js
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ARADHANA695/LeadDesk-Mini.git
cd LeadDesk-Mini
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Create the admin account:

```bash
node createAdmin.js
```

Start the backend:

```bash
npm run dev
```

The backend runs at `http://localhost:8000`.

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## Admin Login

Default local test credentials:

- Email: `admin@leaddesk.com`
- Password: `admin123`

Change the default password before using the application in production.

## Environment Variables

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key used for JWT authentication |

## Author

Developed as a full-stack lead management assignment.
