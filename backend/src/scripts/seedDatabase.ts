import dotenv from 'dotenv';
import { DatabaseConnection } from '../database/connection';
import { StudentModel } from '../models/Student';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const sampleStudents = [
  {
    studentId: 'STU_001',
    name: 'Alice Johnson',
    academicLevel: 'undergraduate',
    major: 'Computer Science',
    currentGPA: 3.7,
    riskLevel: 'low',
    personalityType: 'extrovert',
    participationScore: 85
  },
  {
    studentId: 'STU_002',
    name: 'Bob Smith',
    academicLevel: 'undergraduate',
    major: 'Engineering',
    currentGPA: 2.1,
    riskLevel: 'high',
    personalityType: 'introvert',
    participationScore: 32
  },
  {
    studentId: 'STU_003',
    name: 'Carol Davis',
    academicLevel: 'postgraduate',
    major: 'Mathematics',
    currentGPA: 3.2,
    riskLevel: 'medium',
    personalityType: 'ambivert',
    participationScore: 67
  },
  {
    studentId: 'STU_004',
    name: 'David Wilson',
    academicLevel: 'undergraduate',
    major: 'Physics',
    currentGPA: 3.5,
    riskLevel: 'low',
    personalityType: 'extrovert',
    participationScore: 78
  },
  {
    studentId: 'STU_005',
    name: 'Eva Brown',
    academicLevel: 'undergraduate',
    major: 'Biology',
    currentGPA: 2.3,
    riskLevel: 'high',
    personalityType: 'introvert',
    participationScore: 28
  }
];

const generateAdditionalStudents = (count: number) => {
  const majors = ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Psychology', 'Business', 'Economics'];
  const personalityTypes: ('extrovert' | 'introvert' | 'ambivert')[] = ['extrovert', 'introvert', 'ambivert'];
  const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const academicLevels: ('undergraduate' | 'postgraduate')[] = ['undergraduate', 'postgraduate'];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'Chris', 'Anna', 'James', 'Lisa', 'Robert', 'Maria', 'William', 'Linda', 'Richard', 'Patricia', 'Joseph', 'Jennifer'];
  const lastNames = ['Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker'];

  const students = [];
  for (let i = 6; i <= count + 5; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    students.push({
      studentId: `STU_${String(i).padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      academicLevel: academicLevels[Math.floor(Math.random() * academicLevels.length)],
      major: majors[Math.floor(Math.random() * majors.length)],
      currentGPA: Math.round((1.5 + Math.random() * 2.5) * 100) / 100, // 1.5 - 4.0
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      personalityType: personalityTypes[Math.floor(Math.random() * personalityTypes.length)],
      participationScore: Math.floor(Math.random() * 100)
    });
  }
  return students;
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    const db = DatabaseConnection.getInstance();
    await db.connect();
    
    // Clear existing data
    console.log('🗑️  Clearing existing student data...');
    await StudentModel.deleteMany({});
    
    // Insert sample students
    console.log('👥 Inserting sample students...');
    await StudentModel.insertMany(sampleStudents);
    
    // Generate and insert additional students
    console.log('🎲 Generating additional students...');
    const additionalStudents = generateAdditionalStudents(20); // Generate 20 more students
    await StudentModel.insertMany(additionalStudents);
    
    const totalStudents = await StudentModel.countDocuments();
    console.log(`✅ Successfully seeded database with ${totalStudents} students`);
    
    // Display some statistics
    const riskStats = await StudentModel.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('📊 Risk level distribution:');
    riskStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} students`);
    });
    
    await db.disconnect();
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };