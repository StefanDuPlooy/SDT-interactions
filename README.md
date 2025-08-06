# Student Digital Twin - Interaction Data Simulator

A comprehensive simulation system that generates realistic student interaction data for academic performance prediction and social network analysis in educational environments.

## 🎯 Project Overview

This simulator replicates depth camera-based social interaction tracking systems to provide consistent training data for Student Digital Twin (SDT) models. It generates realistic student interaction patterns, social network metrics, and engagement analytics for academic failure prediction.

## ✨ Features

- **Real-time Simulation Engine**: Generate classroom interaction sessions with configurable parameters
- **Social Network Analysis**: Calculate centrality measures, clustering coefficients, and community detection
- **Student Risk Assessment**: Identify at-risk students through engagement metrics
- **SDT Integration APIs**: Export data in formats compatible with digital twin systems
- **Interactive Dashboard**: Monitor simulations and analyze results in real-time
- **WebSocket Support**: Live updates for simulation progress and alerts

## 🏗️ Architecture

```
student-interaction-simulator/
├── backend/                    # Node.js + Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── models/            # Mongoose schemas
│   │   ├── services/          # Simulation engine & business logic
│   │   ├── controllers/       # API endpoint handlers
│   │   ├── routes/            # Express route definitions
│   │   ├── database/          # MongoDB connection management
│   │   └── scripts/           # Database seeding utilities
│   └── tests/                 # Unit & integration tests
├── frontend/                  # React + TypeScript + Material-UI
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API client services
│   │   └── types/             # TypeScript definitions
└── shared/                    # Shared type definitions
    └── types.ts               # Common interfaces
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6.0+ (local installation)
- Git

### MongoDB Setup

1. **Install MongoDB locally:**
   - **Windows**: Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [official installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB service:**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Manual start (all platforms)
   mongod --dbpath /path/to/your/data/directory
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url> student-interaction-simulator
   cd student-interaction-simulator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # The default .env file is already configured for local MongoDB
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm start
   ```

4. **Seed Database** (recommended)
   ```bash
   cd backend
   npm run db:seed
   ```

### Configuration

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/student_interactions
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

## 📊 Data Models

### Core Entities

- **Student**: Profile with academic info, personality type, and risk level
- **Class Session**: Simulation session with metadata and network metrics
- **Interaction Event**: Individual student-to-student interaction record
- **Engagement Metrics**: Derived analytics for SDT integration

### Example Simulation Request

```typescript
POST /api/simulate/session
{
  "courseId": "CS101",
  "sessionType": "group-work",
  "duration": 90,
  "studentIds": ["STU_001", "STU_002", "STU_003", ...]
}
```

## 🔌 API Endpoints

### Simulation APIs
- `POST /api/simulate/session` - Generate new simulation session
- `GET /api/sessions/{id}` - Retrieve session results
- `GET /api/students/{id}/engagement/{sessionId}` - Get student metrics

### SDT Integration APIs
- `GET /api/sdt/student/{id}/risk-assessment` - Current risk analysis
- `GET /api/sdt/class/{courseId}/risk-batch` - Bulk risk assessment
- `GET /api/sdt/engagement-batch` - Historical engagement data
- `GET /api/sdt/training-data` - ML training dataset export

### WebSocket Events
- `ws://localhost:3001` - Real-time simulation updates and risk alerts

## 🎮 Usage Examples

### Running a Simulation

1. Navigate to the **Simulation** tab in the dashboard
2. Configure session parameters:
   - Course ID (e.g., "CS101")
   - Session type (lecture/tutorial/lab/group-work)
   - Duration in minutes
   - Number of students
3. Click "Start Simulation"
4. View real-time results and network metrics

### Monitoring Students

1. Go to the **Students** tab
2. View risk levels and engagement scores
3. Monitor trends (increasing/decreasing/stable)
4. Identify students requiring intervention

### Network Analysis

1. Open the **Network** tab
2. Analyze social network metrics:
   - Network density and clustering
   - Most connected students (centrality)
   - Detected communities/groups

## 🧪 Simulation Algorithm

The engine uses personality-based interaction probability models:

```typescript
// Base probability adjusted by factors:
- Personality types (extrovert: 1.5x, introvert: 0.7x)
- Academic similarity (GPA difference < 0.5: +20%)
- Session context (group-work: 1.2x, lecture: 0.3x)
- Risk factors (high-risk students: context-dependent)
```

### Network Generation
- Small-world topology with realistic clustering
- Temporal patterns based on session type
- Help-seeking behavior from at-risk students
- Community formation based on seating and friendships

## 🔧 Development

### Available Scripts

**Backend**
```bash
npm run dev       # Start development server
npm run build     # Compile TypeScript
npm run test      # Run tests
npm run db:seed   # Seed database with sample data
```

**Frontend**
```bash
npm start         # Start React development server
npm run build     # Build for production
npm test          # Run tests
```

### MongoDB Database

The application connects to a local MongoDB instance:
- **Database**: `student_interactions`
- **Connection**: `mongodb://localhost:27017/student_interactions`
- **Collections**: `students`, `sessions`, `interactions`, `engagement_metrics`

### Docker Alternative

If you prefer using Docker for MongoDB:

```bash
# Start only MongoDB in Docker
docker run -d -p 27017:27017 --name sdt-mongodb mongo:6.0

# Or use the full docker-compose setup
docker-compose up
```

## 🚢 Deployment

### Production Considerations

- Ensure MongoDB is properly secured with authentication
- Use environment variables for sensitive configuration
- Set up reverse proxy (Nginx) for production
- Configure SSL/TLS certificates
- Enable MongoDB authentication in production
- Set secure JWT secrets

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built for educational technology and student success analytics**