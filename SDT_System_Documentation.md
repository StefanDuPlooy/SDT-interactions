# Student Digital Twin (SDT) Interaction Data Simulator - System Documentation

## Overview

The Student Digital Twin (SDT) Interaction Data Simulator is a comprehensive web-based application designed to simulate and analyze student interactions in educational environments. The system generates realistic interaction data that can be used to create digital twins of students, helping educators understand social dynamics, identify at-risk students, and optimize learning environments.

## System Architecture

The application consists of:
- **Frontend**: React-based dashboard with Material-UI components
- **Backend**: Node.js/Express API with TypeScript
- **Database**: MongoDB for data persistence
- **WebSocket**: Real-time communication for live updates
- **Containerization**: Docker Compose for orchestration

---

## Frontend Pages and Components

### 1. Dashboard Page (`/`)
**Location**: `frontend/src/components/Dashboard.tsx`

**Purpose**: Provides a high-level overview of the entire system with key metrics and status information.

**Features**:
- **Statistics Cards**: Displays four key metrics:
  - Total Students: Shows the number of students in the system (150)
  - Active Sessions: Number of currently running simulation sessions (3)
  - Average Engagement: Overall engagement percentage across all students (67%)
  - High Risk Students: Count of students identified as at-risk (8)

- **Recent Activity Panel**: Shows recent system events including:
  - New simulation sessions started
  - Risk alerts generated for specific students
  - Network analysis completions
  - Engagement metric updates

- **System Status Panel**: Real-time monitoring of system components:
  - API Service status
  - Database connection status
  - WebSocket connection status
  - Simulation Engine readiness

**Data Sources**: Currently uses mock/static data for demonstration purposes

### 2. Simulation Control Page (`/simulation`)
**Location**: `frontend/src/components/SimulationControl.tsx`

**Purpose**: Interface for configuring, starting, and monitoring simulation sessions.

**Features**:
- **Configuration Panel**: 
  - Course ID input (e.g., "CS101")
  - Session Type selection (Lecture, Tutorial, Lab, Group Work)
  - Duration setting (10-300 minutes)
  - Student count (2-100 students)
  - Start/Stop simulation controls

- **Status Panel**: 
  - Real-time simulation status (Running/Stopped)
  - Generated interaction count
  - Session results display including:
    - Unique session ID
    - Number of participating students
    - Total interactions generated
    - Network density percentage
    - Average clustering coefficient

**API Integration**: Connects to `/api/simulate/session` endpoint to trigger simulation execution

### 3. Student Monitor Page (`/students`)
**Location**: `frontend/src/components/StudentMonitor.tsx`

**Purpose**: Individual student tracking and risk assessment interface.

**Features**:
- **Summary Cards**:
  - High Risk Students count with warning indicator
  - Average Engagement score with progress bar
  - Total Students Monitored count

- **Student Table**: Detailed view of each student showing:
  - Student ID and Name
  - Risk Level (Low/Medium/High with color-coded chips)
  - Engagement Score (0-100% with progress bar)
  - Interaction Count
  - Engagement Trend (Increasing/Decreasing/Stable with icons)

**Data**: Currently displays mock student data for demonstration

### 4. Network Analysis Page (`/network`)
**Location**: `frontend/src/components/NetworkAnalysis.tsx`

**Purpose**: Social network analysis and community detection visualization.

**Features**:
- **Network Metrics Card**:
  - Network Density (36%)
  - Average Clustering Coefficient (0.42)
  - Connected Components count (2)
  - Total Connections/interactions (45)

- **Most Connected Students Card**:
  - Ranking of students by centrality scores
  - Individual centrality percentages
  - Student names and IDs

- **Detected Communities Card**:
  - Community groups (Study Group A, Lab Partners, Project Team)
  - Community sizes
  - Community descriptions

- **Network Visualization Placeholder**:
  - Reserved space for D3.js interactive network graph
  - Force-directed layout planned for implementation

**Data**: Uses mock network analysis data for demonstration

### 5. Navigation Bar
**Location**: `frontend/src/components/Navbar.tsx`

**Purpose**: Main navigation component providing access to all pages.

**Features**:
- Application title: "SDT Interaction Simulator"
- Navigation buttons with icons for each page
- Active page highlighting
- Responsive design with Material-UI components

---

## Simulation Engine and Mechanics

### Core Simulation Logic
**Location**: `backend/src/services/SimulationEngine.ts`

The simulation engine is the heart of the system, responsible for generating realistic student interaction data based on various factors and algorithms.

### Student Modeling

**Student Attributes**:
- **Academic Level**: Undergraduate or Postgraduate
- **Major**: Randomly assigned from predefined list
- **Current GPA**: 2.0-4.0 scale
- **Risk Level**: Low (60%), Medium (25%), High (15%)
- **Personality Type**: Extrovert (30%), Introvert (30%), Ambivert (40%)
- **Participation Score**: 0-100 baseline engagement metric

### Interaction Generation Algorithm

**Base Configuration**:
```typescript
baseInteractionProbability: 0.1 (10% base chance)
personalityFactors: {
  extrovert: 1.5x multiplier
  introvert: 0.7x multiplier
  ambivert: 1.0x multiplier
}
contextFactors: {
  lecture: 0.3x (limited interaction)
  tutorial: 0.8x (moderate interaction)
  lab: 0.9x (high interaction)
  group-work: 1.2x (highest interaction)
}
```

**Interaction Probability Calculation**:
1. Start with base probability (10%)
2. Apply personality factors for both students
3. Apply special rules (e.g., introvert-introvert pairs get 0.5x multiplier)
4. Apply context multiplier based on session type
5. Apply academic similarity bonus (GPA difference < 0.5 gets 1.2x multiplier)
6. Apply risk-based modifiers
7. Cap maximum probability at 70%

**Activity Peaks**: Each session type has predefined activity peaks when interactions are more likely:
- **Lecture**: 10%, 50%, 90% of session duration
- **Group Work**: 20%, 40%, 60%, 80% of session duration
- **Lab**: 30%, 70% of session duration
- **Tutorial**: 20%, 60% of session duration

**Interaction Types**: Generated based on context:
- **Discussion**: General conversation
- **Collaboration**: Working together on tasks
- **Social**: Non-academic social interaction
- **Help-seeking**: One student asking for assistance

**Duration Modeling**: Context-based average durations with ±50% variation:
- Lecture: 15 seconds average
- Tutorial: 60 seconds average
- Lab: 120 seconds average
- Group Work: 180 seconds average

### Network Analysis

**Metrics Calculated**:
1. **Network Density**: Actual connections / Possible connections
2. **Centrality Scores** for each student:
   - **Degree Centrality**: Direct connections / Total possible connections
   - **Betweenness Centrality**: How often a student lies on paths between others
   - **Closeness Centrality**: Average distance to all other students
   - **Eigenvector Centrality**: Influence based on connections to other influential students

3. **Clustering Coefficient**: Measure of how connected a student's neighbors are to each other
4. **Connected Components**: Number of separate sub-networks

### Engagement Metrics Generation

**Per-Student Metrics Calculated**:
- **Interaction Frequency**: Interactions per hour
- **Average Interaction Duration**: Mean duration of all interactions
- **Social Network Position**: Degree centrality score
- **Behavioral Patterns**:
  - Whether student initiates interactions
  - Whether student responds to interactions
  - Isolation risk assessment

**Risk Assessment Algorithm**:
- **GPA Contribution** (0-40 points):
  - < 2.0 GPA: +40 risk points
  - 2.0-2.5 GPA: +25 risk points
  - 2.5-3.0 GPA: +10 risk points

- **Participation Contribution** (0-30 points):
  - < 30% participation: +30 risk points
  - 30-50% participation: +20 risk points
  - 50-70% participation: +10 risk points

- **Social Isolation Contribution** (0-30 points):
  - Based on network centrality and interaction frequency

**Risk Flags Generated**:
- Academic: `low_gpa`, `low_participation`, `social_isolation`
- Social: `social_isolation`, `no_interactions`, `introvert_underengagement`

### Session Generation Process

1. **Initialize Session**: Create unique session ID and timestamp
2. **Generate Students**: Create student profiles with random attributes
3. **Create Interaction Timeline**: Generate interactions based on activity peaks
4. **Calculate Probabilities**: For each student pair, calculate interaction probability
5. **Generate Interactions**: Create interaction events based on probabilities
6. **Compute Network Metrics**: Analyze the generated interaction network
7. **Generate Engagement Metrics**: Calculate individual student metrics
8. **Return Complete Session**: Package all data for API response

### API Endpoints

**Session Generation**: `POST /api/simulate/session`
- Input validation using Joi schema
- Accepts session parameters (course ID, type, duration, student list)
- Returns complete session object with interactions and metrics

**Session Retrieval**: `GET /api/sessions/:sessionId`
- Currently returns 404 (database integration pending)

**Engagement Metrics**: `GET /api/students/:studentId/sessions/:sessionId/engagement`
- Currently returns 501 (implementation pending)

---

## Data Models and Types

### Core Interfaces

**Student**: Complete student profile with academic and behavioral attributes
**InteractionEvent**: Individual interaction between two students with metadata
**NetworkMetrics**: Graph analysis results for the entire network
**ClassSession**: Complete session data including all students and interactions
**StudentEngagementMetrics**: Individual student analysis and risk assessment

### Key Relationships

- Sessions contain multiple Students
- Students participate in multiple InteractionEvents
- InteractionEvents reference exactly two Students
- NetworkMetrics summarize all InteractionEvents in a Session
- StudentEngagementMetrics analyze one Student's behavior in one Session

---

## Real-time Features

**WebSocket Integration**: Planned for real-time updates during simulation execution
**Live Monitoring**: Dashboard updates as simulations progress
**Risk Alerts**: Immediate notifications when high-risk patterns are detected

---

## Future Enhancements

1. **Database Integration**: Persistent storage for sessions and historical data
2. **Advanced Network Visualization**: D3.js interactive network graphs
3. **Machine Learning**: Predictive models for student success
4. **Historical Analysis**: Trend analysis across multiple sessions
5. **Intervention Recommendations**: Automated suggestions for at-risk students
6. **Export Capabilities**: Data export for further analysis
7. **User Authentication**: Role-based access control
8. **Real-time Collaboration**: Multi-user simulation monitoring

---

## Technical Implementation Notes

- **Frontend**: React 18 with TypeScript and Material-UI v5
- **Backend**: Node.js with Express and TypeScript
- **Validation**: Joi for request validation
- **WebSocket**: ws library for real-time communication
- **Database**: MongoDB with Mongoose ODM
- **Containerization**: Multi-stage Docker builds with nginx for frontend
- **Development**: ts-node-dev for hot reloading

The system is designed to be scalable, maintainable, and extensible for educational research and practical classroom applications.