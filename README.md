<img src="https://socialify.git.ci/Bongeka-Bhungane/collaboration-app/image?description=1&font=Raleway&language=1&name=1&owner=1&pattern=Circuit+Board&theme=Light" alt="collaboration-app" width="640" height="320" />

# Collaborative Code Review Platform

A REST API-driven service that enables developers and teams to post code snippets, request feedback, and collaborate on reviews in real-time. Includes authentication, project management, code submissions, inline comments, review workflow, notifications, and analytics.

---

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript  
- **Database**: PostgreSQL  
- **Authentication**: JWT  
- **Real-time Updates**: Socket.IO  
- **Validation**: express-validator  

---

## Setup

1. Clone the repository:

```bash
git clone <https://github.com/Bongeka-Bhungane/collaboration-app>
cd collaboration-app
```
Install dependencies:
```
npm install
```
Configure .env file:
```
DB_USER=postgres
DB_PASSWORD=your password
DB_HOST=localhost
DB_DATABASE=collaborative_app
DB_PORT=5432
APP_PORT=3000
JWT_SECRET=jggfdsrryryjhghjufkjfku
```
Run the server:
```
npm run dev
```

---

## API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login` | Login user and receive JWT |

## Users

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET    | `/api/users/:id` | Get user profile |
| PATCH  | `/api/users/:id` | Update user profile |
| DELETE | `/api/users/:id` | Delete user |
| GET    | `/api/users/:id/notifications` | Get user activity feed |

---

## Projects

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/projects` | Create a new project |
| GET    | `/api/projects` | List all projects |
| POST   | `/api/projects/:id/members` | Add user to project |
| DELETE | `/api/projects/:id/members/:userId` | Remove user from project |
| GET    | `/api/projects/:id/stats` | Get project statistics (review times, active reviewers, most commented submission) |

---

## Submissions

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/submissions` | Create a new submission |
| GET    | `/api/projects/:id/submissions` | List all submissions for a project |
| GET    | `/api/submissions/:id` | Get single submission |
| PATCH  | `/api/submissions/:id/status` | Update submission status |
| DELETE | `/api/submissions/:id` | Delete submission |

---

## Comments

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/submissions/:id/comments` | Add comment to submission |
| GET    | `/api/submissions/:id/comments` | List all comments for a submission |
| PATCH  | `/api/comments/:id` | Update a comment |
| DELETE | `/api/comments/:id` | Delete a comment |

---

## Review Workflow

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/api/submissions/:id/approve` | Approve submission |
| POST   | `/api/submissions/:id/request-changes` | Request changes |
| GET    | `/api/submissions/:id/reviews` | Get review history for a submission |

---

## WebSocket Events 

* joinProject — join a project room

* commentAdded — a new comment was added

* reviewUpdated — a submission status was updated

