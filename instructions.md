# Student Digital Twin - Interaction Data Simulator

## Project Plan for Social Interaction Data Integration

### Executive Summary

This project creates a simulation layer that generates realistic student interaction data outputs compatible with a Student Digital Twin (SDT) system. The simulator replicates the data structures and patterns from the depth camera-based social interaction tracking system to provide consistent input for academic performance prediction models.

## 1. System Overview

### Purpose

Generate simulated student interaction data to:

- Train SDT models for academic failure prediction
- Test SDT algorithms without requiring physical classroom deployment
- Provide consistent data format for integration with broader SDT ecosystem

### Core Data Sources Simulated

Based on the original research system using Intel RealSense D455 depth cameras:

- **Proximity-based interactions** (distance < 1.5m, orientation < 45°, duration > 3s)
- **Social network metrics** (centrality, clustering, connectivity)
- **Temporal interaction patterns** (engagement over time)
- **Individual engagement scores** derived from interaction frequency

## 2. Architecture Overview

### Technology Stack

**Backend:** Node.js + Express + TypeScript + MongoDB
**Frontend:** React + TypeScript + D3.js + Material-UI
**Data Processing:** JavaScript/TypeScript for social network analysis (Python integration optional for advanced features)

### System Components

```
student-interaction-simulator/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── models/            # Data models & schemas
│   │   ├── services/          # Core simulation logic
│   │   ├── controllers/       # API endpoints
│   │   ├── utils/             # Helper functions
│   │   └── database/          # MongoDB connection
│   └── tests/                 # Unit & integration tests
├── frontend/                  # React dashboard
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API clients
│   │   ├── utils/             # Visualization helpers
│   │   └── types/             # TypeScript definitions
└── shared/                    # Shared type definitions
```

## 3. Data Models & Formats

### Core Data Structures

#### Student Profile

```typescript
interface Student {
  id: string;
  name: string;
  academicLevel: "undergraduate" | "postgraduate";
  major: string;
  currentGPA: number;
  riskLevel: "low" | "medium" | "high";
  personalityType: "extrovert" | "introvert" | "ambivert";
  participationScore: number; // 0-100
}
```

#### Interaction Event

```typescript
interface InteractionEvent {
  id: string;
  sessionId: string;
  studentId1: string;
  studentId2: string;
  startTime: Date;
  endTime: Date;
  duration: number; // seconds
  avgDistance: number; // meters
  avgOrientationDiff: number; // degrees
  confidence: number; // 0-1
  interactionType: "discussion" | "collaboration" | "social" | "help-seeking";
  context: "lecture" | "group-work" | "break" | "lab";
}
```

#### Session Data

```typescript
interface ClassSession {
  id: string;
  courseId: string;
  date: Date;
  duration: number; // minutes
  sessionType: "lecture" | "tutorial" | "lab" | "group-work";
  students: Student[];
  interactions: InteractionEvent[];
  networkMetrics: NetworkMetrics;
}
```

#### Network Metrics

```typescript
interface NetworkMetrics {
  timestamp: Date;
  totalStudents: number;
  totalInteractions: number;
  networkDensity: number;
  avgClusteringCoeff: number;
  numComponents: number;
  centralityScores: {
    [studentId: string]: {
      degree: number;
      betweenness: number;
      closeness: number;
      eigenvector: number;
    };
  };
}
```

#### SDT Integration Output

```typescript
interface StudentEngagementMetrics {
  studentId: string;
  sessionId: string;
  timestamp: Date;

  // Social engagement indicators
  interactionFrequency: number; // interactions per hour
  averageInteractionDuration: number; // seconds
  socialNetworkPosition: number; // centrality score 0-1

  // Behavioral patterns
  initiatesInteractions: boolean;
  respondsToInteractions: boolean;
  isolationRisk: number; // 0-1 scale

  // Predictive features for SDT
  collaborationScore: number; // 0-100
  helpSeekingBehavior: number; // 0-100
  peerInfluenceLevel: number; // 0-100

  // Academic correlation signals
  engagementTrend: "increasing" | "decreasing" | "stable";
  participationGap: number; // deviation from class average

  // Risk indicators
  academicRiskFlags: string[];
  socialRiskFlags: string[];
  overallRiskScore: number; // 0-100
}
```

## 4. Simulation Algorithm

### Core Simulation Logic

#### Student Behavior Modeling

```python
# Personality-based interaction probability
def calculate_interaction_probability(student1, student2, context):
    base_prob = 0.1  # 10% base chance

    # Personality factors
    if student1.personalityType == 'extrovert':
        base_prob *= 1.5
    if student2.personalityType == 'extrovert':
        base_prob *= 1.5
    if student1.personalityType == 'introvert' and student2.personalityType == 'introvert':
        base_prob *= 0.5

    # Academic factors
    gpa_diff = abs(student1.currentGPA - student2.currentGPA)
    if gpa_diff < 0.5:  # similar academic performance
        base_prob *= 1.2

    # Risk factors
    if student1.riskLevel == 'high' or student2.riskLevel == 'high':
        if context == 'group-work':
            base_prob *= 1.3  # help-seeking behavior
        else:
            base_prob *= 0.8  # potential isolation

    return min(base_prob, 0.7)  # cap at 70%
```

#### Temporal Pattern Generation

```python
def generate_interaction_timeline(session_duration, students, context):
    interactions = []

    # Activity-based interaction peaks
    activity_peaks = {
        'lecture': [0.1, 0.5, 0.9],  # beginning, middle break, end
        'group-work': [0.2, 0.4, 0.6, 0.8],  # multiple collaboration periods
        'lab': [0.3, 0.7],  # help-seeking periods
        'tutorial': [0.2, 0.6]  # question/discussion periods
    }

    for peak_time in activity_peaks.get(context, [0.5]):
        peak_minute = int(session_duration * peak_time)
        # Generate interactions around peak times
        generate_peak_interactions(students, peak_minute, interactions)

    return interactions
```

### Realistic Data Generation

#### Network Topology Simulation

- **Small-world networks:** Most students interact with neighbors, few bridge different groups
- **Scale-free characteristics:** Some students are highly connected hubs
- **Community detection:** Natural clustering by seating, friendships, academic performance
- **Temporal evolution:** Network changes across sessions, semester progression

#### JavaScript/TypeScript Network Analysis

For simulation purposes, basic network metrics can be calculated efficiently in JavaScript:

```typescript
// Network metrics calculation in TypeScript
interface NetworkMetrics {
  density: number;
  avgClustering: number;
  numComponents: number;
  centralityScores: Record<
    string,
    {
      degree: number;
      betweenness: number;
      closeness: number;
    }
  >;
}

const calculateNetworkMetrics = (
  interactions: InteractionEvent[]
): NetworkMetrics => {
  // Build adjacency list
  const graph: Record<string, Set<string>> = {};
  const students = new Set<string>();

  interactions.forEach((interaction) => {
    const { studentId1, studentId2 } = interaction;
    students.add(studentId1);
    students.add(studentId2);

    if (!graph[studentId1]) graph[studentId1] = new Set();
    if (!graph[studentId2]) graph[studentId2] = new Set();

    graph[studentId1].add(studentId2);
    graph[studentId2].add(studentId1);
  });

  // Calculate degree centrality
  const centralityScores: Record<string, any> = {};
  const totalStudents = students.size;

  students.forEach((student) => {
    const degree = graph[student]?.size || 0;
    centralityScores[student] = {
      degree: totalStudents > 1 ? degree / (totalStudents - 1) : 0,
      betweenness: 0, // Can implement full algorithm if needed
      closeness: 0, // Can implement full algorithm if needed
    };
  });

  // Calculate network density
  const maxEdges = (totalStudents * (totalStudents - 1)) / 2;
  const actualEdges = interactions.length;
  const density = maxEdges > 0 ? actualEdges / maxEdges : 0;

  return {
    density,
    avgClustering: 0, // Can implement if needed
    numComponents: 1, // Can implement connected components if needed
    centralityScores,
  };
};
```

#### Optional Python Integration

For advanced network analysis features, Python/NetworkX can be added later:

- **Complex centrality measures** (PageRank, eigenvector centrality)
- **Community detection algorithms** (Louvain, modularity optimization)
- **Advanced graph algorithms** (shortest paths, clustering coefficients)
- **Scientific network visualization** (force-directed layouts, network statistics)

#### Interaction Quality Simulation

- **Duration patterns:** Brief acknowledgments (5-15s) vs deep discussions (2-5min)
- **Context sensitivity:** Different interaction patterns for lectures vs group work
- **Academic correlation:** High-performing students often form study groups
- **Help-seeking patterns:** Struggling students seek help from high performers

## 5. Backend Implementation

### API Endpoints

#### Core Simulation APIs

```typescript
// Generate new session data
POST /api/simulate/session
Body: {
  courseId: string;
  sessionType: string;
  duration: number;
  studentIds: string[];
}

// Get session results
GET /api/sessions/{sessionId}

// Get student engagement metrics
GET /api/students/{studentId}/engagement/{sessionId}

// Bulk data for SDT integration
GET /api/sdt/engagement-batch?startDate={date}&endDate={date}

// Real-time simulation stream
WebSocket: /ws/simulation/live
```

#### Configuration APIs

```typescript
// Manage student profiles
GET/POST/PUT/DELETE /api/students

// Simulation parameters
GET/PUT /api/simulation/config

// Historical data export
GET /api/export/interactions?format=csv|json&dateRange={range}
```

### Core Services

#### SimulationEngine Service

```typescript
class SimulationEngine {
  async generateSession(params: SessionParams): Promise<ClassSession> {
    // 1. Initialize student positions and states
    // 2. Run temporal simulation loop
    // 3. Generate interaction events
    // 4. Calculate network metrics using JavaScript
    // 5. Compute individual engagement scores
    // 6. Generate SDT-compatible output
  }

  async calculateNetworkMetrics(
    interactions: InteractionEvent[]
  ): Promise<NetworkMetrics> {
    // Use JavaScript network analysis functions
    return calculateNetworkMetrics(interactions);
  }

  async generateEngagementMetrics(
    student: Student,
    session: ClassSession
  ): Promise<StudentEngagementMetrics> {
    // Social network position analysis
    // Behavioral pattern recognition
    // Risk factor assessment
    // Academic correlation signals
  }
}
```

### Database Schema (MongoDB)

#### Collections Structure

```javascript
// students collection
{
  _id: ObjectId,
  id: String,
  name: String,
  academicLevel: String,
  major: String,
  currentGPA: Number,
  riskLevel: String,
  personalityType: String,
  participationScore: Number,
  createdAt: Date,
  updatedAt: Date
}

// sessions collection
{
  _id: ObjectId,
  id: String,
  courseId: String,
  date: Date,
  duration: Number,
  sessionType: String,
  students: [String], // student IDs
  networkMetrics: Object,
  simulationParams: Object,
  createdAt: Date
}

// interactions collection (for large datasets)
{
  _id: ObjectId,
  sessionId: String,
  studentId1: String,
  studentId2: String,
  startTime: Date,
  endTime: Date,
  duration: Number,
  avgDistance: Number,
  avgOrientationDiff: Number,
  confidence: Number,
  interactionType: String,
  context: String,
  indexed: true // for fast queries
}

// engagement_metrics collection
{
  _id: ObjectId,
  studentId: String,
  sessionId: String,
  timestamp: Date,
  metrics: {
    interactionFrequency: Number,
    averageInteractionDuration: Number,
    socialNetworkPosition: Number,
    collaborationScore: Number,
    helpSeekingBehavior: Number,
    peerInfluenceLevel: Number,
    overallRiskScore: Number
  },
  riskFlags: [String],
  engagementTrend: String
}
```

## 6. Frontend Implementation

### Main Dashboard Components

#### Real-time Visualization

```typescript
// InteractionGraph.tsx - Live social network visualization
const InteractionGraph: React.FC = () => {
  const [networkData, setNetworkData] = useState<NetworkData>();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // D3.js force-directed graph
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // Implement real-time network visualization
    // Update node positions, edge weights
    // Highlight interaction events as they occur
  }, [networkData]);

  return (
    <div className="interaction-graph">
      <svg ref={svgRef} width="800" height="600" />
      <StudentDetails student={selectedNode} />
      <NetworkStats metrics={networkData?.metrics} />
    </div>
  );
};
```

#### Student Monitoring Panel

```typescript
// StudentMonitor.tsx - Individual student tracking
const StudentMonitor: React.FC = () => {
  return (
    <div className="student-monitor">
      <StudentList />
      <EngagementTimeline />
      <RiskAlerts />
      <InteractionDetails />
    </div>
  );
};
```

#### Simulation Controls

```typescript
// SimulationControl.tsx - Configuration and execution
const SimulationControl: React.FC = () => {
  return (
    <div className="simulation-control">
      <SessionBuilder />
      <ParameterTuning />
      <BatchSimulation />
      <ExportTools />
    </div>
  );
};
```

### Data Visualization Features

#### Network Analysis Views

- **Force-directed graph:** Real-time social network
- **Adjacency matrix:** Interaction strength heatmap
- **Timeline view:** Temporal interaction patterns
- **Community detection:** Student group identification

#### Individual Analytics

- **Engagement radar charts:** Multi-dimensional student profiles
- **Risk trend lines:** Academic failure probability over time
- **Participation metrics:** Comparison with class averages
- **Behavioral heatmaps:** Activity patterns across sessions

#### Comparative Analysis

- **Class performance correlation:** Social vs academic metrics
- **Cohort comparisons:** Different classes/semesters
- **Intervention effectiveness:** Before/after analysis
- **Predictive accuracy:** Model validation visualizations

## 7. SDT Integration Layer

### Data Export Formats

#### Real-time Stream (WebSocket)

```json
{
  "type": "engagement_update",
  "timestamp": "2025-08-06T10:30:00Z",
  "data": {
    "studentId": "STU_001",
    "sessionId": "SES_20250806_001",
    "metrics": {
      "interactionFrequency": 4.2,
      "socialNetworkPosition": 0.75,
      "overallRiskScore": 23
    },
    "flags": ["decreased_participation"],
    "trend": "decreasing"
  }
}
```

#### Batch Export (REST API)

```json
{
  "exportId": "EXP_20250806_001",
  "dateRange": {
    "start": "2025-08-01T00:00:00Z",
    "end": "2025-08-06T23:59:59Z"
  },
  "students": [
    {
      "studentId": "STU_001",
      "sessions": [
        {
          "sessionId": "SES_20250806_001",
          "engagementMetrics": {...},
          "riskScores": {...}
        }
      ],
      "aggregatedMetrics": {
        "weeklyTrend": "stable",
        "averageEngagement": 67,
        "riskLevel": "medium"
      }
    }
  ]
}
```

### Integration API Specification

#### Authentication & Authorization

```typescript
// JWT-based API authentication
POST /api/auth/login
Headers: { "Content-Type": "application/json" }
Body: { "apiKey": "SDT_KEY_xxx", "scope": "read_engagement" }
Response: { "token": "jwt_token", "expiresIn": 3600 }

// All SDT endpoints require Bearer token
GET /api/sdt/*
Headers: { "Authorization": "Bearer jwt_token" }
```

#### Core SDT Endpoints

```typescript
// Get current risk assessment for student
GET /api/sdt/student/{id}/risk-assessment
Response: {
  studentId: string;
  currentRiskLevel: number; // 0-100
  riskFactors: string[];
  engagementTrend: string;
  recommendations: string[];
  lastUpdated: Date;
}

// Bulk risk assessment for class
GET /api/sdt/class/{courseId}/risk-batch
Response: {
  courseId: string;
  totalStudents: number;
  riskDistribution: { low: number; medium: number; high: number; };
  students: StudentRiskAssessment[];
  classAverages: EngagementMetrics;
}

// Historical data for model training
GET /api/sdt/training-data?start={date}&end={date}&format={csv|json}
Response: Training dataset with features and outcomes
```

## 8. Implementation Timeline

### Phase 1: Core Backend (Weeks 1-2)

- **Week 1:** Database setup, basic data models, core simulation engine
- **Week 2:** API endpoints, WebSocket implementation, Python NetworkX integration

### Phase 2: Frontend Dashboard (Weeks 3-4)

- **Week 3:** React app setup, basic visualization components
- **Week 4:** Real-time updates, advanced charts, simulation controls

### Phase 3: SDT Integration (Week 5)

- **Week 5:** Integration APIs, data export formats, authentication system

### Phase 4: Testing & Validation (Week 6)

- **Week 6:** Unit tests, integration tests, data validation, performance optimization

## 9. Development Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB 6.0+ (or MongoDB Atlas)
- Git
- TypeScript knowledge
- Optional: Python 3.9+ (for advanced network analysis features)

### Quick Start

```bash
# Clone repository
git clone <repo-url> student-interaction-simulator
cd student-interaction-simulator

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure database connection
npm run dev

# Frontend setup
cd ../frontend
npm install
cp .env.example .env  # Configure API endpoints
npm start

# Optional: Python dependencies (only if advanced network analysis needed)
# cd ../backend
# mkdir python && cd python
# python -m venv venv
# source venv/bin/activate  # or venv\Scripts\activate on Windows
# pip install networkx numpy pandas matplotlib

# Database initialization
npm run db:seed  # Load sample data
```

### Configuration Files

```bash
# backend/.env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/student_interactions
JWT_SECRET=your_jwt_secret_here
# PYTHON_PATH=/path/to/python  # Add if using Python integration

# frontend/.env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001/ws
```

## 10. Testing Strategy

### Unit Tests

- **Data Models:** Validate schema constraints and relationships
- **Simulation Logic:** Test interaction probability calculations
- **Network Analysis:** Verify centrality and clustering calculations
- **API Endpoints:** Test request/response handling

### Integration Tests

- **Database Operations:** CRUD operations on all collections
- **WebSocket Communication:** Real-time data streaming
- **JavaScript Network Analysis:** Verify centrality and clustering calculations
- **SDT API Compatibility:** Validate integration contract
- **Optional Python Integration:** NetworkX calculations (if implemented)

### Performance Tests

- **Load Testing:** Handle 1000+ concurrent users
- **Data Volume:** Process sessions with 100+ students
- **Real-time Performance:** WebSocket latency < 100ms
- **Database Queries:** Response time < 50ms for common queries

### Validation Tests

- **Data Accuracy:** Compare simulated vs real-world patterns
- **Model Validation:** Verify academic risk prediction accuracy
- **Edge Cases:** Handle missing data, network failures
- **Security Testing:** Authentication, authorization, data privacy

## 11. Deployment & DevOps

### Docker Configuration

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]

# Frontend Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Production Deployment

```yaml
# docker-compose.yml
version: "3.8"
services:
  mongodb:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/student_interactions?authSource=admin
    depends_on:
      - mongodb
    ports:
      - "3001:3001"

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Monitoring & Logging

- **Application Monitoring:** PM2 for Node.js process management
- **Database Monitoring:** MongoDB Atlas monitoring or self-hosted tools
- **Log Aggregation:** Winston for structured logging
- **Performance Monitoring:** New Relic or similar APM tools
- **Error Tracking:** Sentry for error monitoring and alerts

## 12. Usage Examples

### Generating a Simulation

```typescript
// Create a new classroom session
const session = await simulationService.generateSession({
  courseId: 'CS101',
  sessionType: 'group-work',
  duration: 90, // minutes
  studentIds: ['STU_001', 'STU_002', 'STU_003', ...],
  parameters: {
    interactionProbability: 0.3,
    extrovertBonus: 1.5,
    academicCorrelation: 0.7
  }
});

// Get engagement metrics for SDT
const engagementData = await sdtService.getEngagementMetrics(
  'STU_001',
  session.id
);

// Subscribe to real-time updates
const ws = new WebSocket('ws://localhost:3001/ws/simulation/live');
ws.on('message', (data) => {
  const update = JSON.parse(data);
  if (update.type === 'engagement_update') {
    updateStudentRiskScore(update.data);
  }
});


```

### Integrating with SDT System

```typescript
// SDT Client Integration Example
class SDTIntegrationClient {
  async fetchStudentRiskData(studentId: string): Promise<RiskAssessment> {
    const response = await fetch(
      `/api/sdt/student/${studentId}/risk-assessment`,
      {
        headers: { Authorization: `Bearer ${this.authToken}` },
      }
    );
    return response.json();
  }

  async subscribeToRiskUpdates(callback: (data: RiskUpdate) => void) {
    const ws = new WebSocket("/ws/sdt/risk-updates");
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      callback(update);
    };
  }
}
```

This comprehensive project plan provides everything needed to build the student interaction simulation system that integrates with your Student Digital Twin. The system generates realistic social interaction data using JavaScript/TypeScript for core functionality, with optional Python integration for advanced network analysis features when needed.
