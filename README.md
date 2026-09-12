## Run Locally

### Frontend (Vite + React)

```bash
npm install
npm run dev
```

App: http://localhost:3000

### Backend (Django API)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 8000
```

API: http://127.0.0.1:8000/api/

Frontend talks to the API via `VITE_API_BASE_URL` in the project root `.env`
(default `http://127.0.0.1:8000/api`). Restart `npm run dev` after changing it.

See `backend/README.md` for endpoints and demo accounts.
