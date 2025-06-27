# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `npm run dev` - Start development server on port 8080
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Testing
Add these scripts to package.json if needed:
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

### Supabase (requires proper credentials)
- `supabase start` - Start local Supabase
- `supabase functions deploy <function-name>` - Deploy edge function
- `supabase db push` - Push schema changes

## High-Level Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS
- **State**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Testing**: Vitest + React Testing Library

### Core Features
This is a **law enforcement data management system** with:

1. **Incident Report Management** - Multi-step forms for police reports
2. **Arrest Tag System** - Booking photos and mugshot generation 
3. **Fingerprint Integration** - Digital Persona scanner support
4. **AI-Powered Features** - Crime scene photo generation, text correction
5. **Data Analysis** - Pattern recognition, case similarity, timeline analysis
6. **Search System** - Unified search across vehicles, warrants, suspects

### Key Directories
- `/src/components/police-report/` - Report creation forms and sections
- `/src/components/fingerprint/` - Scanner integration and UI
- `/src/components/analysis/` - Data analysis and visualization tools
- `/src/pages/` - Route components (SearchPage, AITestingPage, etc.)
- `/src/hooks/` - Custom React hooks for data fetching
- `/src/services/` - Business logic and API integration
- `/supabase/functions/` - Serverless edge functions for AI features

### Database Integration
- Uses existing functions: `search_vehicles`, `search_warrants`, `search_missing_persons`
- Main tables: `incident_reports`, `arrest_tags`, `fingerprint_scans`, `ai_crime_scene_photos`
- Edge functions handle AI features (mugshot generation, crime scene photos, fingerprint analysis)

### Hardware Integration
**Fingerprint Scanner (Digital Persona U.are.U 4500)**:
- Real hardware detection with fallback to mock mode
- Error handling for driver/connection issues
- Quality validation and retry logic
- Setup documentation in `/docs/FINGERPRINT_SCANNER_SETUP.md`

**Mock Mode**: Use `localStorage.setItem('fingerprintMockMode', 'true')` for development without hardware.

### AI Integration
**OpenAI Edge Functions**:
- `generate-mugshot` - Creates booking photos from bio-markers
- `generate-crime-scene` - Generates crime scene images from incident data
- `correct-text` - Improves report text quality
- All functions include fallback handling and error recovery

**Recent Fixes**:
- Fixed biomarker passing to prevent non-human image generation
- Added specific prompts to ensure human faces in mugshots
- Enhanced error handling for OpenAI API issues

### Search System
**Unified Search** (`/search` route):
- Searches across vehicles, warrants, and suspects simultaneously
- Uses database functions and direct table queries
- Auto-categorizes results and provides quick navigation
- Accessible via Search button in main navigation

### Environment Setup
- Requires Supabase credentials in `.env`
- OpenAI API key needed for AI features
- Path alias: `@/` maps to `./src/`
- Development server runs on port 8080

### Testing Architecture
- Vitest with jsdom environment
- React Testing Library for component testing
- Global test utilities in `src/setupTests.ts`
- Coverage reporting with v8 provider

## Important Notes
- Always check hardware connection status before fingerprint operations
- AI features require valid OpenAI API keys and billing
- Use mock mode for development when hardware unavailable
- Database functions provide optimized search capabilities
- Error boundaries handle edge function failures gracefully

## Deployment Considerations
- Edge functions need to be deployed to Supabase separately
- Fingerprint drivers must be installed on client machines
- OpenAI API usage should be monitored for costs
- Consider rate limiting for AI features in production