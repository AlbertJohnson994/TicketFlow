# TicketFlow Backend 🎟️

Event Management and Ticket Sales API

## Features

- **Event Management**: CRUD operations for events with validation
- **Ticket Sales**: Complete sales processing with status tracking
- **Inventory Management**: Automatic ticket counting and availability
- **Revenue Analytics**: Real-time sales statistics and reporting
- **RESTful API**: Clean, consistent endpoints with proper error handling

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: SQLite
- **Validation**: Built-in model validation

## API Endpoints

### Events
- `GET /api/events` - List all events
- `GET /api/events/stats` - Get event statistics
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Sales
- `GET /api/sales` - List all sales
- `GET /api/sales/stats` - Get sales statistics
- `GET /api/sales/:id` - Get specific sale
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale

### System
- `GET /health` - Health check
- `POST /api/seed` - Seed database (development)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Seed database
npm run seed

# Reset database
npm run db:reset

Data Models
Event
id (UUID) - Primary key

description (String) - Event name/description

type (Integer) - Event category (1-6)

date (DateTime) - Event date

startSales (DateTime) - Sales start date

endSales (DateTime) - Sales end date

price (Float) - Ticket price

availableTickets (Integer) - Available tickets

soldTickets (Integer) - Sold tickets count

status (Enum) - Event status

Sale
id (UUID) - Primary key

user_id (UUID) - Customer identifier

event_id (UUID) - Event reference

saleDate (DateTime) - Sale timestamp

saleStatus (Enum) - Sale status

quantity (Integer) - Number of tickets

totalAmount (Float) - Calculated total

paymentMethod (Enum) - Payment type

### License


## 🎨 **Frontend Implementation**

### **Frontend/package.json**
```json
{
  "name": "ticketflow-frontend",
  "private": true,
  "type": "module",
  "version": "2.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```