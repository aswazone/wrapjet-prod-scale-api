# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing, linting, and deployment of the Wrapjet Production Scale API.

## 📋 Available Workflows

### 1. Lint and Format (`lint-and-format.yml`)

**Triggers:**
- Push to `main` or `staging` branches
- Pull requests to `main` or `staging` branches

**What it does:**
- ✅ Runs ESLint to check code quality
- ✅ Runs Prettier to check code formatting
- ✅ Provides clear annotations and fix suggestions
- ✅ Generates GitHub step summary with results

**Fix commands:**
```bash
# Fix ESLint issues
npm run lint:fix

# Fix Prettier formatting
npm run format
```

---

### 2. Tests (`tests.yml`)

**Triggers:**
- Push to `main` or `staging` branches
- Pull requests to `main` or `staging` branches

**What it does:**
- ✅ Runs all tests with Jest
- ✅ Generates code coverage reports
- ✅ Uploads coverage artifacts (30-day retention)
- ✅ Creates detailed test summary with coverage metrics
- ✅ Provides annotations for test failures
- ✅ Uses PostgreSQL 16 service container for database tests

**Environment:**
- `NODE_ENV=test`
- `NODE_OPTIONS=--experimental-vm-modules`
- `DATABASE_URL=postgres://postgres:postgres@localhost:5432/wrapjet_test`

**Run locally:**
```bash
npm test
```

---

### 3. Docker Build and Push (`docker-build-and-push.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger via `workflow_dispatch`

**What it does:**
- ✅ Builds production Docker image
- ✅ Supports multi-platform builds (linux/amd64, linux/arm64)
- ✅ Pushes to Docker Hub
- ✅ Generates multiple tags (latest, branch, SHA, timestamp)
- ✅ Uses layer caching for faster builds
- ✅ Creates comprehensive build summary

**Image tags generated:**
- `latest` - Latest stable version from main branch
- `main` - Current main branch version
- `main-<sha>` - Specific commit SHA
- `prod-YYYYMMDD-HHmmss` - Timestamped production release

**Pull command:**
```bash
docker pull <DOCKER_USERNAME>/wrapjet-prod-scale-api:latest
```

---

## 🔐 Required Secrets

To enable all workflows, configure these secrets in your GitHub repository:

### Docker Hub Secrets (for docker-build-and-push.yml)

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password or access token |

**How to add secrets:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret with its value

---

## 📊 Workflow Status Badges

Add these badges to your README.md to show workflow status:

```markdown
![Lint and Format](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/lint-and-format.yml/badge.svg)
![Tests](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/tests.yml/badge.svg)
![Docker Build](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/docker-build-and-push.yml/badge.svg)
```

---

## 🚀 Workflow Execution Flow

### On Pull Request to main/staging:

```
1. Lint and Format ──→ ESLint check ──→ Prettier check
                     ├─ ✅ Pass: Merge allowed
                     └─ ❌ Fail: Shows fix commands

2. Tests ──→ Setup PostgreSQL ──→ Run tests ──→ Generate coverage
          ├─ ✅ Pass: Coverage uploaded
          └─ ❌ Fail: Shows failing tests
```

### On Push to main:

```
1. Lint and Format ──→ Check code quality
2. Tests ──→ Verify functionality
3. Docker Build ──→ Build image ──→ Push to Docker Hub
                  └─ Generate tags (latest, prod-timestamp, etc.)
```

---

## 🛠️ Local Testing

Before pushing, run these commands locally to catch issues:

```bash
# Run all checks
npm run lint
npm run format:check
npm test

# Or fix issues automatically
npm run lint:fix
npm run format
```

---

## 📝 Workflow Features

### Caching
All workflows use npm caching to speed up dependency installation:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.x'
    cache: 'npm'
```

### Annotations
Workflows provide inline annotations in the GitHub UI:
- ❌ **Errors**: Show what went wrong
- 💡 **Suggestions**: Provide fix commands
- ℹ️ **Notices**: Inform about successful operations

### Step Summaries
Each workflow generates a markdown summary visible in the Actions tab:
- Test coverage tables
- Docker image details
- Fix suggestions
- Quick reference commands

---

## 🔧 Customization

### Modify Trigger Branches

To add more branches (e.g., `develop`):

```yaml
on:
  push:
    branches:
      - main
      - staging
      - develop  # Add this
```

### Adjust Coverage Requirements

Edit `tests.yml` to add coverage thresholds:

```yaml
- name: Check coverage thresholds
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "::error::Coverage is below 80%"
      exit 1
    fi
```

### Add More Platforms

To add more Docker platforms:

```yaml
platforms: linux/amd64,linux/arm64,linux/arm/v7
```

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

---

## 🆘 Troubleshooting

### Workflow fails with "npm ci" error
**Solution:** Delete `package-lock.json` and run `npm install` to regenerate it.

### Tests fail in CI but pass locally
**Solution:** Check environment variables. CI uses `NODE_ENV=test` and PostgreSQL service.

### Docker build fails with authentication error
**Solution:** Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets are correctly set.

### Coverage report not generated
**Solution:** Ensure Jest is configured correctly and test files exist.

---

## ✅ Best Practices

1. **Always run tests locally before pushing**
   ```bash
   npm test
   ```

2. **Fix linting issues before committing**
   ```bash
   npm run lint:fix
   npm run format
   ```

3. **Review workflow logs for detailed error messages**

4. **Use meaningful commit messages** to track changes in workflow runs

5. **Keep secrets secure** - never commit credentials to the repository

---

For more information, see the main [README.md](../../README.md) or [DOCKER.md](../../DOCKER.md).
