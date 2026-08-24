# CampusSkillSwap 🎓🔄

> **A campus-based skill exchange platform that helps students learn from each other, share their skills, and build meaningful academic connections.**

## 📌 Overview

**CampusSkillSwap** is a student-focused skill-sharing platform designed to create a collaborative learning environment inside a college campus.

Many students want to learn new skills but may not have access to expensive courses or personal mentors. At the same time, other students already possess useful skills and are willing to teach them.

CampusSkillSwap connects these students through a **skill exchange model**:

**Learn a Skill → Share Your Skill → Connect → Exchange Knowledge**

---

## 🎯 Problem Statement

Students often face:

* Limited access to affordable learning resources
* Difficulty finding peers who can teach specific skills
* Lack of confidence in approaching other students
* Limited opportunities for peer-to-peer learning
* Difficulty discovering students with complementary skills
* Lack of a centralized campus platform for skill exchange

CampusSkillSwap addresses these problems by creating a dedicated digital ecosystem for **peer-to-peer skill sharing**.

---

## 💡 Solution

CampusSkillSwap allows students to:

* Create their own profile
* Add skills they can teach
* Add skills they want to learn
* Discover other students based on skills
* Search for specific skills
* Send skill exchange requests
* Accept or reject exchange requests
* Build connections with other students
* Receive notifications about exchange activities
* Access a personalized dashboard

---

## ✨ Key Features

### 🔐 Role-Based Authentication

Students can securely register and log in.

Authentication and authorization are implemented using **Firebase Authentication** and role-based access control.

### 👤 Student Profile

Each student can maintain information about:

* Name
* Email
* Skills
* Learning interests
* Profile information

### 🔎 Discover Skills

Students can discover other students based on the skills they offer.

Example:

> Student A wants to learn **Java**
> Student B can teach **Java**
> → CampusSkillSwap helps connect them.

### 🔍 Skill Search

Users can search for specific skills and find relevant students.

### 🔄 Skill Exchange

Students can initiate an exchange request and collaborate with other students.

Possible exchange states include:

`Pending → Accepted / Rejected`

### 🔔 Notifications

Users receive notifications for important activities such as:

* Exchange request received
* Exchange request accepted
* Exchange request rejected
* Other platform activities

Firebase Realtime Database is used to support real-time notification updates.

### 📊 Dashboard

The dashboard provides a quick overview of the student's activity, including:

* My Skills
* Exchanges
* Connections
* Rating
* Discover Skills
* Student information
* Notifications

### 📍 About / Campus Location

The About section provides information about the platform and campus location using an integrated map.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Student       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Frontend Layer    │
                    │    HTML/CSS/JS      │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌──────────────────┐
        │ Firebase Auth   │        │ Spring Boot API  │
        │ Authentication  │        │     Backend      │
        └─────────────────┘        └────────┬─────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │      MySQL      │
                                   │    Database     │
                                   └─────────────────┘

                              
                    ┌─────────────────────────┐
                    │ Firebase Realtime DB    │
                    │   Live Notifications    │
                    └─────────────────────────┘
```

---

## 🔄 Application Flow

```text
Register / Login
       ↓
Authentication
       ↓
Student Dashboard
       ↓
Add / Manage Skills
       ↓
Discover Skills
       ↓
Search Students / Skills
       ↓
Send Exchange Request
       ↓
Receiver Gets Notification
       ↓
Accept / Reject Request
       ↓
Exchange Status Updated
       ↓
Students Connect & Learn
```

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security

### Database

* MySQL

### Authentication & Real-Time Features

* Firebase Authentication
* Firebase Realtime Database

### Security

* JWT-based authentication
* BCrypt password hashing
* Role-based authorization
* Spring Security

### Development Tools

* VS Code
* IntelliJ IDEA / Spring Initializr
* MySQL Workbench
* Firebase Console
* Git & GitHub

---

## 📂 Project Structure

```text
CampusSkillSwap/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── about.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── dashboard.js
│       └── firebase-config.js
│
├── backend/
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── campusskillswap/
│                       ├── controller/
│                       ├── service/
│                       ├── repository/
│                       ├── entity/
│                       ├── security/
│                       └── config/
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

## 🔐 Security Architecture

CampusSkillSwap uses multiple security mechanisms:

```text
User Login
    ↓
Authentication
    ↓
JWT Token
    ↓
Authorization Filter
    ↓
Role Verification
    ↓
Protected API
```

Passwords are protected using **BCrypt hashing**, while JWT tokens are used to authenticate protected API requests.

---

## ⚡ Real-Time Notification Architecture

Firebase Realtime Database enables notification updates without requiring the user to manually refresh the page.

```text
Student A
   │
   │ Sends Exchange Request
   ▼
Spring Boot Backend
   │
   ▼
Notification Data
   │
   ▼
Firebase Realtime Database
   │
   │ onValue()
   ▼
Student B Dashboard
   │
   ▼
Real-Time Notification
```

This makes the notification system responsive and suitable for real-time user interactions.

---

## 🗄️ Core Data Model

A simplified database relationship can be represented as:

```text
User
 │
 ├── Skills
 │
 ├── Exchange Requests
 │
 ├── Connections
 │
 └── Notifications
```

Typical entities include:

* `User`
* `Skill`
* `Exchange`
* `Connection`
* `Notification`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/campus-skillswap.git
cd campus-skillswap
```

### 2. Configure MySQL

Create a database:

```sql
CREATE DATABASE campusskillswap;
```

Configure the database credentials in the Spring Boot application's configuration file.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campusskillswap
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 3. Configure Firebase

Create a Firebase project and configure:

* Firebase Authentication
* Firebase Realtime Database

Add the Firebase configuration to the frontend.

### 4. Start the Backend

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend can run on:

```text
http://localhost:8081
```

### 5. Run the Frontend

Open the frontend using a local development server such as **VS Code Live Server**.

---

## 🔌 Example API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Skills

```text
GET  /api/skills
GET  /api/skills/search?name=Java
POST /api/skills
```

### Exchange

```text
POST /api/exchanges
GET  /api/exchanges
PUT  /api/exchanges/{id}/accept
PUT  /api/exchanges/{id}/reject
```

> Exact endpoints may vary depending on the current backend implementation.

---

## 🌟 Future Enhancements

Potential future improvements include:

* AI-powered skill matching
* Recommendation system
* In-app real-time chat using WebSockets
* Video learning sessions
* Skill verification and badges
* Advanced student search filters
* Rating and review system
* Email/push notifications
* Admin dashboard
* Analytics and learning progress tracking
* Mobile application
* University-wide deployment

---

## 🌍 Impact

CampusSkillSwap aims to make learning:

**Accessible + Affordable + Collaborative + Campus-Centric**

Instead of depending only on paid courses or external mentors, students can use the knowledge already available within their own campus community.

---

## 🎤 Hackathon Pitch

### One-Line Pitch

> **"CampusSkillSwap turns a campus into a collaborative learning ecosystem where every student can be both a learner and a teacher."**

### Why CampusSkillSwap?

```text
Student knows a skill
        +
Another student wants that skill
        ↓
CampusSkillSwap
        ↓
Connection
        ↓
Skill Exchange
        ↓
Collaborative Learning
```

---

## 👩‍💻 Team / Developer

**CampusSkillSwap**
Developed as a student-focused technology project for collaborative campus learning and skill exchange.

---

## 📄 License

This project is developed for educational, academic, and hackathon purposes.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**CampusSkillSwap — Learn. Share. Connect. Grow. 🚀**
