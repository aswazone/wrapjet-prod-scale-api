# 🚀 CI/CD Workflows - Quick Reference

## 📋 Workflows Overview

| Workflow | Triggers | Purpose | Duration |
|----------|----------|---------|----------|
| **Lint & Format** | Push/PR to main/staging | Code quality checks | ~2-3 min |
| **Tests** | Push/PR to main/staging | Run tests + coverage | ~3-5 min |
| **Docker Build** | Push to main, Manual | Build & push images | ~5-8 min |

---

## ⚡ Quick Commands

### Local Pre-Commit Checks
```bash
npm run lint:fix && npm run format && npm test
```

### Fix All Issues
```bash
npm run lint:fix  # Fix ESLint issues
npm run format    # Fix formatting
```

### Run Tests
```bash
npm test                          # Run all tests
npm test -- --coverage           # With coverage
npm test -- --watch              # Watch mode
```

---

## 🎯 Workflow Triggers

### Lint & Format
```yaml
✓ Push to main/staging
✓ PR to main/staging
```

### Tests
```yaml
✓ Push to main/staging
✓ PR to main/staging
✓ Uses PostgreSQL service
```

### Docker Build
```yaml
✓ Push to main
✓ Manual trigger (Actions tab)
```

---

## 🏷️ Docker Image Tags

| Tag | Description | Example |
|-----|-------------|---------|
| `latest` | Latest from main | `username/app:latest` |
| `main` | Main branch | `username/app:main` |
| `main-<sha>` | Commit SHA | `username/app:main-abc123` |
| `prod-<timestamp>` | Production release | `username/app:prod-20251018-162345` |

---

## 📊 Expected Outputs

### ✅ Success
```
Lint & Format: ✅ All checks passed
Tests:         ✅ 15/15 tests passed (85% coverage)
Docker Build:  ✅ Image pushed to Docker Hub
```

### ❌ Failure
```
Lint & Format: ❌ Run 'npm run lint:fix'
Tests:         ❌ 3 tests failed
Docker Build:  ❌ Check Docker Hub credentials
```

---

## 🔐 Required Secrets

| Secret | Where to Get | Used By |
|--------|--------------|---------|
| `DOCKER_USERNAME` | Docker Hub account | Docker Build |
| `DOCKER_PASSWORD` | Docker Hub access token | Docker Build |

**Add at:** Settings → Secrets and variables → Actions

---

## 🚦 Workflow Status

Check status at: `https://github.com/aswazone/wrapjet-prod-scale-api/actions`

### Status Badges
```markdown
![Lint](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/lint-and-format.yml/badge.svg)
![Tests](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/tests.yml/badge.svg)
![Docker](https://github.com/aswazone/wrapjet-prod-scale-api/actions/workflows/docker-build-and-push.yml/badge.svg)
```

---

## 🛠️ Common Fixes

### Lint Issues
```bash
npm run lint:fix
```

### Format Issues
```bash
npm run format
```

### Test Failures
```bash
# Run with same env as CI
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npm test
```

### Docker Build Fails
```bash
# Test locally
docker build -t test --target production .
```

---

## 📝 Workflow Files

| File | Lines | Purpose |
|------|-------|---------|
| `lint-and-format.yml` | 88 | ESLint & Prettier |
| `tests.yml` | 133 | Jest tests + coverage |
| `docker-build-and-push.yml` | 94 | Docker build & push |

---

## 🎓 Tips

1. **Always test locally first** before pushing
2. **Review workflow summaries** in the Actions tab
3. **Fix issues immediately** to keep builds green
4. **Use meaningful commit messages** for tracking
5. **Check coverage reports** to maintain quality

---

## 📚 Documentation

- [Full CI/CD Guide](../../CI-CD-SETUP.md)
- [Workflow Details](README.md)
- [Docker Guide](../../DOCKER.md)

---

**Last Updated:** 2025-10-18
