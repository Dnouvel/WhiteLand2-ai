# PlotVision - AI-Powered HBU Analysis Platform

## Overview

PlotVision is a geographical portal for city plot analysis, specifically designed for Highest and Best Use (HBU) studies. The application provides an interactive map-first interface for viewing city plots in Riyadh, Saudi Arabia, with AI-powered analysis capabilities for real estate development decisions.

The platform displays property boundaries on an interactive map, allows users to select plots and view detailed information, and generates comprehensive HBU reports including development scenarios, zoning analysis, market data, and financial projections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Map Integration**: Leaflet with react-leaflet for interactive mapping

The frontend follows a map-first design pattern where the interactive map occupies 60-70% of the viewport with a collapsible information panel for plot details and HBU reports.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api/` prefix
- **Build Process**: Vite for frontend, esbuild for server bundling

The server implements a simple storage interface pattern that currently uses in-memory data with sample plots for Riyadh. This abstraction allows for easy migration to PostgreSQL when needed.

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Validation**: Zod schemas generated from Drizzle for type-safe API operations

Key entities:
- Plots: Property parcels with coordinates, boundaries, zoning, and market values
- HBU Studies: Analysis reports with development scenarios, zoning details, market data, and financial projections
- Users: Basic user accounts for future authentication

### AI Integration
- **Provider**: OpenAI API configured in `server/openai.ts`
- **Purpose**: Generating HBU analysis reports with development scenarios, risk assessments, and financial projections
- **Current State**: OpenAI integration exists but pre-stored data is used for demonstrations

### Design System
- Professional dashboard aesthetic inspired by Google Maps and Zillow
- Inter font for UI, JetBrains Mono for data/coordinates
- Light/dark theme support via CSS variables
- Consistent spacing using Tailwind units (2, 4, 6, 8)

## External Dependencies

### Third-Party Services
- **OpenAI API**: For generating AI-powered HBU analysis (requires `OPENAI_API_KEY` environment variable)
- **PostgreSQL**: Database backend (requires `DATABASE_URL` environment variable)
- **Leaflet Tiles**: OpenStreetMap tiles for map rendering

### Key Libraries
- **react-leaflet**: Interactive map components
- **jsPDF**: PDF generation for HBU report exports
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives
- **zod**: Runtime validation

### Development Tools
- **Vite**: Frontend development server with HMR
- **drizzle-kit**: Database migration tooling
- **tsx**: TypeScript execution for development