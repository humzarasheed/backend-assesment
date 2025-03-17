# Cloud-Based Collaborative Book Platform

## Overview

A cloud-based platform built with **Laravel 12** and **React** (using **Inertia.js**) where users can create, save, and collaborate on books. **Authors** can manage books and sections, while **Collaborators** contribute to sections they have access to. The platform also provides functionality for **collaborators** to be invited by **authors** and manage collaboration access.

### Key Technologies
- **Laravel 12** for backend
- **React** and **Inertia.js** for frontend
- Spatie Laravel Package for Roles & Permissions management.
- **SQLite** for database (used for quicker setup)

## Features
- **User Roles**:
  - **Authors**: Create books, manage sections, add/revoke collaborators, and see only their own books.
  - **Collaborators**: Edit sections of books they are assigned to and see only books they have access to.

- **Collaborator Management**: Authors can add and remove collaborators for their books.

- **Book & Section Management**: Authors can create books with nested sections and subsections. Collaborators can edit allowed sections.
- **Caching** for swift response times especially for book's section retrieval.

- **Unit Tests** for backend logic to ensure stability and reliability.
- **Database**: **SQLite** for development (easy setup)
## Trade-offs
- **Database**: **SQLite** is chosen for its quick setup, making it easier to get started without dealing with complex database configurations. For production, it can be switched to a more robust database like MySQL or PostgreSQL.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone git@github.com:humzarasheed/backend-assesment.git
2. Navigate to the project directory:
   ```bash
   cd backend-assesment
3. Install dependencies:
    ```bash
    composer install
4. Copy the example environment file:
   ```bash
   cp .env.example .env
5. Generate the application key:
   ```bash
   php artisan key:generate
6. Run migrations and seed the database:
   ```bash
   php artisan migrate --seed
7. Install node modules:
   ```bash
   npm install
8. Start the development server:
   ```bash
   composer run dev
