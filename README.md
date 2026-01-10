# Payment Gateway Directory - Backend

High-performance NestJS backend for the global payment gateway directory system.

## Features

- **RESTful API** with validation and error handling
- **MySQL Database** with TypeORM for data persistence
- **In-memory caching** for high-traffic endpoints
- **Rate limiting** to prevent abuse
- **Fit score algorithm** for intelligent gateway ranking
- **Pagination and sorting** on all list endpoints
- **CORS enabled** for frontend integration

## Prerequisites

- Node.js 18+ and npm
- MySQL 8+ database

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your .env file with database credentials
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=payment_gateway_db

PORT=3000
FRONTEND_URL=http://localhost:3001
```

## Database Setup

The application uses TypeORM with automatic synchronization in development mode.

```bash
# The database will be created automatically when you start the server
# To seed the database with sample data:
npm run seed
```

## Running the Application

```bash
# Development mode (with hot-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Server runs on `http://localhost:3000/api`

## API Endpoints

### Gateways
- `GET /api/gateways` - List all gateways (with filtering, pagination, sorting)
  - Query params: `page`, `limit`, `country`, `currency`, `crypto`, `integration_type`, `search`, `sortBy`, `sortOrder`
- `GET /api/gateways/:slug` - Get gateway by slug
- `POST /api/gateways` - Create new gateway (admin)
- `PATCH /api/gateways/:id` - Update gateway (admin)
- `DELETE /api/gateways/:id` - Delete gateway (admin)

### Sponsors
- `GET /api/sponsors/featured` - Get featured sponsors (max 20, for carousel)
- `POST /api/sponsors` - Create sponsor (admin)
- `PATCH /api/sponsors/:id` - Update sponsor (admin)
- `DELETE /api/sponsors/:id` - Delete sponsor (admin)

### Offers
- `GET /api/offers` - List founder offers (with country/currency/crypto filtering)
- `POST /api/offers` - Create offer (admin)
- `PATCH /api/offers/:id` - Update offer (admin)
- `DELETE /api/offers/:id` - Delete offer (admin)

### Countries
- `GET /api/countries` - List all countries
- `GET /api/countries/:slug` - Get country by slug

## Performance Optimizations

- **Caching**: High-traffic endpoints use in-memory caching (5-10 minutes TTL)
- **Database indexing**: Optimized queries on slug, country codes, status
- **Rate limiting**: 100 requests per minute per IP
- **Pagination**: Default limit of 20 items per page

## Fit Score Algorithm

The fit score ranks gateways based on relevance:
- +30 points: Country match
- +25 points: Currency match
- +20 points: Crypto supported
- +15 points: Integration type match
- +10 points: Featured status

## Project Structure

```
src/
├── config/           # Configuration module
├── database/         # Database entities and migrations
│   ├── entities/     # TypeORM entities
│   └── seeds/        # Database seed scripts
├── gateways/         # Gateways module
├── sponsors/         # Sponsors module
├── offers/           # Founder offers module
├── countries/        # Countries module
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

## Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

1. Set `NODE_ENV=production` in environment
2. Configure production database connection
3. Build the application: `npm run build`
4. Start with: `npm run start:prod`

For production, consider:
- Using a managed MySQL database (AWS RDS, DigitalOcean, etc.)
- Adding Redis for distributed caching
- Implementing JWT authentication for admin routes
- Setting up proper logging and monitoring

## License

Unlicensed - private project
