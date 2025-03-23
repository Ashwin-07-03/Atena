import { Metadata } from 'next';
import DashboardLayout from '@/components/dashboard-layout';
import { File, FileText, Film, Book, Folder, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resources | Atena',
  description: 'Manage your study resources and materials',
};

// Sample resource data
const resources = [
  {
    id: 1,
    name: 'Data Structures Notes',
    type: 'pdf',
    subject: 'Computer Science',
    date: 'March 15, 2024',
    icon: <FileText className="h-5 w-5 text-primary" />
  },
  {
    id: 2,
    name: 'Calculus Lecture Recording',
    type: 'video',
    subject: 'Mathematics',
    date: 'March 12, 2024',
    icon: <Film className="h-5 w-5 text-primary" />
  },
  {
    id: 3,
    name: 'Physics Textbook',
    type: 'book',
    subject: 'Physics',
    date: 'March 10, 2024',
    icon: <Book className="h-5 w-5 text-primary" />
  },
  {
    id: 4,
    name: 'Assignment Solutions',
    type: 'pdf',
    subject: 'Mathematics',
    date: 'March 8, 2024',
    icon: <FileText className="h-5 w-5 text-primary" />
  },
  {
    id: 5,
    name: 'Research Papers',
    type: 'folder',
    subject: 'Computer Science',
    date: 'March 5, 2024',
    icon: <Folder className="h-5 w-5 text-primary" />
  },
  {
    id: 6,
    name: 'Study Guide Website',
    type: 'link',
    subject: 'General',
    date: 'March 1, 2024',
    icon: <ExternalLink className="h-5 w-5 text-primary" />
  }
];

export default function ResourcesPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resources</h1>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
              Upload New
            </button>
            <button className="px-4 py-2 border border-border rounded-md text-sm font-medium">
              Create Folder
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <div 
              key={resource.id} 
              className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/10 rounded-md flex-shrink-0">
                  {resource.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground">{resource.subject}</p>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{resource.type}</span>
                    <span>{resource.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">AI Resource Suggestions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-background rounded-md">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Introduction to Algorithms</h3>
                  <p className="text-sm mt-1">Based on your current course in Computer Science, this textbook covers essential algorithm concepts you're studying.</p>
                  <a href="#" className="text-primary text-sm hover:underline mt-2 inline-block">View Recommendation</a>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-background rounded-md">
                  <ExternalLink className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">MIT OpenCourseWare - Linear Algebra</h3>
                  <p className="text-sm mt-1">This online course complements your Mathematics studies with video lectures and practice problems.</p>
                  <a href="#" className="text-primary text-sm hover:underline mt-2 inline-block">Visit Resource</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 