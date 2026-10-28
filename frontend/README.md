# NOIRÉ: Premium Restaurant Website

A full-stack restaurant website: React frontend, Django REST backend, database-driven menu, reservations, contact form, and a restaurant-owner admin.

## Stack

- **Frontend:** React (Vite), React Router, Bootstrap 5, Framer Motion, Lucide icons, custom CSS
- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite in development, PostgreSQL in production (via `DATABASE_URL`)

## Features

- Cinematic homepage: hero, introduction, categories, signature menu, about, chefs, gallery with lightbox, testimonials, contact, newsletter
- Menu, categories, chefs, gallery, and testimonials managed in Django Admin
- Reservation requests with backend validation, opening hours, booking rules, and a unique reference (requests start as *Pending*; staff confirm in the admin)
- Contact form and newsletter stored in the database
- WhatsApp and Google Maps hide themselves until the owner configures them
- Loading, empty, and error states; `prefers-reduced-motion` support

## Local setup (Windows PowerShell)

### Backend (terminal in `backend/`)

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py seed_menu
python manage.py seed_restaurant
python manage.py createsuperuser
python manage.py runserver
```

Backend: http://127.0.0.1:8000, admin: http://127.0.0.1:8000/admin/

### Frontend (second terminal in `frontend/`)

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/categories/` | Menu categories |
| GET | `/api/menu/` | Menu items (`?category=slug`, `?featured=true`) |
| GET | `/api/menu/<slug>/` | One menu item |
| GET | `/api/chefs/` | Chefs |
| GET | `/api/gallery/` | Gallery images (`?category=food`) |
| GET | `/api/testimonials/` | Testimonials |
| GET | `/api/booking-info/` | Opening hours and booking rules |
| POST | `/api/reservations/` | Create a reservation request |
| POST | `/api/contact/` | Send a contact message |
| POST | `/api/newsletter/` | Subscribe to the newsletter |

## Before handing to a client

Replace all demo content: address, phone, email, and opening hours (`frontend/src/config/site.js` and the admin), sample chefs and testimonials, the text in the introduction and About sections, and add real photographs through the admin. Set `VITE_WHATSAPP_NUMBER`, `VITE_GOOGLE_MAPS_EMBED_URL`, `VITE_GOOGLE_MAPS_URL`, and the social links in `frontend/.env`.

## Images

Add `hero.jpg` and `intro.jpg` to `frontend/public/images/`. Use only photographs you are licensed to use.