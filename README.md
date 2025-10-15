<div align="center">

# 🎟️ TicketFlow — Event Management & Ticket Sales System

![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-green)
![Node.js](https://img.shields.io/badge/Node.js-20+-yellow)
![Docker](https://img.shields.io/badge/Docker-Ready-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

Streamlining event management and ticket sales since 2024 🎭✨  
Making event organization effortless and ticket sales seamless.

</div>

---

## 🌟 Overview
**TicketFlow** is a professional full-stack web application designed for managing events, processing ticket sales, and providing real-time analytics.  
Built with modern technologies and a focus on user experience — perfect for **event organizers, venues, and ticket vendors**.

---

## ✨ Features

### 🎭 Event Management
- **Complete CRUD Operations** — Create, read, update, and delete events with validation  
- **Smart Categorization** — Concerts, Theater, Sports, Conferences, Workshops, Festivals  
- **Sales Period Control** — Define precise start and end dates for ticket sales  
- **Dynamic Pricing** — Real-time price updates  
- **Inventory Management** — Track available and sold tickets automatically  

### 💰 Sales Center
- **Multi-status Transactions** — Pending, paid, cancelled, refunded  
- **Customer Management** — UUID-based customer tracking  
- **Payment Integration** — Credit card, debit card, PIX, and cash  
- **Revenue Analytics** — Real-time revenue tracking  
- **Audit Trail** — Complete transaction history  

### 📊 Dashboard & Analytics
- **Live Statistics** — Real-time insights on events, sales, and revenue  
- **Interactive Charts** — Powered by Chart.js  
- **Performance Insights** — Data-driven KPIs  
- **Recent Activity** — See upcoming events and latest sales  

### 🛠️ Developer Experience
- **Database Seeder** — Generate professional sample data  
- **Docker Ready** — Simple containerized deployment  
- **API Health Monitoring** — `/health` endpoint for diagnostics  
- **RESTful API** — Clean and consistent design  

---

## 🏗️ Architecture

ticketflow/
├── 📁 backend/ # Node.js + Express API
│ ├── src/
│ │ ├── config/ # Database & environment configuration
│ │ ├── controllers/ # Business logic handlers
│ │ ├── models/ # Sequelize data models
│ │ ├── routes/ # API route definitions
│ │ ├── seeders/ # Database seeding scripts
│ │ └── app.js # Express server setup
│ └── package.json
│
└── 📁 frontend/ # React + Vite Dashboard
├── src/
│ ├── pages/ # Application pages
│ │ ├── DashboardPage.jsx
│ │ ├── EventsPage.jsx
│ │ ├── SalesPage.jsx
│ │ └── SeederPage.jsx
│ ├── services/ # API integration
│ └── App.jsx # Main component
└── package.json

yaml
Copy code

---

## 🚀 Quick Start

### 🧩 Prerequisites
- Node.js 20+
- npm or yarn
- Docker *(optional)*

---

### ⚙️ Installation

**Clone the repository:**
```bash
git clone https://github.com/AlbertJohnson994/TicketFlow.git
cd ticketflow
Backend Setup:

bash
Copy code
cd backend
npm install
Frontend Setup:

bash
Copy code
cd ../frontend
npm install
🔧 Environment Configuration
Backend (backend/.env):

env
Copy code
NODE_ENV=development
PORT=4000
DB_STORAGE=./database.sqlite
Frontend (frontend/.env):

env
Copy code
VITE_API_URL=http://localhost:4000
🏃‍♂️ Running the Application
Start Backend:

bash
Copy code
cd backend
npm run dev
Start Frontend (new terminal):

bash
Copy code
cd frontend
npm run dev
Access:

Frontend → http://localhost:3000

Backend → http://localhost:4000

🐳 Docker Deployment
Production:

bash
Copy code
docker-compose up -d
Development:

bash
Copy code
docker-compose -f docker-compose-dev.yml up -d
🌱 Database Seeding
Via API:

bash
Copy code
curl -X POST http://localhost:4000/api/seed
Via Frontend:
Go to http://localhost:3000/seeder and click "Seed Database"

📡 API Endpoints
🎫 Events Management
Method	Endpoint	Description
GET	/api/events	List all events
GET	/api/events/stats	Get event statistics
GET	/api/events/:id	Get specific event
POST	/api/events	Create a new event
PUT	/api/events/:id	Update an event
DELETE	/api/events/:id	Delete an event

💳 Sales Operations
Method	Endpoint	Description
GET	/api/sales	List all sales
GET	/api/sales/stats	Get sales statistics
GET	/api/sales/:id	Get sale details
POST	/api/sales	Create a sale
PUT	/api/sales/:id	Update sale
DELETE	/api/sales/:id	Delete sale

⚙️ System
Method	Endpoint	Description
GET	/health	Health check
POST	/api/seed	Seed database

🎯 Usage Guide
For Event Organizers
Create and manage events

Define pricing, periods, and availability

Monitor sales in real time

Analyze performance via dashboard

For Developers
RESTful API with consistent JSON

Built-in seeder and hot reload

Dockerized setup for easy dev

Modular and extensible architecture

🛠️ Technical Stack
Frontend
React 18 · Vite · Tailwind CSS · Chart.js · Axios · React Router DOM

Backend
Node.js · Express · SQLite · Sequelize · UUID · CORS

DevOps
Docker · Docker Compose · ESLint · PostCSS · Nginx

📊 Database Schema
Events Table
Field	Type	Description	Constraints
id	UUID	Primary key	Auto-generated
description	STRING	Event description	Required
type	INTEGER	Event category	Required
date	DATETIME	Event date/time	Required
startSales	DATETIME	Sales start	Required
endSales	DATETIME	Sales end	Required
price	FLOAT	Ticket price	≥ 0
availableTickets	INTEGER	Available tickets	Default: 100
soldTickets	INTEGER	Sold tickets	Default: 0
status	ENUM	Event status	Default: upcoming
createdAt	TIMESTAMP	Created	Auto-generated
updatedAt	TIMESTAMP	Updated	Auto-generated

Sales Table
Field	Type	Description	Constraints
id	UUID	Primary key	Auto-generated
user_id	UUID	Customer ID	Required
event_id	UUID	Event ID	FK
saleDate	DATETIME	Timestamp	Default: now
saleStatus	ENUM	Status	Default: pending
quantity	INTEGER	Ticket count	1–10
totalAmount	FLOAT	Total	Calculated
paymentMethod	ENUM	Payment type	Default: credit_card
transactionId	STRING	Reference	Optional
createdAt	TIMESTAMP	Created	Auto-generated
updatedAt	TIMESTAMP	Updated	Auto-generated

🚀 Deployment
Build Backend:

bash
Copy code
cd backend
npm run build
Build Frontend:

bash
Copy code
cd frontend
npm run build
Docker Production:

bash
Copy code
docker-compose up -d
docker-compose logs -f
docker-compose up -d --scale api=3
🤝 Contributing
We welcome contributions!

Fork the repo

Create your feature branch

bash
Copy code
git checkout -b feature/amazing-feature
Commit your changes

bash
Copy code
git commit -m "Add amazing feature"
Push to branch

bash
Copy code
git push origin feature/amazing-feature
Open a Pull Request

📝 License
This project is licensed under the MIT License — see LICENSE for details.

✅ Free for personal and commercial use
✅ Modify and distribute freely
✅ Must include original license

🆘 Support
Documentation

Backend → backend/README.md

Frontend → frontend/README.md

API Reference → Built-in docs

Report Issues

Describe problem, reproduction steps, and environment details

Community

GitHub Discussions & Issue Tracker

Email → albert.johnson994@gmail.com

🎉 Acknowledgments
Icons & Emojis — Twemoji

UI Inspiration — Modern dashboard best practices

Contributors — Thanks to everyone who submitted issues and PRs

Open Source Libraries — Backbone of TicketFlow

📞 Contact
Project Maintainer: Albert Johnson
📧 albert.johnson994@gmail.com
🐙 GitHub: @AlbertJohnson994

yaml
Copy code

---

### ✅ How to use:
1. Open VS Code.  
2. In your project root → Create or open `README.md`.  
3. Paste all content above.  
4. Save.  
5. Commit and push to GitHub:
   ```bash
   git add README.md
   git commit -m "Add formatted README.md"
   git push