Da. Najčistije: napraviš dva odvojena projekta/repozitorija:

cms-frontend — javni/admin frontend, npr. React/Vite/Astro/Next, deploy na Vercel
cms-backend — API + CMS logika, npr. FastAPI, deploy na Render, baza PostgreSQL/Neon
Codex treba imati poseban AGENTS.md u svakom repo-u, jer OpenAI Codex čita AGENTS.md prije rada i koristi ga kao projektne instrukcije. Možeš imati i globalni AGENTS.md, ali repo-level fajl je bitan za konkretna pravila projekta.

1. Root AGENTS.md za CMS frontend
Napravi fajl:

New-Item AGENTS.md -ItemType File
U cms-frontend/AGENTS.md stavi ovo:

# AGENTS.md — CMS Frontend

## Project Purpose

This repository is the CMS frontend.

It must provide:
- a public website frontend
- CMS/admin interface pages if needed
- API integration with the separate CMS backend
- clean content rendering from backend-provided data

The frontend must not contain backend business logic, database access, secrets, authentication secrets, or direct PostgreSQL/Neon calls.

## Architecture

Frontend is separate from backend.

Expected deployment:
- Frontend: Vercel
- Backend/API: Render
- Database: PostgreSQL on Neon, accessed only by the backend

Frontend communicates with backend through HTTP API routes using environment variables.

Use:

```env
VITE_API_BASE_URL=
or the equivalent framework-specific public API variable.

Never hardcode production backend URLs directly in components.

Main Rules
Do not add database logic to this repository.
Do not store API secrets in frontend code.
Do not expose private backend tokens, admin tokens, CMS secrets, or database URLs.
All backend communication must go through a typed API client.
Prefer small reusable components over large page files.
Keep public website pages separate from admin/CMS pages.
Do not rewrite the whole project unless explicitly asked.
Make minimal, targeted changes.
Preserve existing design decisions unless the user asks for redesign.
Do not delete existing files unless clearly obsolete and confirmed by the task.
Suggested Folder Structure
Use this structure unless the existing project already has a better one:

src/
  app/ or pages/
  components/
    common/
    layout/
    cms/
    public/
  lib/
    api/
    config/
    utils/
  types/
  styles/
For React/Vite, prefer:

src/
  components/
  pages/
  lib/
  types/
  styles/
For Astro, prefer:

src/
  components/
  layouts/
  pages/
  lib/
  types/
API Client Rules
Create one central API client, for example:

src/lib/api/client.ts
The frontend must call backend through functions such as:

getPages()
getPageBySlug(slug)
getPosts()
getPostBySlug(slug)
getServices()
submitContactForm(payload)
Do not scatter fetch() calls randomly across components.

Every API function must:

use the configured API base URL
handle HTTP errors
return typed data
avoid leaking implementation details to UI components
Content Model Assumptions
The backend may provide content such as:

pages
sections
services
blog/news posts
testimonials
FAQs
contact form submissions
media/image references
SEO metadata
Frontend should render content dynamically where possible.

Do not hardcode CMS-managed text unless it is temporary placeholder content.

SEO Requirements
For every public page, support:

title
meta description
canonical URL if available
Open Graph title
Open Graph description
Open Graph image if available
clean slug-based routing
For CMS-driven pages, metadata should come from backend content.

Admin/CMS UI Rules
If building an admin interface in this frontend:

keep admin routes under /admin
protect admin routes using backend authentication
never trust frontend-only protection
use forms with validation
show loading, error, empty, and success states
avoid destructive actions without confirmation
create reusable form components where useful
Admin pages may include:

/admin/login
/admin/dashboard
/admin/pages
/admin/pages/new
/admin/pages/:id/edit
/admin/posts
/admin/posts/new
/admin/posts/:id/edit
/admin/media
/admin/settings
Styling Rules
Use the styling approach already present in the project.

If no styling system exists, use simple CSS modules or Tailwind only if the user requested it.

Do not introduce a large UI framework unless requested.

The design should be:

clean
fast
responsive
accessible
easy for non-technical users to understand
Accessibility
Use semantic HTML.

Forms must have:

labels
clear errors
keyboard accessibility
readable focus states
Images must have alt text when meaningful.

Testing / Validation
Before completing a task, run the available checks:

npm install
npm run lint
npm run build
If tests exist:

npm test
If commands fail because the project is incomplete, report the exact reason and suggest the smallest fix.

Git Rules
This is a Git repository.

Before making changes:

inspect the current branch
avoid working directly on main unless explicitly instructed
create a focused branch for the task
Suggested branch naming:

feature/cms-frontend-setup
fix/api-client-errors
feature/admin-pages
After changes:

summarize modified files
explain what was changed
mention commands run
mention anything not completed
What Not To Do
Do not:

add backend routes
add database clients
add secrets
bypass backend authentication
hardcode production API URLs
replace the app architecture without need
create fake CMS behavior that cannot connect to real backend later

---

## 2. Root `AGENTS.md` za CMS backend

U `cms-backend/AGENTS.md` stavi ovo:

```md
# AGENTS.md — CMS Backend

## Project Purpose

This repository is the CMS backend.

It provides:
- REST API for the frontend
- CMS content management
- authentication and authorization
- PostgreSQL database access through Neon
- validation and business logic
- contact form handling
- optional media metadata handling

The backend is separate from the frontend.

Expected deployment:
- Backend/API: Render
- Database: PostgreSQL on Neon
- Frontend: Vercel

The frontend must never access the database directly.

## Architecture

Use FastAPI unless the existing project uses another backend framework.

Recommended architecture:

```txt
app/
  main.py
  core/
    config.py
    security.py
    database.py
  api/
    routes/
      auth.py
      pages.py
      posts.py
      services.py
      faqs.py
      contact.py
      media.py
  models/
  schemas/
  services/
  repositories/
  migrations/
tests/
Use separation of concerns:

routes: HTTP layer only
schemas: request/response validation
services: business logic
repositories: database queries
models: ORM models
core: config, security, database connection
Do not put all logic inside route files.

Database
Use PostgreSQL on Neon.

Database URL must come from environment variables only:

DATABASE_URL=
Never hardcode database credentials.

Use migrations.

Preferred tools:

SQLAlchemy
Alembic
Pydantic
asyncpg or psycopg depending on the project style
If the project already uses a different stack, preserve it.

Environment Variables
Expected variables may include:

DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=
ADMIN_EMAIL=
ADMIN_PASSWORD=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
CONTACT_TO_EMAIL=
Do not commit .env.

Maintain .env.example with safe placeholder values.

Do not delete .env.example.

API Responsibilities
The backend should support CMS resources such as:

pages
page sections
posts/news
services
testimonials
FAQs
media metadata
contact form submissions
site settings
SEO metadata
Recommended public endpoints:

GET /api/health
GET /api/pages
GET /api/pages/{slug}
GET /api/posts
GET /api/posts/{slug}
GET /api/services
GET /api/faqs
POST /api/contact
Recommended admin endpoints:

POST /api/auth/login
GET /api/admin/me

GET /api/admin/pages
POST /api/admin/pages
GET /api/admin/pages/{id}
PATCH /api/admin/pages/{id}
DELETE /api/admin/pages/{id}

GET /api/admin/posts
POST /api/admin/posts
GET /api/admin/posts/{id}
PATCH /api/admin/posts/{id}
DELETE /api/admin/posts/{id}

GET /api/admin/contact-submissions
Admin endpoints must require authentication.

Public read endpoints must return only published content unless the user explicitly requests preview functionality.

Authentication Rules
Implement backend authentication properly.

Do not rely on frontend-only route protection.

Use JWT or session-based auth.

For a simple CMS, JWT access token is acceptable.

Passwords must be hashed.

Never store plain-text passwords.

Use role-based authorization if multiple users are planned:

admin
editor
viewer
If only one admin is needed, keep the implementation simple.

CORS
Allow frontend origins through environment variable:

CORS_ORIGINS=https://example.com,http://localhost:5173
Do not use wildcard * for authenticated admin APIs in production.

Validation
Use Pydantic schemas for all inputs and outputs.

Validate:

required fields
slugs
publication status
email format
SEO field length where useful
contact form payloads
Return clear error messages.

Content Publishing Rules
Content should support:

draft
published
archived
Public endpoints should only return published items.

Admin endpoints can return all statuses.

Recommended fields:

id
title
slug
content
excerpt
status
seo_title
seo_description
featured_image_url
created_at
updated_at
published_at
Contact Form Rules
Contact form endpoint should:

validate name, email, message
store submission in database
optionally send email notification
protect against spam with basic rate limiting or honeypot field if requested
never expose SMTP credentials
Error Handling
Use consistent API error responses.

Do not leak internal exceptions, stack traces, SQL errors, or secrets to clients.

Log useful errors server-side.

Testing / Validation
Before completing a task, run:

python -m pip install -r requirements.txt
python -m pytest
If no tests exist, at minimum run:

python -m compileall app
If using FastAPI, confirm the app starts locally:

uvicorn app.main:app --reload
If commands fail, report the exact failure and smallest proposed fix.

Render Deployment
Backend must be deployable to Render.

Expected Render start command:

uvicorn app.main:app --host 0.0.0.0 --port $PORT
If using Gunicorn:

gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
Ensure dependencies are listed in:

requirements.txt
or, if using Poetry:

pyproject.toml
Git Rules
This is a Git repository.

Before changes:

inspect current branch
avoid direct commits to main
create a focused branch
Suggested branches:

feature/cms-backend-setup
feature/cms-auth
feature/cms-pages-api
feature/contact-form
fix/cors-config
After changes:

summarize modified files
explain architecture decisions
list commands run
mention incomplete items honestly
What Not To Do
Do not:

add frontend code here
expose database credentials
store plain-text passwords
make admin routes public
use wildcard CORS in production for authenticated APIs
skip validation
hardcode Render, Neon, or Vercel secrets
delete .env.example
create fake endpoints that cannot be connected to the real frontend

---

## 3. Koraci koje daješ Codex-u — prvo backend

Otvori `cms-backend` repo u VS Code/Codex i daj mu ovaj prompt:

```md
Set up the CMS backend as a FastAPI project following AGENTS.md.

Requirements:

1. Create a clean FastAPI structure:
   - app/main.py
   - app/core/config.py
   - app/core/database.py
   - app/core/security.py
   - app/api/routes/
   - app/models/
   - app/schemas/
   - app/services/
   - app/repositories/
   - tests/

2. Add PostgreSQL support for Neon using DATABASE_URL from environment variables.

3. Add SQLAlchemy models and Pydantic schemas for:
   - pages
   - posts
   - services
   - FAQs
   - contact submissions

4. Add public endpoints:
   - GET /api/health
   - GET /api/pages
   - GET /api/pages/{slug}
   - GET /api/posts
   - GET /api/posts/{slug}
   - GET /api/services
   - GET /api/faqs
   - POST /api/contact

5. Add admin endpoints protected by authentication:
   - POST /api/auth/login
   - GET /api/admin/me
   - CRUD for pages
   - CRUD for posts
   - CRUD for services
   - CRUD for FAQs
   - GET /api/admin/contact-submissions

6. Add password hashing and JWT authentication.

7. Add CORS configuration using CORS_ORIGINS from .env.

8. Add .env.example with safe placeholder values.

9. Add requirements.txt.

10. Add README.md with local setup, Render deployment instructions, and Neon environment variable setup.

11. Run compile/test commands and fix errors.

Do not add frontend code. Do not hardcode secrets. Do not delete .env.example.
Ovo je bolji redoslijed nego prvo frontend, jer frontend zavisi od API oblika. Ako prvo napraviš frontend, Codex će izmišljati endpoint-e. To poslije pravi nered.

4. Koraci koje daješ Codex-u — zatim frontend
Kad backend ima osnovne endpoint-e, otvori cms-frontend repo i daj Codex-u:

Set up the CMS frontend following AGENTS.md.

The frontend must consume the separate CMS backend API.

Requirements:

1. Create a clean frontend structure:
   - src/components/
   - src/pages/ or framework equivalent
   - src/lib/api/
   - src/types/
   - src/styles/

2. Create a central API client:
   - src/lib/api/client.ts

3. Use an environment variable for backend URL:
   - VITE_API_BASE_URL for Vite
   - or the correct framework-specific public env variable

4. Add typed API functions for:
   - getPages()
   - getPageBySlug(slug)
   - getPosts()
   - getPostBySlug(slug)
   - getServices()
   - getFaqs()
   - submitContactForm(payload)
   - adminLogin(payload)
   - admin CRUD calls for pages/posts/services/faqs

5. Create public pages:
   - Home
   - Services
   - Blog/News
   - Dynamic page by slug
   - FAQ
   - Contact

6. Create admin pages under /admin:
   - login
   - dashboard
   - pages list
   - page create/edit
   - posts list
   - post create/edit
   - services list
   - FAQ list
   - contact submissions

7. Add loading, error, empty, and success states.

8. Add SEO metadata support for public CMS pages.

9. Add basic responsive styling.

10. Add README.md with local setup and Vercel deployment instructions.

11. Run lint/build and fix errors.

Do not add database logic. Do not hardcode backend URLs. Do not store secrets in frontend code.
5. Minimalni redoslijed rada
Radi ovako:

1. Napravi cms-backend repo.
2. Dodaj backend AGENTS.md.
3. Codex: scaffold FastAPI backend.
4. Poveži Neon DATABASE_URL.
5. Testiraj /api/health lokalno.
6. Deploy backend na Render.
7. Zapiši Render backend URL.

8. Napravi cms-frontend repo.
9. Dodaj frontend AGENTS.md.
10. Codex: scaffold frontend.
11. Dodaj VITE_API_BASE_URL = Render backend URL.
12. Testiraj lokalno.
13. Deploy frontend na Vercel.
14. U backend CORS dodaj Vercel domen.
6. Komande za backend repo
mkdir cms-backend
cd cms-backend
git init
New-Item AGENTS.md -ItemType File
New-Item README.md -ItemType File
Kad Codex napravi projekat:

python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
Git:

git checkout -b feature/cms-backend-setup
git add .
git commit -m "Set up CMS backend"
git remote add origin YOUR_BACKEND_REPO_URL
git push -u origin feature/cms-backend-setup
7. Komande za frontend repo
mkdir cms-frontend
cd cms-frontend
git init
New-Item AGENTS.md -ItemType File
New-Item README.md -ItemType File
Ako koristiš Vite React:

npm create vite@latest . -- --template react-ts
npm install
npm run dev
Git:

git checkout -b feature/cms-frontend-setup
git add .
git commit -m "Set up CMS frontend"
git remote add origin YOUR_FRONTEND_REPO_URL
git push -u origin feature/cms-frontend-setup
8. Moj iskren savjet
Nemoj praviti “CMS frontend” kao nešto previše ambiciozno odmah. Prva verzija treba imati samo:

Pages
Services
FAQ
Contact submissions
Basic admin login

---

## CMS Work Log - 2026-05-09

Status: paused at roughly 30% as requested.

Implemented in this backend repository:
- Kept the existing Express/Sequelize/MySQL stack instead of switching to FastAPI, because this project already has a working backend architecture.
- Added CMS content models: `CmsPage`, `CmsPost`, `CmsService`, `CmsFaq`, and `ContactSubmission`.
- Added CMS validation schemas with Zod for content, services, FAQs, and contact submissions.
- Added CMS controller support for public published content, admin CRUD, and contact submissions.
- Added public CMS routes under `/api/cms`.
- Added admin CMS routes under `/api/admin/cms`, protected by existing admin auth middleware.
- Updated `seed.js` to create CMS tables and demo CMS content.
- Fixed MySQL `TEXT/LONGTEXT` default-value issue by keeping defaults in payload/controller logic instead of table definitions.
- Fixed Express 5 route pattern issue by avoiding inline regex route params.

Validation performed:
- `npm run build` passed.
- `npm run seed` passed.
- Smoke tested public CMS endpoints, admin CMS list/create, and contact submission successfully.

Next backend steps:
- Add dedicated admin CMS frontend pages to consume these endpoints.
- Add contact submission status update/archive endpoint.
- Add optional media picker integration for CMS featured images.
- Add pagination/search for admin CMS lists.

---

## CMS Work Log - 2026-05-09 Continued

Status: CMS work advanced to roughly 80%; about 20% remains.

Additional backend validation completed:
- Rebuilt backend with `npm run build`.
- Re-ran `npm run seed` after frontend CMS integration work.
- Smoke tested public CMS collections and admin FAQ collection:
  - `GET /api/cms/pages`
  - `GET /api/cms/posts`
  - `GET /api/cms/services`
  - `GET /api/cms/faqs`
  - `GET /api/admin/cms/faqs`

No new backend feature files were added in this continuation beyond the CMS backend foundation from the previous step. Backend is ready for the current frontend CMS UI to consume.

Remaining backend work for final 20%:
- Add admin endpoint to update/archive contact submissions.
- Add pagination/search/query filters for admin CMS resources.
- Add richer media metadata or media picker support for CMS featured images.
- Add tests around CMS validation and admin auth protection.

---

## CMS Work Log - 2026-05-09 Final Pass

Status: CMS implementation completed for the planned scope.

Completed in this backend repository:
- Added admin contact submission status update endpoint:
  - `PATCH /api/admin/cms/contact-submissions/:id`
- Endpoint supports `new`, `read`, and `archived` statuses.
- Rebuilt backend successfully with `npm run build`.
- Re-ran `npm run seed` successfully.
- Smoke tested:
  - contact submission creation
  - admin contact submission listing
  - contact submission status update
  - public CMS pages
  - admin CMS pages
- Re-ran seed after smoke test to leave local database clean.

Remaining optional backend polish:
- Add pagination/search/query filters for admin CMS resources.
- Add automated tests around CMS validation and admin auth protection.
- Add richer media metadata if CMS media library becomes a dedicated feature.

---

## CMS Work Log - 2026-05-09 Backend Continuation

Implemented after the final pass:
- Added admin CMS collection query support for `search`, `status`, `page`, and `limit`.
- Admin CMS collection responses now include `meta` with page, limit, total, and totalPages.
- Restored Express request type augmentation under `src/types/express/index.d.ts` so `req.user` is available to TypeScript with the current `typeRoots` setup.

Validation performed:
- `npm run build` passed.
- Smoke tested admin CMS filtering and pagination:
  - `GET /api/admin/cms/pages?search=about&status=published&page=1&limit=5`
  - `GET /api/admin/cms/contact-submissions`
Blog, media library, role system, preview mode, drag-and-drop sections — to su druge faze. Ako Codex-u odmah kažeš “napravi CMS”, vrlo lako će napraviti preširok, polufunkcionalan monstrum. Bolje ga natjerati da napravi dosadan, stabilan kostur. Dosadno je često znak da backend neće eksplodirati u petak u 23:40.
