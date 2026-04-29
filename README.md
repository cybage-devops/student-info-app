# 🎓 StudentHub — Student Information App

A full-stack Student Information Management System built with **React.js** (frontend) and **Python FastAPI** (backend), deployed to **GCP Cloud Run** via **GitHub Actions**.

## Architecture

```
┌──────────────────┐     ┌──────────────────┐
│   React.js App   │────▶│  FastAPI Backend  │
│   (Cloud Run)    │     │   (Cloud Run)     │
│   Port: 8080     │     │   Port: 8080      │
└──────────────────┘     └──────────────────┘
        │                        │
        └────────┬───────────────┘
                 │
        ┌────────┴────────┐
        │  Artifact        │
        │  Registry        │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        │  GitHub Actions  │
        │  CI/CD Pipeline  │
        └─────────────────┘
```

## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | React 19 + Vite     |
| Backend    | Python 3.12 FastAPI |
| Hosting    | GCP Cloud Run       |
| CI/CD      | GitHub Actions      |
| Registry   | GCP Artifact Registry |
| Auth       | Workload Identity Federation |

## Project Structure

```
student-info-app/
├── frontend/          # React.js application
├── backend/           # Python FastAPI application
├── .github/workflows/ # CI/CD pipelines
└── README.md
```

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
# API available at http://localhost:8080
# Docs at http://localhost:8080/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

## CI/CD Setup

### Prerequisites
1. **GCP Project**: `openclaw-poc-492106`
2. **Artifact Registry** repository created:
   ```bash
   gcloud artifacts repositories create student-info-app \
     --repository-format=docker \
     --location=us-central1 \
     --project=openclaw-poc-492106
   ```
3. **Service Account** with roles:
   - `roles/run.admin`
   - `roles/artifactregistry.writer`
   - `roles/iam.serviceAccountUser`

4. **Workload Identity Federation** configured for GitHub Actions

### GitHub Secrets Required

| Secret               | Description                                      |
|----------------------|--------------------------------------------------|
| `WIF_PROVIDER`       | Workload Identity Provider resource name         |
| `WIF_SERVICE_ACCOUNT`| Service account email for deployment             |
| `BACKEND_URL`        | Cloud Run backend URL (after first backend deploy)|

## API Endpoints

| Method   | Endpoint              | Description          |
|----------|-----------------------|----------------------|
| `GET`    | `/api/students/`      | List all students    |
| `GET`    | `/api/students/{id}`  | Get student by ID    |
| `GET`    | `/api/students/stats` | Get statistics       |
| `POST`   | `/api/students/`      | Create student       |
| `PUT`    | `/api/students/{id}`  | Update student       |
| `DELETE` | `/api/students/{id}`  | Delete student       |
| `GET`    | `/health`             | Health check         |

## License

MIT
