'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';

// Sample course data
const INITIAL_COURSES = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    credits: 4,
    currentGrade: 95,
    assignments: [
      { id: '1-1', name: 'Assignment 1', score: 92, totalPoints: 100, weight: 0.15 },
      { id: '1-2', name: 'Assignment 2', score: 88, totalPoints: 100, weight: 0.15 },
      { id: '1-3', name: 'Midterm Exam', score: 95, totalPoints: 100, weight: 0.3 },
      { id: '1-4', name: 'Final Project', score: 98, totalPoints: 100, weight: 0.4 }
    ]
  },
  {
    id: '2',
    name: 'Calculus I',
    code: 'MATH201',
    credits: 3,
    currentGrade: 92,
    assignments: [
      { id: '2-1', name: 'Problem Set 1', score: 85, totalPoints: 100, weight: 0.1 },
      { id: '2-2', name: 'Problem Set 2', score: 88, totalPoints: 100, weight: 0.1 },
      { id: '2-3', name: 'Problem Set 3', score: 92, totalPoints: 100, weight: 0.1 },
      { id: '2-4', name: 'Midterm Exam', score: 94, totalPoints: 100, weight: 0.3 },
      { id: '2-5', name: 'Final Exam', score: 94, totalPoints: 100, weight: 0.4 }
    ]
  },
  {
    id: '3',
    name: 'Introduction to Physics',
    code: 'PHYS101',
    credits: 4,
    currentGrade: 88,
    assignments: [
      { id: '3-1', name: 'Lab 1', score: 85, totalPoints: 100, weight: 0.1 },
      { id: '3-2', name: 'Lab 2', score: 88, totalPoints: 100, weight: 0.1 },
      { id: '3-3', name: 'Midterm 1', score: 82, totalPoints: 100, weight: 0.2 },
      { id: '3-4', name: 'Midterm 2', score: 86, totalPoints: 100, weight: 0.2 },
      { id: '3-5', name: 'Final Exam', score: 92, totalPoints: 100, weight: 0.4 }
    ]
  },
  {
    id: '4',
    name: 'World History',
    code: 'HIST101',
    credits: 3,
    currentGrade: 90,
    assignments: [
      { id: '4-1', name: 'Essay 1', score: 88, totalPoints: 100, weight: 0.2 },
      { id: '4-2', name: 'Essay 2', score: 90, totalPoints: 100, weight: 0.2 },
      { id: '4-3', name: 'Midterm Exam', score: 87, totalPoints: 100, weight: 0.25 },
      { id: '4-4', name: 'Research Paper', score: 92, totalPoints: 100, weight: 0.35 }
    ]
  }
];

// Helper function to calculate GPA
const calculateGPA = (courses: any[]) => {
  if (courses.length === 0) return 0;
  
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const totalPoints = courses.reduce((sum, course) => {
    // Convert grade to GPA scale (A = 4.0, B = 3.0, etc.)
    let gpaPoints;
    if (course.currentGrade >= 94) gpaPoints = 4.0;      // A
    else if (course.currentGrade >= 90) gpaPoints = 3.7; // A-
    else if (course.currentGrade >= 87) gpaPoints = 3.3; // B+
    else if (course.currentGrade >= 84) gpaPoints = 3.0; // B
    else if (course.currentGrade >= 80) gpaPoints = 2.7; // B-
    else if (course.currentGrade >= 77) gpaPoints = 2.3; // C+
    else if (course.currentGrade >= 74) gpaPoints = 2.0; // C
    else if (course.currentGrade >= 70) gpaPoints = 1.7; // C-
    else if (course.currentGrade >= 67) gpaPoints = 1.3; // D+
    else if (course.currentGrade >= 64) gpaPoints = 1.0; // D
    else gpaPoints = 0.0;                                // F
    
    return sum + (gpaPoints * course.credits);
  }, 0);
  
  return totalPoints / totalCredits;
};

// Helper function to get letter grade
const getLetterGrade = (score: number) => {
  if (score >= 94) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 84) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 74) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 64) return 'D';
  return 'F';
};

export default function Grades() {
  const [courses] = useState(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<any>(courses[0]);
  
  const gpa = calculateGPA(courses);
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top GPA Card */}
        <div className="lg:col-span-3 card animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Grade Tracker
              </h2>
              <p className="text-foreground/70">
                Track your grades, calculate your GPA, and monitor your academic progress.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="text-right">
                <div className="text-sm text-foreground/70">
                  Current GPA
                </div>
                <div className="text-3xl font-bold text-primary">
                  {gpa.toFixed(2)}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 ml-4">
                <div className="text-lg font-bold text-primary">
                  {gpa >= 3.7 ? 'A' : gpa >= 3.3 ? 'B+' : gpa >= 3.0 ? 'B' : gpa >= 2.7 ? 'B-' : 'C+'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course List */}
        <div className="card animate-slide-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <h3 className="text-lg font-semibold mb-4">
            Courses
          </h3>
          <div className="space-y-2">
            {courses.map(course => (
              <div 
                key={course.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCourse?.id === course.id 
                    ? 'bg-accent/50 border-l-4 border-primary' 
                    : 'hover:bg-secondary border-l-4 border-transparent'
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {course.name}
                    </div>
                    <div className="text-sm text-foreground/70">
                      {course.code} • {course.credits} Credits
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <div className="text-sm font-medium">
                        {course.currentGrade}%
                      </div>
                      <div className="text-xs text-foreground/70">
                        {getLetterGrade(course.currentGrade)}
                      </div>
                    </div>
                    <div className={`w-2 h-10 rounded-full ${
                      course.currentGrade >= 90 ? 'bg-primary' :
                      course.currentGrade >= 80 ? 'bg-accent' :
                      course.currentGrade >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full p-3 text-center text-primary border border-dashed border-border rounded-lg hover:bg-secondary transition-colors mt-4">
              + Add New Course
            </button>
          </div>
        </div>
        
        {/* Selected Course Details */}
        <div className="lg:col-span-2 card animate-slide-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          {selectedCourse ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {selectedCourse.name} ({selectedCourse.code})
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">
                    Current Grade: <span className="text-primary">{selectedCourse.currentGrade}% ({getLetterGrade(selectedCourse.currentGrade)})</span>
                  </div>
                </div>
              </div>
              
              {/* Grade Distribution */}
              <div className="mb-6">
                <div className="text-sm font-medium text-foreground/70 mb-2">
                  Grade Distribution
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${selectedCourse.currentGrade}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-foreground/70 mt-1">
                  <div>0%</div>
                  <div>50%</div>
                  <div>100%</div>
                </div>
              </div>
              
              {/* Assignments List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-foreground/70">
                    Assignments & Assessments
                  </div>
                  <button className="text-xs text-primary hover:underline">
                    + Add Assignment
                  </button>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {selectedCourse.assignments.map((assignment: any) => (
                        <tr key={assignment.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium">{assignment.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm">{assignment.score} / {assignment.totalPoints}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm">{Math.round(assignment.weight * 100)}%</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              assignment.score / assignment.totalPoints >= 0.9 ? 'bg-primary/10 text-primary' :
                              assignment.score / assignment.totalPoints >= 0.8 ? 'bg-accent/30 text-foreground' :
                              assignment.score / assignment.totalPoints >= 0.7 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                            }`}>
                              {getLetterGrade(assignment.score)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Grade Calculator */}
              <div className="mt-6 p-4 border border-border rounded-lg bg-secondary/30 animate-scale-in opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <h4 className="text-sm font-medium mb-3">Grade Calculator</h4>
                <div className="text-sm text-foreground/70">
                  Use this calculator to estimate your final grade based on upcoming assignments.
                </div>
                <button className="mt-3 btn-secondary text-sm">
                  Open Calculator
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-foreground/70">
              Select a course to view details
            </div>
          )}
        </div>
        
        {/* Grade Trends */}
        <div className="lg:col-span-3 card animate-scale-in opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <h3 className="text-lg font-semibold mb-4">
            Grade Trends
          </h3>
          <div className="flex justify-center">
            <div className="h-64 w-full relative">
              {/* Just a simple visual here - could be replaced with a proper chart */}
              <div className="absolute left-0 right-0 bottom-0 top-0 flex items-end">
                <div className="w-full grid grid-cols-4 gap-8 px-8 h-full items-end">
                  {[3.6, 3.7, 3.5, 3.7].map((semGpa, i) => (
                    <div key={i} className="flex flex-col items-center group">
                      <div 
                        className="w-full bg-primary group-hover:bg-primary/80 transition-colors rounded-t-md"
                        style={{ height: `${(semGpa / 4) * 100}%` }}
                      ></div>
                      <div className="mt-2 text-sm text-foreground/70">Semester {i + 1}</div>
                      <div className="text-xs text-primary">{semGpa.toFixed(1)} GPA</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 