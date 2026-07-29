# Recipe Demo App

A modern, high-performance web application for discovering, managing, and creating recipes. Built with **Angular 20** and a **.NET Core & PostgreSQL** backend.

**Live Demo:** [angular-recipe-client-gray.vercel.app](https://angular-recipe-client-gray.vercel.app)

---

## Overview

**Recipe Client** provides a seamless user experience for browsing culinary recipes and managing custom recipes. Built with the latest Angular standards, modern state management, and optimized performance.

---

## Features

- **Recipe Management:** Create, update, and delete custom recipes.
- **Responsive Design:** Mobile-first layout tailored for mobile, tablet, and desktop screens.
- **Optimized Performance:** Fast client-side rendering powered by Angular 20 features.

---

## Tech Stack

- **Framework:** Angular 20
- **Language:** TypeScript
- **Styling:** CSS3
- **Backend API:** .NET Core RESTful API + PostgreSQL 

---

## Architecture & Security

### Clean Architecture

The application follows strict separation of concerns to ensure maintainability, scalability, and testability:

- **Core / Domain:** Models, domain interfaces, and core business rules.
- **Use Cases / Application:** Business logic handlers, state management, and orchestration services.
- **Infrastructure / Data:** HTTP repositories, API integration services, and storage abstractions.
- **Presentation / UI:** Angular standalone components, directives, pipes, and presentation logic.

### Security

- **JWT Authentication:** Secure token-based access via HttpInterceptor to automatically attach authorization headers to        outgoing requests.
- **XSS & Input Sanitization:** Contextual escalation protection and data sanitization on dynamic user inputs.
- **CORS & CSRF Integration:** Configured to communicate securely with the .NET Core API using secure header practices.
