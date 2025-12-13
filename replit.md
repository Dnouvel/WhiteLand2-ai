# PlotVision - AI-Powered HBU Analysis Portal

## Overview

PlotVision is a geographical portal for city plots that provides AI-powered Highest and Best Use (HBU) analysis. The application features an interactive map interface where users can view city plots, examine property details, and request AI-generated real estate analysis studies. The core functionality centers around visualizing plot boundaries on a map, displaying property information, and generating comprehensive HBU reports using OpenAI's GPT-4o model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, local React state for UI
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **Map Integration**: Leaflet with react-leaflet for interactive map rendering

The frontend follows a map-first design philosophy where the interactive map occupies 60-70% of the viewport with a collapsible information panel on the right side.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Build System**: esbuild for production server bundling, Vite for client

Key API endpoints:
- `GET /api/plots` - Retrieve all plots
- `GET /api/plots/:id` - Get single plot details
- `GET /api/plots/:id/studies` - Get HBU studies for a plot
- `POST /api/hbu-studies` - Generate new AI-powered HBU study

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Current Storage**: In-memory storage implementation with sample NYC plot data (database-ready schema exists)

Database tables:
- `plots` - Property data including boundaries, zoning, market value
- `hbu_studies` - AI-generated analysis reports linked to plots
- `users` - User authentication (prepared for future implementation)

### AI Integration
- **Provider**: OpenAI GPT-4o model
- **Purpose**: Generates comprehensive HBU (Highest and Best Use) studies
- **Output Structure**: JSON with sections for executive summary, zoning analysis, market demand, financial feasibility, and development recommendations

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # UI components including shadcn/ui
│       ├── pages/        # Route page components
│       ├── hooks/        # Custom React hooks
│       └── lib/          # Utility functions and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── openai.ts     # AI integration
├── shared/           # Shared code between client and server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migrations (Drizzle Kit)
```

## External Dependencies

### Third-Party Services
- **OpenAI API**: GPT-4o model for generating HBU analysis reports (requires `OPENAI_API_KEY` environment variable)
- **Leaflet Tiles**: Map tile provider for interactive mapping

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migration and schema push tool (`npm run db:push`)

### Key Libraries
- **react-leaflet**: Interactive map component with polygon rendering for plot boundaries
- **jspdf**: Client-side PDF generation for exporting HBU reports
- **TanStack Query**: Data fetching, caching, and synchronization
- **Radix UI**: Accessible component primitives for shadcn/ui
- **Zod**: Runtime type validation for API requests

### Development Tools
- **Vite**: Development server with HMR and production builds
- **tsx**: TypeScript execution for server development
- **Replit plugins**: Dev banner and cartographer for Replit environment