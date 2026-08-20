# CompanionAI - Deployment & Production Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (unit + integration)
- [ ] Code coverage > 70%
- [ ] No console.logs or debug statements
- [ ] TypeScript strict mode enabled
- [ ] Linting passes (ESLint, Prettier)
- [ ] No hardcoded secrets or API keys
- [ ] API error handling comprehensive
- [ ] Loading states implemented
- [ ] Fallback UI for failures

### Security
- [ ] JWT secrets rotated
- [ ] CORS origins whitelist configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using ORM)
- [ ] XSS protection (CSP headers)
- [ ] CSRF tokens implemented
- [ ] Password hashing (bcrypt/argon2)
- [ ] API authentication on all protected routes
- [ ] Data encryption in transit (HTTPS/TLS)
- [ ] PII handling compliant
- [ ] GDPR/privacy policy in place

### Database
- [ ] All migrations applied
- [ ] Database backups configured
- [ ] Connection pooling enabled
- [ ] Indexes created for performance
- [ ] Read replicas for analytics (optional)
- [ ] Database monitoring alerts set up
- [ ] Query performance optimized (no N+1)
- [ ] Data retention policies defined

### Frontend
- [ ] Build optimized (code splitting, lazy loading)
- [ ] Bundle size analyzed
- [ ] Images optimized
- [ ] PWA configuration complete
- [ ] Manifest.json configured
- [ ] Service worker set up
- [ ] SEO metadata (Open Graph, etc)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested

### Backend
- [ ] Health check endpoint implemented
- [ ] Graceful shutdown handlers
- [ ] Dependency injection set up
- [ ] Logging centralized (Sentry/ELK)
- [ ] Monitoring & alerting configured
- [ ] API documentation complete
- [ ] Rate limiting thresholds appropriate
- [ ] Async tasks (Celery) production-ready

### DevOps & Infrastructure
- [ ] Docker images tested locally
- [ ] Docker Compose for local dev
- [ ] CI/CD pipeline configured
- [ ] Environment variables templated
- [ ] Secrets management (GitHub Secrets, etc)
- [ ] Database migrations automated in CI
- [ ] Rollback strategy documented
- [ ] Load testing completed
- [ ] Auto-scaling configured
- [ ] CDN configured for static assets

### Monitoring & Observability
- [ ] Sentry error tracking
- [ ] Application performance monitoring (APM)
- [ ] Log aggregation (ELK, CloudWatch, etc)
- [ ] Uptime monitoring
- [ ] Real-time alerting
- [ ] Dashboard created
- [ ] Metrics exported (Prometheus, DataDog, etc)

### Documentation
- [ ] API documentation complete
- [ ] Architecture documentation
- [ ] Deployment guide
- [ ] Runbook for common issues
- [ ] Database schema documented
- [ ] Environment variables documented
- [ ] Post-incident review template
- [ ] Team onboarding guide

---

## Backend Deployment

### Option 1: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL plugin
railway add

# Deploy
railway up

# View logs
railway logs
```

### Option 2: Heroku

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create companionai-backend

# Set environment variables
heroku config:set ENVIRONMENT=production
heroku config:set DEEPSEEK_API_KEY=...

# Deploy
git push heroku main

# Run migrations
heroku run alembic upgrade head

# View logs
heroku logs --tail
```

### Option 3: DigitalOcean App Platform

```bash
# Create app.yaml
cat > app.yaml << EOF
name: companionai-backend
services:
- name: api
  github:
    repo: your-org/companionai-backend
    branch: main
  build_command: pip install -r requirements.txt
  run_command: gunicorn -w 4 app.main:app
  environment_slug: python
  envs:
  - key: ENVIRONMENT
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  http_port: 8000
databases:
- name: postgres
  engine: PG
  version: "15"
EOF

# Deploy via DigitalOcean CLI or web UI
```

### Docker Image for Production

```dockerfile
# Dockerfile.prod
FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

# Run migrations
RUN alembic upgrade head

# Start application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "app.main:app"]
```

### Environment Configuration (Production)

```bash
# .env.production
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-long-random-key>

# Supabase (Production project)
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_KEY=<production-key>
SUPABASE_SERVICE_ROLE_KEY=<production-service-role>
DATABASE_URL=postgresql://prod-user:strong-password@db.supabase.co:5432/companionai

# External APIs
DEEPSEEK_API_KEY=<production-key>
OPENAI_API_KEY=<production-key>
HUGGINGFACE_API_KEY=<production-key>

# Security
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
ALLOWED_ORIGINS=https://app.companionai.com,https://www.companionai.com

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=INFO

# Redis (Production)
REDIS_URL=redis://:password@redis-prod.com:6379/0

# Rate Limiting (stricter in production)
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir dist
```

### Option 3: GitHub Pages

```bash
# Add to package.json
"homepage": "https://your-org.github.io/companionai",
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Production Build Optimization

```bash
# vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
          supabase: ['@supabase/supabase-js'],
          recharts: ['recharts'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
```

### Production Environment Variables

```bash
# .env.production
VITE_API_BASE_URL=https://api.companionai.com/api/v1
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=<production-anon-key>
VITE_GOOGLE_CLIENT_ID=<production-google-client-id>
VITE_ENV=production
VITE_ENABLE_ANALYTICS=true
```

---

## Database Setup (Supabase Production)

### Initial Setup

```sql
-- Run all migrations via Supabase dashboard or CLI
-- Or import SQL files

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";  -- For future RAG features

-- Create indexes for performance
CREATE INDEX idx_moods_user_created ON mood_logs(user_id, created_at DESC);
CREATE INDEX idx_recommendations_user ON recommendations(user_id, created_at DESC);
CREATE INDEX idx_activities_category ON activities(category);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
-- ... other tables

-- Create RLS policies
CREATE POLICY users_own_profile ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_own_moods ON mood_logs
  FOR SELECT USING (auth.uid() = user_id);
-- ... other policies
```

### Backup Strategy

```bash
# Daily backups via Supabase
# Enable point-in-time recovery (PITR) in Supabase dashboard

# Manual backup
pg_dump -h db.supabase.co -U postgres companionai > backup.sql

# Restore
psql -h db.supabase.co -U postgres companionai < backup.sql
```

---

## Monitoring & Logging

### Sentry Configuration

```python
# app/config.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment=settings.ENVIRONMENT,
    release=VERSION,
)
```

### Application Performance Monitoring

```python
# app/middleware/monitoring.py
from time import time
from starlette.middleware.base import BaseHTTPMiddleware

class MonitoringMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time()
        response = await call_next(request)
        duration = time() - start
        
        # Log to monitoring service
        logger.info(
            "request_completed",
            path=request.url.path,
            method=request.method,
            status=response.status_code,
            duration=duration,
        )
        
        return response
```

### Log Aggregation Setup

```bash
# For ELK Stack deployment
# Configure in app with python-json-logger

# For CloudWatch (AWS)
# Or DataDog

# For Papertrail
pip install python-papertrail
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run tests
        run: pytest --cov=app tests/
      
      - name: Run linting
        run: pylint app/

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: npm run build
        working-directory: ./frontend
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Scaling Considerations

### Database Scaling

```sql
-- Create read replica for analytics
-- Configure in Supabase dashboard

-- Use connection pooling
-- PgBouncer or pgpool2

-- Optimize slow queries
-- Use EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM mood_logs
WHERE user_id = 'xxx' AND created_at > NOW() - INTERVAL '30 days';
```

### Backend Scaling

```bash
# Docker Swarm or Kubernetes
# Auto-scaling based on CPU/memory
# Load balancing (nginx, HAProxy)

# Rate limiting per user
# Caching layer (Redis)
# Queue system for heavy operations (Celery)
```

### Frontend Caching

```javascript
// Service Worker caching strategy
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
}

// Cache-Control headers
// Max-age: 3600 for API responses
// Max-age: 86400 for assets
```

---

## Incident Response

### Health Check Endpoint

```python
# app/api/v1/health.py
@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint for uptime monitoring
    """
    try:
        # Check database connection
        db.execute("SELECT 1")
        
        # Check external services
        # DeepSeek, OpenAI, etc.
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow(),
            "services": {
                "database": "ok",
                "deepseek": "ok",
                "openai": "ok"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
```

### Rollback Strategy

```bash
# Tag releases
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# If issues occur, rollback
git revert HEAD
git push
# or
railway rollback  # For Railway
heroku releases  # For Heroku
```

### Post-Incident Review Template

```markdown
# Incident Report: [Date/Time]

## Summary
What happened?

## Impact
- Duration
- Users affected
- Services impacted

## Root Cause
Why did it happen?

## Resolution
How was it fixed?

## Prevention
How do we prevent this?

## Timeline
- [Time] Event started
- [Time] Detected
- [Time] Investigated
- [Time] Resolved
```

---

## Performance Benchmarks

### Target Metrics
- Page Load Time: < 2s
- API Response Time: < 200ms (p95)
- First Contentful Paint: < 1.5s
- Lighthouse Score: > 90
- Core Web Vitals: All "Good"

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 100 https://api.companionai.com/api/v1/moods/logs

# Using k6
k6 run load-test.js

# Using JMeter
jmeter -n -t test-plan.jmx
```

---

## Maintenance Schedule

- **Daily**: Monitor logs, check uptime
- **Weekly**: Review error rates, user feedback
- **Monthly**: Database maintenance, dependency updates
- **Quarterly**: Security audit, performance review
- **Annually**: Major version upgrades, architecture review

---

## Rollback Procedure

1. Identify issue
2. Gather metrics/logs
3. Tag current version
4. Revert to last known good
5. Deploy
6. Verify
7. Document incident
8. Post-mortem meeting

