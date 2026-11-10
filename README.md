# Application Overview

Nocturna is a web application designed for reading and publishing fanfiction and serialized literature. It combines advanced tagging systems and content metadata inspired by platforms like Archive of Our Own (AO3) and Wattpad with a modern, vertical-scroll reader interface based on the Webtoon aesthetic.

The application allows users to discover stories by fandom and genre, read text-based chapters, manage personal profiles, write and edit drafts, and publish original works or fanfiction.

## Architecture and Core Stack

The project is built as a single-page web application connected to a Cloud Backend-as-a-Service (BaaS).

- Frontend Framework: React with TypeScript and Vite
- Styling: Tailwind CSS with Shadcn UI components
- Backend & Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth (Email and Google OAuth 2.0)
- Database Management: Drizzle ORM and SQL migration scripts
- Testing Framework: Playwright

## System Features

### Reader Experience
- Minimalist light mode interface designed for long reading sessions.
- Interactive vertical chapter viewer with typography and background settings.
- Advanced filtering system supporting fandom categories, relationship tags, content warnings, and ratings.
- Chapter indexing, bookmarks, and user comments.

### Author Experience
- Dashboard for managing story metadata, covers, and content warnings.
- Chapter creation and editing interface with draft state saving.
- Publishing workflow for releasing chapters to the public directory.
- Support for multiple co-authors and external social links on story hubs.

### Security and Data Management
- Row Level Security (RLS) policies implemented on PostgreSQL tables to isolate drafts and restrict profile modification to account owners.
- Public read access rules for published stories and metadata.
- Storage bucket policies for user avatar and story cover uploads.

## Project Structure

```text
├── drizzle/
│   ├── migrations/         # Drizzle SQL migration files
│   └── schema.ts           # ORM schema definitions
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main route views
│   └── lib/                # Client initializations (Supabase)
├── supabase/
│   ├── functions/          # Serverless Edge Functions
│   └── migrations/         # Supabase SQL migration files
├── .env                    # Environment variables configuration (ignored by git)
├── .gitignore              # Git ignore patterns
└── playwright.config.ts    # E2E test suite configuration