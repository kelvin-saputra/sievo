# SI-EVO

![Logo](https://gitlab.cs.ui.ac.id/propensi-2024-2025-genap/kelas-b/b14-cracked/-/raw/main/public/sidebar-logo.png)

<p align="center">
  <em>Empower Your Events, Streamline Your Success</em>
</p>

[![Pipeline Status](https://gitlab.cs.ui.ac.id/propensi-2024-2025-genap/kelas-b/b14-cracked/badges/main/pipeline.svg)](https://gitlab.cs.ui.ac.id/propensi-2024-2025-genap/kelas-b/b14-cracked/-/pipelines) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE) [![Deployed](https://img.shields.io/badge/deployed-live-emerald?style=flat&logo=rocket)](https://si-evo.vercel.app)




<p align="center">Built with the tools and technologies:</p>

<p align="center">
  <img src="https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white" alt="JSON">
  <img src="https://img.shields.io/badge/Markdown-000000?style=flat-square&logo=markdown&logoColor=white" alt="Markdown">
  <img src="https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm">
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=flat-square&logo=postcss&logoColor=white" alt="PostCSS">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <br>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" alt="Axios">
  <img src="https://img.shields.io/badge/date--fns-A239EA?style=flat-square" alt="date-fns">
  <img src="https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white" alt="React Hook Form">
  <img src="https://img.shields.io/badge/ShadCN%20UI-000000?style=flat-square&logo=tailwindcss&logoColor=white" alt="ShadCN UI">
  <img src="https://img.shields.io/badge/Radix%20UI-512DA8?style=flat-square" alt="Radix UI">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/React%20Icons-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React Icons">
  <img src="https://img.shields.io/badge/Lucide-000000?style=flat-square" alt="Lucide Icons">
  <img src="https://img.shields.io/badge/Chart.js-4488C3?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js">
  <img src="https://img.shields.io/badge/Upstash-00B37E?style=flat-square&logo=upstash&logoColor=white" alt="Upstash">
  <img src="https://img.shields.io/badge/EdgeStore-20232A?style=flat-square" alt="EdgeStore">

</p>

<hr/>


## Description

**SIEVO** is an integrated event management information system designed specifically for PT Matahati Insphira. The main goal of this system is to enhance the company's operational efficiency by optimizing event planning processes, team coordination, event reporting, and the digitization of real-time event progress.

This system addresses various challenges previously faced by PT Matahati Insphira, such as:
* **Difficulties in manual team coordination** (via WhatsApp and Excel) prone to miscommunication.
* **Lack of a real-time event progress monitoring system**.
* **Unstructured and scattered documentation**, leading to risks of data loss or inconsistency.
* **Slow and manual event report generation processes**.
* **Inefficient budget management**.
* **Absence of an integrated vendor and client database**.

**SIEVO** is designed for use by various roles within the company, including Executives, Internal Employees, and Freelancers.

## Table of Contents

* [Key Features](#key-features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [System Roles](#system-roles)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Project Team](#project-team)
* [Contact](#contact)

## Key Features

**SIEVO** comes with a variety of features that span the entire event management lifecycle:

1. **User Authentication:** Register, login, and logout with role-based access management.
2. **Event List Management:** View, add, update status, and delete events in a table view.
3. **Event Management:** Manage event details like name, date, location, budget, and PIC.
4. **Event Budget Planning:** Create, manage, and approve event budgets with automatic calculations.
5. **Event Implementation Management:** Track item fulfillment, upload documents, and record event progress.
6. **Event Task Management:** Manage event tasks, assign PICs, and track completion.
7. **Event Report Generation:** Generate customizable event reports and export them to .docx/.pdf.
8. **Dashboard:** A summary of events' status, progress, budget, and tasks (for Executives).
9. **Contact Management:** Manage client and vendor contacts in a centralized database.
10. **Proposal Management:** Track proposals' status from draft to final.
11. **User Management:** System Admins and Executives can manage user accounts.
12. **Inventory Management:** Manage inventory of items for events.
13. **Profile Management:** Users can update their personal profile details.
14. **Human Resource Management:** Assign and track staff (internal and freelance) tasks.

## Architecture

**SIEVO** uses the following architecture:

* **Physical Architecture:** Three-Tier Architecture approach:
    - **Presentation Layer:** Next.js frontend.
    - **Logic Layer:** Next.js API Routes for business logic.
    - **Data Layer:** Supabase (PostgreSQL) for data storage.
* **Programming Architecture:** Feature-based architecture with Next.js and TypeScript.

## Tech Stack

The core technologies are highlighted below:

* **Frontend:** Next.js, React, TypeScript, JavaScript, PostCSS
* **Components:** ShadCN, RadixUI
* **Icons:** Lucide-React, React Icons
* **Backend:** Next.js API Routes, TypeScript, Axios
* **Database & ORM:** Supabase (PostgreSQL), Prisma
* **Utility & State Management:** Zod, date-fns, React Hook Form
* **Development Tools:** npm, ESLint, JSON, Markdown
* **Caching & Session Management:** Upstash Redis
* **Deployment & Hosting:** Vercel
* **DevOps & CI/CD:** GitLab CI/CD
* **Supporting Tools:** Visual Studio Code, Postman, Figma, Draw.io, LucidChart, Jira, Discord

## System Roles

**SIEVO** is tailored for three main roles:

1. **Executive:** Full visibility of all events and data for strategic decision-making.
2. **Internal Employee:** Manages tasks, event updates, and logistics.
3. **Freelancer:** Access to task schedules and updates.

**Also there is Admin Role to control system*

## Installation

### Prerequisites:
- Node.js
- npm
- Git
- Supabase access and environment variables setup

### Setup Steps:

1. Clone the repository:
    ```bash
    git clone https://gitlab.cs.ui.ac.id/propensi-2024-2025-genap/kelas-b/b14-cracked.git
    cd b14-cracked
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Copy environment variables:
    ```bash
    cp .env.example .env
    ```

4. Run database migrations (if using Prisma Migrate):
    ```bash
    npx prisma migrate dev
    ```

5. Start the project in development mode:
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:3000`.

## Usage

After installation, you can use **SIEVO** via a web browser. Here's how:

1. **Login:** Enter your credentials to access features based on your role.
2. **Navigation:** Use the sidebar to access Event, Budget, Task, Contact, Inventory, etc.
3. **Event Management:** Create, update, and manage events.
4. **Report Generation:** Generate event reports after completion.
5. **Dashboard (for Executives):** View an overview of all event statuses.

For UI design and wireframes, visit the Figma link: [CRACKED! - UI Catalog](https://www.figma.com/design/6uMjBdpj5yQJA6FNsUjt2y/CRACKED!?node-id=0-1).

## Project Status

- **Sprint 1 (Mar 3 - Mar 26, 2025):** Focused on basic CRUD features for Events, Contacts, Inventory, Proposals, and Event Summary creation.
- **Sprint 2 (Apr 9 - May 8, 2025):** Implemented Authentication, Role-Based Access Control (RBAC), Dashboard, Profile Management, and User Management.
- **Sprint 3 (May 14 - May 28, 2025):** Added filtering features, search bars, and integration of the event planning process.
- **Launch:** June 2, 2025.

## Contributing

We welcome contributions to improve **SIEVO**! If you would like to contribute, here’s how:

1. **Fork the repository** on GitHub to your own account.
2. **Clone your fork** to your local machine:
    ```bash
    git clone https://gitlab.cs.ui.ac.id/propensi-2024-2025-genap/kelas-b/b14-cracked
    
    cd b14-cracked
    ```
3. **Create a branch** for your feature or bugfix:
    ```bash
    git checkout -b feature-branch
    ```
4. **Make your changes** in the codebase.
5. **Commit your changes** with meaningful commit messages:
    ```bash
    git commit -m "Your commit message"
    ```
6. **Push your changes** to your fork:
    ```bash
    git push origin feature-branch
    ```
7. **Create a pull request** to merge your changes into the `main` branch of the original repository.
8. **Follow the coding standards** outlined in our documentation to maintain consistency and code quality.
9. **Report any bugs** or suggest features by opening issues on the repository.

## License

This project is licensed under the [MIT License](LICENSE).

## Project Team

* **Project Manager:** Calista Sekar Pamaja
* **Scrum Master:** Edward Salim
* **Lead System Designer:** Aiza Derisyana
* **Lead System Analyst:** Roger Moreno
* **Lead Programmer:** Kelvin Saputra

## Contact

For inquiries or feedback, you can contact the following:

* **Project Manager:** Calista Sekar Pamaja (calista.sekar@ui.ac.id)
* **Project Sponsor (PT Matahati Insphira):** Deddy Budiman

---

Created by **Cracked Teams**.

```