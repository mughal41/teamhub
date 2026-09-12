# TeamHub Backend (Django + DRF)

REST API for the TeamHub HR portal. Role-scoped for Admin, Manager, and Employee.

## Stack

- Django 5 + Django REST Framework
- JWT auth (`djangorestframework-simplejwt`)
- CORS for Vite frontend (`localhost:3000`)
- SQLite by default (local). PostgreSQL via `.env`

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 8000
```

API base: `http://127.0.0.1:8000/api/`

## Demo accounts

Password for all: `TeamHub@123`

| Role     | Email                        |
|----------|------------------------------|
| Admin    | davis.levin@teamhub.corp     |
| Manager  | marcus.brody@teamhub.corp    |
| Employee | olivia.chen@teamhub.corp     |

## Auth

```http
POST /api/auth/login/
{ "email": "...", "password": "TeamHub@123" }

→ { "user": {...}, "tokens": { "access", "refresh" } }
```

Use header: `Authorization: Bearer <access>`

Also: `POST /api/auth/register/`, `GET|PATCH /api/auth/me/`, `POST /api/auth/change-password/`, `POST /api/auth/token/refresh/`

## Main endpoints

| Module        | Path |
|---------------|------|
| Departments   | `/api/departments/` |
| Employees     | `/api/employees/` |
| Attendance    | `/api/attendance/records/`, `/clock/`, `/corrections/` |
| Leaves        | `/api/leaves/`, `/api/leaves/:id/decide/` |
| Performance   | `/api/performance/` |
| Payroll       | `/api/payroll/` (admin + employee only) |
| Calendar      | `/api/calendar/events/` |
| Inbox         | `/api/inbox/messages/`, `/api/inbox/notifications/` |
| Recruitment   | `/api/recruitment/jobs/`, `/candidates/` (admin) |

## PostgreSQL (optional)

In `.env`:

```
DB_ENGINE=postgresql
DB_NAME=teamhub
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
```

Then recreate DB and run `migrate` + `seed_demo` again.

## Admin

```bash
python manage.py createsuperuser
# or use demo admin and open http://127.0.0.1:8000/admin/
```
