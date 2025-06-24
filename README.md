# Role-Based Document Management System (NestJS + SQL)

A robust backend API for managing tasks, users, and documents with **authentication**, **role-based access control**, **secure file upload**, and **JWT-based login**, built using **NestJS** and **TypeORM** with MySQL/PostgreSQL.

---

## Features

- User registration & login using JWT
- Admin & User roles with route protection
- Role-based permissions using decorators & guards
- Admin: Manage all users (status, profile, roles)
- Users: View & edit their own profile
- Upload, update, get, and delete documents (PDF, DOCX, images)
- Modular, scalable folder structure
- Environment-based configuration
- TypeORM for data persistence

---

## Tech Stack

- **Backend**: NestJS
- **Database**: MySQL / PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **File Upload**: Multer
- **Validation**: class-validator

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/git-mahad/DMS.git
cd DMS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_DATABASE=task_management
JWT_SECRET=your_jwt_secret
```

### 4. Run Migrations / Sync Entities

Ensure your database exists. Then:

```bash
npm run start:dev
```

> Note: If you added new columns like `documentPath`, make sure to synchronize or run migrations.

---

## API Testing (Postman Guide)

### Auth Routes

| Method | URL                  | Description            |
|--------|----------------------|------------------------|
| POST   | `/auth/register`     | Register (Admin/User)  |
| POST   | `/auth/login`        | Login to get JWT token |

> Use the JWT token in Postman headers:
```
Authorization: Bearer <token>
```

---

### User Endpoints

| Method | URL                  | Description             |
|--------|----------------------|-------------------------|
| GET    | `/user/me`           | Get logged-in user's profile |
| PATCH  | `/user/me`           | Update own profile (name, email, role) |
| POST   | `/user/upload`       | Upload document (PDF, DOCX, Image) |
| GET    | `/user/document`     | Download your uploaded document |
| PATCH  | `/user/document`     | Update uploaded document |
| DELETE | `/user/document`     | Delete uploaded document |

 **Upload Tips**:
- Method: `POST`
- URL: `http://localhost:3000/user/upload`
- Body → form-data:
  - Key: `file` (type: File)
  - Value: Choose a file (PDF/DOCX/PNG/JPEG)

---

### Admin Endpoints

| Method | URL                      | Description                |
|--------|--------------------------|----------------------------|
| GET    | `/admin/users`           | Get all users              |
| GET    | `/admin/users/:id`       | Get user by ID             |
| PATCH  | `/admin/users/:id/status`| Update user active status  |
| PATCH  | `/admin/users/:id`       | Update user info (Admin only) |

---

## Folder Structure

```
src/
├── auth/
├── admin/
├── user/
├── uploads/  // stored documents
```
## Contribution is appreciated

## Let's Connect

- 💼 [LinkedIn – Mahad](https://linkedin.com/in/mahad-dev)
- 📧 Feel free to raise issues or contribute!
