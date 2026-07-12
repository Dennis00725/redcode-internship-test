# 📚 BookVault

> A full-stack book management web application built with Angular 20 and .NET 9 C#

![Angular](https://img.shields.io/badge/Angular-20-red?style=for-the-badge&logo=angular)
![.NET](https://img.shields.io/badge/.NET-9-purple?style=for-the-badge&logo=dotnet)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-blue?style=for-the-badge&logo=bootstrap)
![SQLite](https://img.shields.io/badge/SQLite-Database-green?style=for-the-badge&logo=sqlite)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=jsonwebtokens)

---

## 🌐 Live Demo

🔗 **[https://hogwards-vault.netlify.app](https://hogwards-vault.netlify.app)**

---

## ✨ Features

### 📖 Books Management

- Add, edit, delete books
- Real-time search and filter by title or author
- Filter by genre and reading status
- Sortable columns (title, author, date)
- Pagination (5 books per page)
- Star rating (1-5 stars)
- Reading status: 📋 Want to Read | 📖 Reading | ✅ Finished
- Export book list to PDF
- Color coded genre badges
- Confirm delete modal

### 💬 My Quotes

- Add, edit, delete favorite quotes
- Beautiful scroll/parchment themed background

### 🔐 Authentication

- JWT token based authentication
- User registration with password strength indicator
- Secure login with form validation
- Change password from profile page
- Username displayed in navbar

### 🎨 UI/UX

- Dark and light mode toggle
- Unique magical library backgrounds for each page
- Glassmorphism login card with animations
- Floating particles and candle flicker effects
- Toast notifications for all actions
- Loading spinners
- Fully responsive (mobile, tablet, desktop)
- Bootstrap 5 + Font Awesome icons

---

## 🛠️ Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | Angular 20, TypeScript               |
| Styling    | Bootstrap 5, Font Awesome, SCSS      |
| Backend    | .NET 9 C#, ASP.NET Core Web API      |
| Database   | SQLite via Entity Framework Core     |
| Auth       | JWT Bearer Tokens, BCrypt            |
| Deployment | Netlify (frontend), Render (backend) |

---

## 🚀 How to Run Locally

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Angular CLI 20](https://angular.io/cli)

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

Backend runs at `http://localhost:5187`
Swagger UI at `http://localhost:5187/swagger`

### Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend runs at `http://localhost:4200`

> **Note:** For local development, update the API URLs in the frontend from the Render URL to `http://localhost:5187`

---

## 📁 Project Structure

redconsulting-test/
├── backend/
│ ├── Controllers/
│ │ ├── AuthController.cs
│ │ ├── BooksController.cs
│ │ └── QuotesController.cs
│ ├── Models/
│ │ ├── User.cs
│ │ ├── Book.cs
│ │ └── Quote.cs
│ ├── Data/
│ │ └── AppDbContext.cs
│ ├── Services/
│ │ └── TokenService.cs
│ └── Program.cs
└── frontend/
└── src/app/
├── core/
│ ├── auth.service.ts
│ ├── auth.guard.ts
│ ├── auth.interceptor.ts
│ └── toast.service.ts
├── pages/
│ ├── login/
│ ├── register/
│ ├── books/
│ ├── quotes/
│ └── profile/
└── shared/
├── navbar/
└── toast.component.ts

---

## 📸 Screenshots

### 🌙 Dark Mode Login
![Dark Mode Login](screenshots/darkmode%20loginpage.png)

### ☀️ Light Mode Login
![Light Mode Login](screenshots/light%20mode%20loginpage.png)

### 📝 Register Page
![Register](screenshots/register.png)

### 📚 Books Page
![Books Page](screenshots/book%20page.png)

### ➕ Add New Book
![Add Book](screenshots/add%20book.png)

### 🔄 Sort Books
![Sort Books](screenshots/sort%20books.png)

### 📊 Sorted View
![Sort](screenshots/sort.png)

### 💬 Quotes Page
![Quotes Page](screenshots/quotes%20page.png)

### 🗑️ Delete Confirmation Modal
![Delete Confirmation](screenshots/delete%20confirmation.png)

### 📄 Export PDF
![Export PDF](screenshots/export%20pdf.png)

### 👤 Profile Page
![Profile](screenshots/profile.png)

### 📱 Mobile View
![Mobile View](screenshots/mobile%20view.png)




## 👨‍💻 Developer

**Dennis Daniel**

- 📧 dennisdanieldr2001@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/dennis-daniel-9443621b3)
- 🌍 Gothenburg, Sweden

---

## 📄 License

This project was built as an internship test for RR Consulting and Software AB.
