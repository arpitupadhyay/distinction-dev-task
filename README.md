# Distinction Task – Full Stack App

This project is a full-stack user management system built with a serverless backend (AWS Lambda + API Gateway + DynamoDB) and a modern frontend (Next.js + Tailwind CSS). The goal is to demonstrate a clean UI, Architecture and secure APIs using serverless model.

## Backend (AWS CDK + Lambda + DynamoDB)

The backend is entirely serverless and defined using AWS CDK (in TypeScript). It includes:

### Key Components

- AWS Lambda (Node.js) – Handles all business logic (CRUD operations on users)
- Lambda Layers – Shared utilities (like `createResponse`) are moved into a layer for reusability and cleaner function code
- Amazon API Gateway – Exposes RESTful endpoints with proper CORS setup
- Amazon DynamoDB – Used for storing user records (partition key: `id`)
- AWS CDK – Used to define infrastructure as code
- Log Retention – Configured to retain logs for 1 day
- Environment Variables – `TABLE_NAME` is injected into Lambda functions for runtime config

### Lambda Functions

- `createUser` – Adds a new user to the DynamoDB table
- `getUser` – Fetches a user by ID
- `updateUser` – Updates user fields like name, email, city, country
- `deleteUser` – Deletes a user by ID
- `getAllUsers` – Lists all users in the system

### Layer Structure

Reusable response helpers like `createResponse` are moved into a Lambda Layer under:

```
backend/layers/common/nodejs/utils/response.ts
```

## Frontend (Next.js + Tailwind CSS)

The frontend is built using Next.js (App Router) and deployed via Vercel. It consumes the backend APIs securely and provides a clean UI for managing users.

### Tech Stack

- Next.js (v13+) – App directory structure used
- Tailwind CSS – For styling
- React Hook Form – Form management and validation
- Axios – API calls
- Zod – Schema validation for frontend input
- Vercel – Hosting and CI/CD deployment
- TypeScript – Full type-safety across the app

### Features

- Responsive and accessible UI
- Add, view, edit, delete users
- Reusable form and card components
- Optimistic UI updates and proper error handling
- Form validation using Zod
- Environment-aware API configuration (Vercel + localhost)

## Deployment URLs

- Frontend (Vercel): [https://distinction-dev-task.vercel.app/](https://distinction-dev-task.vercel.app/)
- API Gateway Base URL: `https://<api-id>.execute-api.<region>.amazonaws.com/prod/users`

## Folder Structure Overview

```
.
├── backend
│   ├── lambdas                # All Lambda handlers
│   ├── layers/common          # Shared utilities (response formatter)
│   ├── cdk                    # CDK stack files
├── frontend
│   ├── app/                   # App Router structure
│   ├── components/            # UI components
│   ├── lib/                   # Axios instance, API functions
```

## How to Run Locally

### Backend

```bash
cd backend
npm install
cdk bootstrap
cdk deploy
```

Ensure your AWS credentials are configured.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Author

Built by Arpit Upadhyay
