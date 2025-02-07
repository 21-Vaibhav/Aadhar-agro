# Aadhar Agro 🌾

A modern e-commerce platform for agricultural products built with React and Firebase.

## 🚀 Features

- 🔐 User Authentication
- 🛒 Shopping Cart
- 📦 Product Management
- 🔍 Product Search
- 📱 Responsive Design
- 🛍️ Order Management
- 👤 User Profiles

## 🛠️ Tech Stack

- **Frontend:**
  - React.js
  - Material-UI (MUI)
  - React Router
  - Context API for state management

- **Backend:**
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Storage
  - Firebase Security Rules

## 🏗️ Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React Context providers
│   ├── firebase.js    # Firebase configuration
│   └── App.js         # Main application component
├── .env.example       # Example environment variables
└── firebase.json      # Firebase configuration
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/21-Vaibhav/Aadhar-agro.git
   cd aadhar_agro_fresh
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration values in the `.env` file.

4. **Start the development server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

## 🔒 Security

- Environment variables are used for sensitive data
- Firebase Security Rules protect the database and storage
- Authentication required for sensitive operations
- Input validation and sanitization implemented

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Vaibhav G ([@21-Vaibhav](https://github.com/21-Vaibhav))

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for the backend infrastructure
- [Material-UI](https://mui.com/) for the UI components
- [React](https://reactjs.org/) for the frontend framework
