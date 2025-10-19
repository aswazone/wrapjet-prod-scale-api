# 🔄 CI/CD Setup Guide

## Overview

Your project now has a complete CI/CD pipeline using **GitHub Actions** with three automated workflows for code quality, testing, and deployment.

---

## ✅ What Was Created

### 1. **Lint and Format Workflow** (`.github/workflows/lint-and-format.yml`)

Automatically checks code quality on every push and pull request.

**Features:**

- ✅ ESLint code quality checks
- ✅ Prettier formatting verification
- ✅ Clear error annotations with fix suggestions
- ✅ GitHub step summary with results

**Triggers:**

- Push to `main` or `staging`
- Pull requests to `main` or `staging`

---

### 2. **Tests Workflow** (`.github/workflows/tests.yml`)

Runs automated tests with coverage reporting.

**Features:**

- ✅ Jest test execution
- ✅ PostgreSQL 16 service container
- ✅ Code coverage reports
- ✅ Coverage artifacts (30-day retention)
- ✅ Detailed test summaries
- ✅ Test failure annotations

**Environment:**

- `NODE_ENV=test`
- `NODE_OPTIONS=--experimental-vm-modules`
- PostgreSQL database for testing

**Triggers:**

- Push to `main` or `staging`
- Pull requests to `main` or `staging`

---

### 3. **Docker Build and Push Workflow** (`.github/workflows/docker-build-and-push.yml`)

Builds and publishes Docker images to Docker Hub.

**Features:**

- ✅ Multi-platform builds (linux/amd64, linux/arm64)
- ✅ Docker layer caching for speed
- ✅ Multiple image tags
- ✅ Automated versioning
- ✅ Build summaries with pull commands

**Image Tags:**

- `latest` - Latest from main branch
- `main` - Current main branch
- `main-<sha>` - Specific commit
- `prod-YYYYMMDD-HHmmss` - Timestamped releases

**Triggers:**

- Push to `main` branch
- Manual workflow dispatch

---

## 🔐 Required Setup

### Step 1: Configure GitHub Secrets

Add these secrets to your GitHub repository for Docker deployment:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name       | Description                         | Example          |
| ----------------- | ----------------------------------- | ---------------- |
| `DOCKER_USERNAME` | Your Docker Hub username            | `johndoe`        |
| `DOCKER_PASSWORD` | Docker Hub password or access token | `dckr_pat_xxxxx` |

**Getting Docker Hub Access Token:**

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Go to **Account Settings** → **Security** → **Access Tokens**
3. Click **New Access Token**
4. Give it a name (e.g., "GitHub Actions")
5. Copy the token and use it as `DOCKER_PASSWORD`

---

## 🚀 Quick Start

### Run All Checks Locally

Before pushing code, run these commands:

```bash
# Lint code
npm run lint

# Check formatting
npm run format:check

# Run tests
npm test

# Fix issues automatically
npm run lint:fix
npm run format
```

### Push Code

Once checks pass locally:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

This will trigger all workflows automatically.

---

## 📊 Monitoring Workflows

### View Workflow Runs

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Select a workflow to see its runs
4. Click a specific run to view details

### Check Status Badges

Add these badges to your README.md:

```markdown
![Lint and Format](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/lint-and-format.yml/badge.svg)
![Tests](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/tests.yml/badge.svg)
![Docker Build](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/docker-build-and-push.yml/badge.svg)
```

---

## 🔄 Workflow Pipeline

### Pull Request Flow

```
Developer creates PR
       ↓
Lint & Format Check
       ↓
   ✅ Pass → Continue
   ❌ Fail → Show fix commands
       ↓
    Run Tests
       ↓
   ✅ Pass → Ready to merge
   ❌ Fail → Show failing tests
```

### Main Branch Push Flow

```
Code merged to main
       ↓
Lint & Format Check
       ↓
    Run Tests
       ↓
Build Docker Image
       ↓
Push to Docker Hub
       ↓
Generate tags & summary
```

---

## 📝 Workflow Details

### 1. Lint and Format

**What happens:**

1. Checkout code
2. Setup Node.js 20.x with npm cache
3. Install dependencies with `npm ci`
4. Run ESLint
5. Run Prettier check
6. Provide fix suggestions if issues found

**Success Output:**

```
✅ Code Quality Check Passed
- ✅ ESLint: No issues found
- ✅ Prettier: Code is properly formatted
```

**Failure Output:**

```
❌ Code Quality Check Failed

### ESLint Issues
Run: npm run lint:fix

### Prettier Issues
Run: npm run format
```

---

### 2. Tests

**What happens:**

1. Checkout code
2. Setup Node.js 20.x with npm cache
3. Start PostgreSQL service container
4. Install dependencies with `npm ci`
5. Run tests with coverage
6. Upload coverage reports as artifacts
7. Generate test summary

**Success Output:**

```
✅ Tests Passed

📊 Coverage Report
| Metric     | Coverage |
|------------|----------|
| Statements | 85.5%    |
| Branches   | 78.2%    |
| Functions  | 82.1%    |
| Lines      | 85.3%    |

📁 Coverage reports available as artifacts for 30 days
```

**Failure Output:**

```
❌ Tests Failed

Test Suites: 2 failed, 3 passed, 5 total
Tests:       3 failed, 12 passed, 15 total

Run 'npm test' locally to reproduce failures
```

---

### 3. Docker Build and Push

**What happens:**

1. Checkout code
2. Setup Docker Buildx
3. Login to Docker Hub
4. Extract metadata (tags, labels)
5. Build multi-platform image
6. Push to Docker Hub
7. Generate build summary

**Success Output:**

```
🐳 Docker Image Published

📦 Image Details
Repository: username/wrapjet-prod-scale-api
Digest: sha256:abc123...

🏷️ Tags
username/wrapjet-prod-scale-api:latest
username/wrapjet-prod-scale-api:main
username/wrapjet-prod-scale-api:main-abc123
username/wrapjet-prod-scale-api:prod-20251018-162345

🖥️ Platforms
- linux/amd64
- linux/arm64

🚀 Pull Command
docker pull username/wrapjet-prod-scale-api:latest
```

---

## 🛠️ Customization

### Add More Branches

Edit workflow files to trigger on additional branches:

```yaml
on:
  push:
    branches:
      - main
      - staging
      - develop # Add this
```

### Add Coverage Thresholds

Add to `tests.yml` workflow:

```yaml
- name: Check coverage threshold
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "::error::Coverage is below 80%"
      exit 1
    fi
```

### Change Node.js Version

Update in all workflow files:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22.x' # Change this
    cache: 'npm'
```

---

## 🆘 Troubleshooting

### Problem: Lint fails in CI but passes locally

**Solution:**

```bash
# Ensure you're using the same Node version
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run lint
```

### Problem: Tests pass locally but fail in CI

**Causes:**

- Environment variable differences
- Database connection issues
- Timezone differences

**Solution:**

```bash
# Run tests with CI environment variables
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npm test
```

### Problem: Docker build fails

**Common issues:**

1. Incorrect Docker Hub credentials
2. Missing secrets in GitHub
3. Dockerfile errors

**Solution:**

```bash
# Test Docker build locally
docker build -t test-image --target production .

# Verify secrets are set in GitHub:
Settings → Secrets and variables → Actions
```

### Problem: Coverage artifacts not found

**Solution:**
Ensure Jest is configured correctly in `package.json`:

```json
"scripts": {
  "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest"
}
```

---

## 📚 Best Practices

### Before Committing

```bash
# Always run these locally first
npm run lint:fix
npm run format
npm test
```

### Commit Messages

Use clear, descriptive commit messages:

```bash
✅ Good: "Add user authentication middleware"
❌ Bad: "update stuff"
```

### Branch Strategy

```
main (production)
  ↑
staging (pre-production)
  ↑
feature/* (development)
```

### Pull Requests

- Always create PRs for code review
- Wait for all checks to pass
- Review workflow summaries
- Fix issues before merging

---

## 🎯 Next Steps

1. **Test Workflows**
   - Create a test branch
   - Make a small change
   - Push and watch workflows run

2. **Configure Secrets**
   - Add Docker Hub credentials
   - Test manual workflow trigger

3. **Monitor Builds**
   - Check Actions tab regularly
   - Review step summaries
   - Download coverage reports

4. **Add Status Badges**
   - Update README.md with badges
   - Show workflow status to team

5. **Customize Workflows**
   - Add coverage thresholds
   - Configure notifications
   - Add deployment stages

---

## 📖 Additional Documentation

- [Workflow README](.github/workflows/README.md) - Detailed workflow documentation
- [Docker Guide](DOCKER.md) - Docker setup and deployment
- [Deployment Summary](DEPLOYMENT_SUMMARY.md) - Deployment checklist

---

## ✅ Checklist

Before going live:

- [ ] Added GitHub secrets (DOCKER_USERNAME, DOCKER_PASSWORD)
- [ ] Tested lint workflow with a PR
- [ ] Verified tests run successfully
- [ ] Confirmed Docker image builds
- [ ] Added workflow status badges to README
- [ ] Reviewed all workflow logs
- [ ] Documented custom workflows
- [ ] Set up branch protection rules
- [ ] Configured notification settings
- [ ] Trained team on CI/CD process

---

**🎉 Your CI/CD pipeline is ready!**

Push code and watch the automation work for you. All workflows are configured to provide clear feedback and actionable insights.
