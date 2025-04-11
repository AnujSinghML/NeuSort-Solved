# 🧠 NeuSort

NeuSort is a full-stack task and project management system that streamlines how individuals or teams manage their work. With powerful task tracking and analytics features, NeuSort helps users stay productive and make data-informed decisions.

---

## 🚀 Features

- 🗂️ Project and Task Management
- 👤 User Authentication
- 💬 Comment System for Tasks
- 📊 Task Analytics Dashboard
- 🔐 Secure API with JWT Authentication
- ⚛️ Frontend built with React and Context API
- 🔄 RESTful API integration with Axios

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Context API
- Axios
- Custom Hooks

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT for Auth

---

## 📁 Folder Structure

```
NeuSort/
├── server/
│   ├── config/            # DB configuration
│   ├── controllers/       # Logic for analytics, auth, etc.
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose schemas (User, Task, Comment)
│   └── ...
├── src/
│   ├── api/               # Axios API handlers
│   ├── components/        # Reusable React components
│   ├── contexts/          # Context providers
│   ├── hooks/             # Custom React hooks
│   └── ...
```

---

## 🧩 Installation & Setup

```bash
# Clone the repository
https://github.com/AnujSinghML/NeuSort-Solved.git

# Navigate into the project directory
cd Neusort

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../src
npm install
```

---

## 🧪 Running the App

### Start Backend
```bash
cd server
npm start
```

### Start Frontend
```bash
cd src
npm start
```

> The backend will typically run on `http://localhost:5000`, and the frontend on `http://localhost:3000`

---

## 📊 Analytics
- Visualizes completed tasks, pending tasks, and trends over time.
- Context-based state sharing for lightweight data management.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

---

## 👨‍💻 Author

**Anuj Singh**  
GitHub: https://github.com/AnujSinghML
> 🛠 Originally developed by **Neusort**, this version includes important bug fixes and refinements made by me.
---

Feel free to star ⭐ the repo if you found it useful!

