# 🎟️ TicketFlow — Event Management & Ticket Sales System

![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-green)
![Node.js](https://img.shields.io/badge/Node.js-20+-yellow)
![Docker](https://img.shields.io/badge/Docker-Ready-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 🌟 Overview
**TicketFlow** is a professional full-stack web application designed for managing events, processing ticket sales, and providing real-time analytics.  
Built with modern technologies and a focus on user experience — perfect for event organizers, venues, and ticket vendors.

---

## ✨ Features

### 🎭 Event Management
- **Complete CRUD Operations** — Create, read, update, and delete events with validation  
- **Smart Categorization** — Concerts, Theater, Sports, Conferences, Workshops, Festivals  
- **Sales Period Control** — Start and end dates for ticket sales  
- **Dynamic Pricing** — Real-time price updates  
- **Inventory Management** — Automatic tracking of available and sold tickets  

### 💰 Sales Center
- **Multi-status Transactions** — Pending, paid, cancelled, refunded  
- **Customer Management** — UUID-based customer tracking  
- **Payment Integration** — Credit card, debit card, PIX, and cash  
- **Revenue Analytics** — Real-time revenue tracking  
- **Audit Trail** — Complete transaction history  

### 📊 Dashboard & Analytics
- **Live Statistics** — Events, sales, and revenue in real-time  
- **Interactive Charts** — Beautiful visualizations with Chart.js  
- **Performance Insights** — Key indicators for better decisions  
- **Recent Activity** — Quick view of latest sales and upcoming events  

### 🛠️ Developer Experience
- **Database Seeder** — Professional sample data generation  
- **Docker Ready** — Easy containerized deployment  
- **API Health Monitoring** — System diagnostics endpoint  
- **RESTful API** — Clean and consistent design  

---

## 🏗️ Architecture


ticketflow/
├── 📁 backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database & environment configuration
│   │   ├── controllers/       # Business logic handlers
│   │   ├── models/           # Sequelize data models
│   │   ├── routes/           # API route definitions
│   │   ├── seeders/          # Database seeding scripts
│   │   └── app.js            # Express server setup
│   └── package.json
│
└── 📁 frontend/               # React + Vite Dashboard
    ├── src/
    │   ├── pages/            # Application pages
    │   │   ├── DashboardPage.jsx
    │   │   ├── EventsPage.jsx
    │   │   ├── SalesPage.jsx
    │   │   └── SeederPage.jsx
    │   ├── services/         # API integration
    │   └── App.jsx          # Main application component
    └── package.json

---

## 🚀 Quick Start

### 🧩 Prerequisites
- Node.js **20+**
- npm or yarn
- Docker (optional)

### ⚙️ Installation

**Clone the repository:**
```bash
git clone https://github.com/your-username/ticketflow.git
cd ticketflow

```bash
git clone https://github.com/AlbertJohnson994/TicketFlow
cd ticketflow
Backend Setup

```bash
cd backend
npm install
Frontend Setup

```bash
cd ../frontend
npm install
Environment Configuration
Backend (backend/.env):

env
NODE_ENV=development
PORT=4000
DB_STORAGE=./database.sqlite
Frontend (frontend/.env):

env
VITE_API_URL=http://localhost:4000
🏃‍♂️ Running the Application
Development Mode
Start the Backend

```bash
cd backend
npm run dev
Start the Frontend (in a new terminal)

```bash
cd frontend
npm run dev
Access the Application

Frontend Dashboard: http://localhost:3000

Backend API: http://localhost:4000

Docker Deployment
Production Environment:

bash
docker-compose up -d
Development Environment:

bash
docker-compose -f docker-compose-dev.yml up -d
Database Seeding
Via API:

bash
curl -X POST http://localhost:4000/api/seed
Via Frontend:
Navigate to http://localhost:3000/seeder and click "Seed Database"

📡 API Endpoints
🎫 Events Management
Method	Endpoint	Description
GET	/api/events	List all events
GET	/api/events/stats	Get event statistics
GET	/api/events/:id	Get specific event details
POST	/api/events	Create a new event
PUT	/api/events/:id	Update an existing event
DELETE	/api/events/:id	Delete an event

💳 Sales Operations
Method	Endpoint	Description
GET	/api/sales	List all sales
GET	/api/sales/stats	Get sales statistics
GET	/api/sales/:id	Get specific sale details
POST	/api/sales	Create a new sale
PUT	/api/sales/:id	Update sale status
DELETE	/api/sales/:id	Delete a sale

⚙️ System Operations
Method	Endpoint	Description
GET	/health	System health check
POST	/api/seed	Seed database with sample data

🎯 Usage Guide
For Event Organizers
Create Events

Use the Events Manager to set up new events

Define pricing, sales periods, and ticket availability

Categorize events for better organization

Monitor Sales

Track ticket sales in real-time through the Sales Center

View revenue metrics and performance indicators

Manage customer transactions and refunds

Analyze Performance

Use the Dashboard for comprehensive insights

Monitor attendance and revenue trends

Make data-driven decisions for future events

For Developers
API Integration

All endpoints follow RESTful conventions

Consistent JSON request/response formats

Comprehensive error handling and status codes

Development Workflow

Use the database seeder for realistic test data

Docker support for consistent development environments

Hot-reload enabled for efficient development

Customization

Modular architecture for easy feature additions

Well-documented codebase with clear separation of concerns

Extensible design patterns for scalability

🛠️ Technical Stack
Frontend
React 18 - Modern UI framework with hooks

Vite - Fast build tool and development server

Tailwind CSS - Utility-first CSS framework

Chart.js - Interactive data visualization

Axios - Promise-based HTTP client

React Router DOM - Client-side routing

Backend
Node.js - JavaScript runtime environment

Express.js - Minimalist web application framework

SQLite - Lightweight, file-based database

Sequelize - Promise-based Node.js ORM

CORS - Cross-origin resource sharing

UUID - Unique identifier generation

Development & Deployment
Docker - Containerization platform

Docker Compose - Multi-container application management

ESLint - Code linting and quality assurance

PostCSS - CSS processing and transformation

Nginx - Web server and reverse proxy

📊 Database Schema
Events Table
Field	Type	Description	Constraints
id	UUID	Primary key	Primary Key, Auto-generated
description	STRING	Event name/description	Not Null, Length: 3-255
type	INTEGER	Event category	Not Null, Min: 1
date	DATETIME	Event date and time	Not Null
startSales	DATETIME	Sales start date	Not Null
endSales	DATETIME	Sales end date	Not Null
price	FLOAT	Ticket price	Not Null, Min: 0
availableTickets	INTEGER	Available tickets	Default: 100, Min: 0
soldTickets	INTEGER	Sold tickets count	Default: 0, Min: 0
status	ENUM	Event status	Default: 'upcoming'
createdAt	TIMESTAMP	Creation timestamp	Auto-generated
updatedAt	TIMESTAMP	Update timestamp	Auto-generated
Sales Table
Field	Type	Description	Constraints
id	UUID	Primary key	Primary Key, Auto-generated
user_id	UUID	Customer identifier	Not Null
event_id	UUID	Event reference	Not Null, Foreign Key
saleDate	DATETIME	Sale timestamp	Default: Current Time
saleStatus	ENUM	Sale status	Default: 'pending'
quantity	INTEGER	Number of tickets	Default: 1, Min: 1, Max: 10
totalAmount	FLOAT	Calculated total	Computed Field
paymentMethod	ENUM	Payment type	Default: 'credit_card'
transactionId	STRING	Transaction reference	Optional
createdAt	TIMESTAMP	Creation timestamp	Auto-generated
updatedAt	TIMESTAMP	Update timestamp	Auto-generated

🚀 Deployment
Production Build
Backend:

```bash
cd backend
npm run build
Frontend:

```bash
cd frontend
npm run build
Docker Production Deployment
Update environment variables for production

Configure reverse proxy (Nginx recommended)

Set up SSL certificates for HTTPS

Configure database backups

bash
# Start production stack
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale api=3
Environment-Specific Configuration
Development:

Hot-reload enabled

Detailed error messages

SQLite file-based database

Production:

Optimized builds

Minimal logging

Containerized database

Environment variables for secrets

🤝 Contributing
We welcome contributions from the community! Here's how you can help:

Fork the repository

Create a feature branch

```bash
git checkout -b feature/amazing-feature
Commit your changes

```bash
git commit -m 'Add amazing feature'
Push to the branch

```bash
git push origin feature/amazing-feature
Open a Pull Request

Development Guidelines
Follow existing code style and patterns

Write meaningful commit messages

Add tests for new functionality

Update documentation as needed

Ensure all tests pass before submitting

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

MIT License Features:

✅ Free to use for personal and commercial projects

✅ Permission to modify and distribute

✅ No warranty or liability

✅ Must include original license and copyright

🆘 Support
Documentation
Backend Documentation: See backend/README.md

Frontend Documentation: See frontend/README.md

API Reference: Comprehensive endpoint documentation

Issue Reporting
Found a bug or have a feature request? Please create an issue with:

Detailed description of the problem

Steps to reproduce

Expected vs actual behavior

Environment details

Community & Questions
GitHub Discussions: For questions and community support

Issue Tracker: For bug reports and feature requests

Email Support: Contact the development team directly

🎉 Acknowledgments
Icons & Emojis: Twemoji for consistent iconography

UI Inspiration: Modern dashboard designs and best practices

Community Contributors: Thanks to all who have submitted issues and pull requests

Open Source Libraries: This project stands on the shoulders of many amazing open source projects

📞 Contact
Project Maintainer: Albert Johnson
Email: albert.johnson994@gmail.com
GitHub: https://github.com/albertjohnson994

<div align="center">
TicketFlow - Streamlining event management and ticket sales since 2024 🎭✨

Making event organization effortless and ticket sales seamless

</div>