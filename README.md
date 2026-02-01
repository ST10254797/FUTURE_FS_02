# 📊 Client Lead Management System (Mini CRM)

A comprehensive Client Relationship Management (CRM) system designed to manage client leads generated from website contact forms. This full-stack application enables businesses to efficiently track, manage, and convert leads through an intuitive admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v14+-green.svg)
![React](https://img.shields.io/badge/react-v18+-blue.svg)

## 🎯 Project Overview

This Mini CRM mirrors real-world lead management systems used by agencies, freelancers, and startups. Whenever someone fills out a contact form on a website, businesses need a systematic way to store, track, follow up, and convert those leads into clients. This application provides exactly that functionality.

## ✨ Features

### Core Features
- ✅ **Lead Listing** - View all leads with name, email, source, and current status
- ✅ **Status Management** - Update lead status through the pipeline (New → Contacted → Converted)
- ✅ **Notes & Follow-ups** - Add detailed notes and schedule follow-up actions for each lead
- ✅ **Secure Admin Access** - Protected admin panel with authentication

### Bonus Features
- 🔍 **Search & Filter** - Quickly find leads using search and filter functionality
- ⏰ **Timestamp Tracking** - Automatic tracking of creation and update timestamps
- 📈 **Simple Analytics** - View total leads, conversion rates, and status breakdown

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework for building interactive interfaces
- **HTML5/CSS3** - Semantic markup and responsive styling
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for building RESTful APIs
- **RESTful API** - CRUD operations for lead management

### Database
- **MongoDB** / **MySQL** - Persistent data storage for leads, statuses, and notes

### Development Tools
- **VS Code** - Code editor
- **GitHub** - Version control and code hosting
- **npm** - Package management

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (if using MongoDB) - [Download](https://www.mongodb.com/try/download/community)
  - OR **MySQL** (if using MySQL) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/client-lead-crm.git
cd client-lead-crm
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables in .env
# Example:
# PORT=5000
# DATABASE_URL=mongodb://localhost:27017/crm
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development

# Start the backend server
npm start
```

The backend server will run on `http://localhost:5000` (or your configured port)

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure API endpoint
# Example:
# REACT_APP_API_URL=http://localhost:5000/api

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Database Setup

#### For MongoDB:
```bash
# Make sure MongoDB is running
# Create a database named 'crm' (or as configured in your .env)
# The application will automatically create collections
```

#### For MySQL:
```bash
# Create a database
CREATE DATABASE crm;

# Run migrations (if using migration files)
npm run migrate

# Or import the schema.sql file
mysql -u username -p crm < database/schema.sql
```

## 📁 Project Structure

```
client-lead-crm/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── leadController.js  # Lead management logic
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Lead.js            # Lead model
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── leadRoutes.js      # Lead management routes
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server setup
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js   # Main dashboard
│   │   │   ├── LeadList.js    # Lead listing component
│   │   │   ├── LeadForm.js    # Add/Edit lead form
│   │   │   ├── LeadDetail.js  # Individual lead view
│   │   │   ├── Login.js       # Login component
│   │   │   └── Analytics.js   # Analytics dashboard
│   │   ├── services/
│   │   │   └── api.js         # API service functions
│   │   ├── utils/
│   │   │   └── helpers.js     # Utility functions
│   │   ├── App.js             # Main App component
│   │   ├── App.css            # Global styles
│   │   └── index.js           # Entry point
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new admin user |
| POST | `/api/auth/login` | Login admin user |
| GET | `/api/auth/user` | Get current user (protected) |

### Lead Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads (protected) |
| GET | `/api/leads/:id` | Get single lead by ID (protected) |
| POST | `/api/leads` | Create new lead (public/protected) |
| PUT | `/api/leads/:id` | Update lead details (protected) |
| PATCH | `/api/leads/:id/status` | Update lead status (protected) |
| POST | `/api/leads/:id/notes` | Add note to lead (protected) |
| DELETE | `/api/leads/:id` | Delete lead (protected) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get lead statistics (protected) |

## 💾 Database Schema

### Lead Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String,
  source: String (e.g., "Website Form", "Referral"),
  status: String (enum: ["new", "contacted", "converted", "lost"]),
  notes: [
    {
      content: String,
      createdAt: Date,
      createdBy: ObjectId (ref: User)
    }
  ],
  followUpDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["admin", "user"]),
  createdAt: Date
}
```

## 🎨 Usage Guide

### Admin Login
1. Navigate to `http://localhost:3000/login`
2. Enter your admin credentials
3. Click "Login" to access the dashboard

### Managing Leads

#### View All Leads
- Access the dashboard after login
- View all leads in a table format with sortable columns
- Use search bar to find specific leads
- Filter by status using dropdown

#### Add New Lead
1. Click "Add New Lead" button
2. Fill in the form (Name, Email, Phone, Source)
3. Click "Save Lead"

#### Update Lead Status
1. Click on a lead to view details
2. Select new status from dropdown (New/Contacted/Converted/Lost)
3. Status updates automatically

#### Add Notes & Follow-ups
1. Open lead details
2. Scroll to "Notes" section
3. Add your note in the text area
4. Optionally set a follow-up date
5. Click "Add Note"

#### Analytics Dashboard
- View total leads count
- See conversion rate percentage
- Monitor status distribution (pie chart)
- Track lead sources

## 🔒 Security Features

- **Password Hashing** - Bcrypt encryption for user passwords
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Middleware to protect admin endpoints
- **Input Validation** - Server-side validation for all inputs
- **CORS Configuration** - Controlled cross-origin requests
- **Environment Variables** - Sensitive data stored in .env files

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run end-to-end tests
npm run test:e2e
```

## 🚢 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-crm-backend

# Set environment variables
heroku config:set DATABASE_URL=your_database_url
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel/Netlify)
```bash
# Build production version
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Database Deployment
- **MongoDB Atlas** - Cloud-hosted MongoDB
- **AWS RDS** - Cloud-hosted MySQL
- **Railway** - Quick deployment for both databases

## 📚 Learning Outcomes

By completing this project, you've gained experience in:

- ✅ **CRUD Operations** - Create, Read, Update, Delete functionality
- ✅ **RESTful API Design** - Building scalable backend APIs
- ✅ **Database Management** - Schema design and data relationships
- ✅ **Authentication & Authorization** - Secure user access control
- ✅ **Frontend-Backend Integration** - Connecting React with Express
- ✅ **State Management** - Managing application state in React
- ✅ **Business Workflows** - Implementing real-world business logic
- ✅ **Full-Stack Development** - End-to-end application development

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Thanks to the open-source community for amazing tools
- React.js documentation and community
- Express.js and Node.js communities
- MongoDB/MySQL documentation

## 📞 Support

If you have any questions or need help, please:
- Open an issue in the GitHub repository
- Contact me via email
- Check the documentation in the `/docs` folder

## 🔮 Future Enhancements

- [ ] Email notifications for follow-ups
- [ ] Advanced analytics and reporting
- [ ] Export leads to CSV/Excel
- [ ] Bulk operations (import/export)
- [ ] Activity timeline for each lead
- [ ] Multi-user support with role-based access
- [ ] Integration with email marketing tools
- [ ] Mobile responsive design improvements
- [ ] Dark mode theme
- [ ] Real-time updates using WebSockets

---

**Built with ❤️ using the MERN/MEAN Stack**

*Last Updated: February 2026*
