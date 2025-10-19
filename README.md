<div align="center">
  <br />
    <a href="https://youtu.be/H5FAxTBuNM8" target="_blank">
      <img src="public/readme/hero.png" alt="Project Banner">
    </a>
  <br />

  <div>
<img src="https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/-Neon%20Postgres-2496ED?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img src="https://img.shields.io/badge/-Drizzle%20ORM-FFDF00?style=for-the-badge&logo=drizzle&logoColor=black"/>

  </div>

  <h3 align="center">Build a Scalable Production Ready API</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">✨ Introduction</a>

Master DevOps by taking an API from code to production with Docker, Kubernetes, Git & GitHub, Warp, and CI/CD Actions! Build a scalable backend using Node.js, Express.js, Neon Postgres, and Drizzle ORM, while testing ensures reliability at every step. Learn to containerize services, orchestrate deployments, automate pipelines, and monitor applications—perfect for developers who want hands-on experience shipping robust, production-ready systems.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Arcjet](https://jsm.dev/dops25-arcjet)** is a developer-first security layer that enables you to protect your applications with minimal code. It offers features like bot protection, rate limiting, email validation, and defense against common attacks. Arcjet's SDK integrates seamlessly into your application, providing real-time security decisions without the need for additional infrastructure.

- **[Docker](https://www.docker.com/)** is a leading containerization platform that allows you to package applications along with all their dependencies into portable, lightweight containers. This ensures consistent behavior across different environments, simplifies deployment, and makes scaling applications more efficient.

- **[Kubernetes](https://kubernetes.io/)** is an open-source orchestration system designed to automate the deployment, scaling, and management of containerized applications. It handles tasks like load balancing, self-healing, and rolling updates, making it essential for running applications reliably at scale.

- **[Warp](https://jsm.dev/dops25-warp)** is a modern terminal built in Rust, optimized for developer productivity. It offers features like AI-assisted commands, easy collaboration, command history search, and a faster, more intuitive interface compared to traditional terminals.

- **[Node.js](https://nodejs.org/)** is a fast, event-driven JavaScript runtime built on Chrome’s V8 engine. It enables developers to build scalable, high-performance server-side applications and APIs using JavaScript on both the client and server side.

- **[Express.js](https://expressjs.com/)** is a minimal and flexible Node.js web application framework. It provides robust features for building APIs and server-side applications, including routing, middleware support, and simplified request/response handling.

- **[Neon Postgres](https://jsm.dev/dops25-neon)** is a fully managed, serverless Postgres database designed for modern cloud applications. It offers autoscaling, branching for development workflows, and simplifies database management without compromising performance.

- **[Drizzle ORM](https://orm.drizzle.team/)** is a TypeScript-first, lightweight ORM for SQL databases. It provides type safety, schema migrations, and an intuitive API for building reliable and maintainable database queries.

- **[Zod](https://zod.dev/)** is a TypeScript-first schema validation library that ensures runtime type safety. It helps developers validate data structures, enforce strict type checks, and catch errors early in the development process.

## <a name="features">🔋 Features</a>

👉 **Absolute Imports**: Clean import paths using `#` prefix aliases for more organized and readable code.

👉 **Business Listings**: Create, update, delete, and browse business listings efficiently.

👉 **Database Integration**: Integrate PostgreSQL with Drizzle ORM, including migrations for schema management.

👉 **Deal Management**: Create deals on listings, accept or reject offers, and track deal status.

👉 **Docker Support**: Full containerization with development and production environments for consistent deployment.

👉 **ESLint + Prettier**: Enforce code linting and formatting rules for cleaner, consistent code.

👉 **Health Monitoring**: Endpoint to check system health and monitor overall application status.

👉 **Hot Reload**: Development server automatically restarts on file changes for faster iteration.

👉 **Jest Testing**: Framework for unit and integration testing with SuperTest for HTTP endpoints.

👉 **Request Validation**: Validate all API inputs using Zod schemas to ensure data integrity.

👉 **Role-Based Access Control**: Implement admin and user roles with permission middleware for secure operations.

👉 **Structured Logging**: Winston-based logging throughout the application for better monitoring and debugging.

👉 **User Authentication & Authorization**: JWT-based authentication supporting signup, signin, and signout workflows.

👉 **User Management**: CRUD operations for user accounts, enabling easy administration and management.

And many more, including code architecture and reusability.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

**Cloning the Repository**

```bash
git clone https://github.com/aswazone/wrapjet-prod-scale-api.git

cd wrapjet-prod-scale-api
```

---

## 🐳 Docker Setup (Recommended)

This project supports **two deployment modes**: Development (with Neon Local) and Production (with Neon Cloud).

### 📦 Development Environment (Local with Neon Local)

Use **Neon Local** to run a local PostgreSQL instance that simulates Neon's serverless database for development.

**1. Set Up Environment Variables**

The `.env.development` file is already configured for local development:

```env
# Server configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Database configuration - Neon Local (Docker Compose)
DATABASE_URL=postgres://postgres:postgres@neon-local:5432/wrapjet_dev
```

**2. Start Development Environment**

Run the application with Neon Local using Docker Compose:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This will:

- Start **Neon Local** (PostgreSQL) on `localhost:5432`
- Start the **application** on `localhost:3000`
- Enable **hot-reload** for development

**3. Run Database Migrations**

Once the containers are running, execute migrations:

```bash
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

**4. (Optional) Access Drizzle Studio**

To manage your database visually with Drizzle Studio:

```bash
docker-compose -f docker-compose.dev.yml --profile tools up drizzle-studio
```

Access Drizzle Studio at: [http://localhost:4983](http://localhost:4983)

**5. Stop Development Environment**

```bash
docker-compose -f docker-compose.dev.yml down
```

To remove volumes (database data):

```bash
docker-compose -f docker-compose.dev.yml down -v
```

---

### 🚀 Production Environment (Neon Cloud)

For production, the application connects to **Neon Cloud** (serverless PostgreSQL).

**1. Set Up Environment Variables**

Update `.env.production` with your **Neon Cloud** database URL:

```env
# Server configuration
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Database configuration - Neon Cloud (Production)
DATABASE_URL=postgres://user:password@ep-example-123456.us-east-2.aws.neon.tech/wrapjet_prod?sslmode=require
```

> ⚠️ **Security Note**: In production, inject `DATABASE_URL` via environment variables from your secrets manager (AWS Secrets Manager, Kubernetes Secrets, etc.). **Never commit production credentials to version control.**

**2. Start Production Environment**

Export your production database URL and start the application:

**Linux/macOS:**

```bash
export DATABASE_URL="your-neon-cloud-database-url"
docker-compose -f docker-compose.prod.yml up --build -d
```

**Windows (PowerShell):**

```powershell
$env:DATABASE_URL="your-neon-cloud-database-url"
docker-compose -f docker-compose.prod.yml up --build -d
```

**3. Run Database Migrations**

```bash
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

**4. Monitor Logs**

```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

**5. Stop Production Environment**

```bash
docker-compose -f docker-compose.prod.yml down
```

---

## 💻 Local Setup (Without Docker)

If you prefer to run the application without Docker:

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database Configuration
DATABASE_URL=

# Arcjet
ARCJET_KEY=
```

Replace the placeholder values with your real credentials. You can get these by signing up at: [**Arcjet**](https://jsm.dev/dops25-arcjet), [**Neon**](https://jsm.dev/dops25-neon).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

---

## 📚 Additional Docker Commands

**View Running Containers**

```bash
docker ps
```

**Access Application Shell**

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app sh

# Production
docker-compose -f docker-compose.prod.yml exec app sh
```

**View Application Logs**

```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f app

# Production
docker-compose -f docker-compose.prod.yml logs -f app
```

**Rebuild Containers**

```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose -f docker-compose.prod.yml up --build
```

---

## 🗃️ Database Management

**Generate Migrations**

```bash
npm run db:generate
```

**Run Migrations**

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

**Open Drizzle Studio**

```bash
npm run db:studio
```

---

## 🔐 Environment Variables Reference

| Variable       | Description                  | Development   | Production    |
| -------------- | ---------------------------- | ------------- | ------------- |
| `NODE_ENV`     | Environment mode             | `development` | `production`  |
| `PORT`         | Application port             | `3000`        | `3000`        |
| `LOG_LEVEL`    | Logging verbosity            | `debug`       | `info`        |
| `DATABASE_URL` | PostgreSQL connection string | Neon Local    | Neon Cloud    |
| `ARCJET_KEY`   | Arcjet API key               | Your dev key  | Your prod key |

---

## 🌐 Neon Database Setup

### Development: Neon Local

- Automatically started via `docker-compose.dev.yml`
- Runs PostgreSQL locally in a Docker container
- Simulates Neon's serverless database features
- Data persists in Docker volumes
- Learn more: [Neon Local Documentation](https://neon.com/docs/local/neon-local)

### Production: Neon Cloud

- Fully managed serverless PostgreSQL
- Sign up at: [Neon](https://jsm.dev/dops25-neon)
- Create a project and database
- Copy your connection string to `.env.production`
- Supports autoscaling, branching, and point-in-time recovery

##

<div style="display: flex; align-items: center; margin-bottom: 20px;border:solid 1px #1cb5f1;border-radius:50px;padding:7px">
  <img src="https://avatars.githubusercontent.com/u/177445642?s=400&u=5504247eb9ea198d8fdac615f25b22655b16c2d9&v=4" width="50" alt="Aswazone" style="border-radius: 50%; margin-right: 10px; box-shadow:0px 0px 1px 2px #0b4d66;">
  <p style="margin: 0;">Follow <a href="https://github.com/aswazone">Aswazone</a> on GitHub for more projects simillar to this.</p>
</div>
