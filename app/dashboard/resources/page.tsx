'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { File, FileText, Film, Book, Folder, ExternalLink, Plus, Search, Filter, X, Upload, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Local storage key for resources
const RESOURCES_STORAGE_KEY = 'atena-resources';

// Resource types
type ResourceType = 'document' | 'video' | 'book' | 'folder' | 'link';

// Resource interface
interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  subject: string;
  date: string;
  url?: string;
  description?: string;
  favorite?: boolean;
}

// Get icon based on resource type
const getResourceIcon = (type: ResourceType, className = "h-5 w-5") => {
  switch (type) {
    case 'document':
      return <FileText className={className} />;
    case 'video':
      return <Film className={className} />;
    case 'book':
      return <Book className={className} />;
    case 'folder':
      return <Folder className={className} />;
    case 'link':
      return <ExternalLink className={className} />;
    default:
      return <File className={className} />;
  }
};

// Sample AI recommendations
const aiRecommendations = [
  {
    id: 'rec-1',
    title: 'Introduction to Algorithms',
    description: 'Based on your current course in Computer Science, this textbook covers essential algorithm concepts you\'re studying.',
    type: 'book' as ResourceType,
    subject: 'Computer Science',
    url: 'https://example.com/algorithms'
  },
  {
    id: 'rec-2',
    title: 'MIT OpenCourseWare - Linear Algebra',
    description: 'This online course complements your Mathematics studies with video lectures and practice problems.',
    type: 'link' as ResourceType,
    subject: 'Mathematics',
    url: 'https://ocw.mit.edu/courses/mathematics/linear-algebra/'
  }
];

export default function ResourcesPage() {
  // State for resources
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ResourceType | null>(null);
  
  // State for new resource
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'document' as ResourceType,
    subject: 'Computer Science',
    url: '',
    description: ''
  });
  
  // Load resources from storage on mount
  useEffect(() => {
    const storedResources = localStorage.getItem(RESOURCES_STORAGE_KEY);
    if (storedResources) {
      try {
        setResources(JSON.parse(storedResources));
      } catch (error) {
        console.error('Failed to parse stored resources:', error);
        // If parsing fails, initialize with sample data
        initializeWithSampleData();
      }
    } else {
      // No stored resources, initialize with sample data
      initializeWithSampleData();
    }
  }, []);
  
  // Initialize with sample data
  const initializeWithSampleData = () => {
    const sampleResources: Resource[] = [
      {
        id: '1',
        name: 'Data Structures Notes',
        type: 'document',
        subject: 'Computer Science',
        date: 'March 15, 2024'
      },
      {
        id: '2',
        name: 'Calculus Lecture Recording',
        type: 'video',
        subject: 'Mathematics',
        date: 'March 12, 2024'
      },
      {
        id: '3',
        name: 'Physics Textbook',
        type: 'book',
        subject: 'Physics',
        date: 'March 10, 2024'
      },
      {
        id: '4',
        name: 'Assignment Solutions',
        type: 'document',
        subject: 'Mathematics',
        date: 'March 8, 2024'
      },
      {
        id: '5',
        name: 'Research Papers',
        type: 'folder',
        subject: 'Computer Science',
        date: 'March 5, 2024'
      },
      {
        id: '6',
        name: 'Study Guide Website',
        type: 'link',
        subject: 'General',
        date: 'March 1, 2024',
        url: 'https://example.com/study-guide'
      }
    ];
    
    setResources(sampleResources);
    localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(sampleResources));
  };
  
  // Save resources to storage whenever they change
  useEffect(() => {
    localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(resources));
  }, [resources]);
  
  // Filter resources based on search query and filters
  const filteredResources = resources.filter(resource => {
    // Search query filter
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Subject filter
    const matchesSubject = subjectFilter ? resource.subject === subjectFilter : true;
    
    // Type filter
    const matchesType = typeFilter ? resource.type === typeFilter : true;
    
    return matchesSearch && matchesSubject && matchesType;
  });
  
  // Extract unique subjects for filtering
  const subjects = Array.from(new Set(resources.map(r => r.subject)));
  
  // Handle adding new resource
  const handleAddResource = () => {
    if (!newResource.name) return;
    
    const newResourceToAdd: Resource = {
      id: Date.now().toString(),
      name: newResource.name,
      type: newResource.type,
      subject: newResource.subject,
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      url: newResource.url,
      description: newResource.description
    };
    
    setResources([newResourceToAdd, ...resources]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewResource({
      name: '',
      type: 'document',
      subject: 'Computer Science',
      url: '',
      description: ''
    });
  };
  
  // Handle adding AI recommendation
  const handleAddRecommendation = (recommendation: typeof aiRecommendations[0]) => {
    const newResourceToAdd: Resource = {
      id: Date.now().toString(),
      name: recommendation.title,
      type: recommendation.type,
      subject: recommendation.subject,
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      url: recommendation.url,
      description: recommendation.description
    };
    
    setResources([newResourceToAdd, ...resources]);
  };
  
  return (
    <div className="container p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Resources</h1>
          <p className="text-muted-foreground">
            Store and organize your study materials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-accent' : ''}`} onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button variant="outline" size="sm" className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'bg-accent' : ''}`} onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 overflow-auto py-1 no-scrollbar">
          <Button 
            variant={subjectFilter === null ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setSubjectFilter(null)}
          >
            All Subjects
          </Button>
          {subjects.map(subject => (
            <Button 
              key={subject}
              variant={subjectFilter === subject ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSubjectFilter(subject)}
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Resource type filters */}
      <div className="flex gap-2 overflow-auto py-1 no-scrollbar">
        <Button 
          variant={typeFilter === null ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setTypeFilter(null)}
          className="h-8 text-xs"
        >
          All Types
        </Button>
        <Button 
          variant={typeFilter === 'document' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setTypeFilter('document')}
          className="h-8 text-xs"
        >
          Documents
        </Button>
        <Button 
          variant={typeFilter === 'video' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setTypeFilter('video')}
          className="h-8 text-xs"
        >
          Videos
        </Button>
        <Button 
          variant={typeFilter === 'book' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setTypeFilter('book')}
          className="h-8 text-xs"
        >
          Books
        </Button>
        <Button 
          variant={typeFilter === 'link' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setTypeFilter('link')}
          className="h-8 text-xs"
        >
          Links
        </Button>
      </div>
      
      {/* Resources grid/list */}
      <ScrollArea className="h-[calc(100vh-350px)] min-h-[400px]">
        {filteredResources.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-2"
          }>
            {filteredResources.map((resource) => (
              viewMode === 'grid' ? (
                <div 
                  key={resource.id} 
                  className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => resource.url && window.open(resource.url, '_blank')}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md flex-shrink-0">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.subject}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{resource.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  key={resource.id} 
                  className="flex items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => resource.url && window.open(resource.url, '_blank')}
                >
                  <div className="p-2 bg-primary/10 rounded-md flex-shrink-0 mr-3">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-medium truncate">{resource.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{resource.subject}</span>
                      <span>•</span>
                      <span>{resource.date}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {resource.type}
                  </Badge>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">No resources found</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              {searchQuery || subjectFilter || typeFilter
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Start adding your study materials by clicking the Upload New button"}
            </p>
            {(searchQuery || subjectFilter || typeFilter) && (
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSubjectFilter(null);
                setTypeFilter(null);
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </ScrollArea>
      
      {/* AI Recommendations */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <h2 className="text-xl font-semibold mb-4">AI Resource Suggestions</h2>
          <div className="space-y-4">
            {aiRecommendations.map(recommendation => (
              <div key={recommendation.id} className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-background rounded-md">
                    {getResourceIcon(recommendation.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <p className="text-sm mt-1">{recommendation.description}</p>
                    <div className="flex items-center mt-2 justify-between">
                      <a 
                        href={recommendation.url} 
                        target="_blank" 
                        className="text-primary text-sm hover:underline inline-block"
                      >
                        Visit Resource
                      </a>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddRecommendation(recommendation)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add to Library
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Add Resource Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="upload" className="mt-2">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="link">Add Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click to select files
                </p>
                <Button variant="outline" size="sm">
                  Select Files
                </Button>
              </div>
              
              <div>
                <label htmlFor="resource-name" className="block text-sm font-medium mb-1">
                  Resource Name
                </label>
                <Input
                  id="resource-name"
                  placeholder="e.g., Chemistry Notes"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="resource-subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <select
                  id="resource-subject"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newResource.subject}
                  onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                >
                  <option>Computer Science</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>History</option>
                  <option>Literature</option>
                  <option>General</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="resource-type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  id="resource-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value as ResourceType })}
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="book">Book</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="resource-description" className="block text-sm font-medium mb-1">
                  Description (Optional)
                </label>
                <Input
                  id="resource-description"
                  placeholder="Brief description of this resource"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="link" className="space-y-4">
              <div>
                <label htmlFor="resource-url" className="block text-sm font-medium mb-1">
                  URL
                </label>
                <Input
                  id="resource-url"
                  placeholder="https://example.com"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="resource-name-link" className="block text-sm font-medium mb-1">
                  Resource Name
                </label>
                <Input
                  id="resource-name-link"
                  placeholder="e.g., Study Guide Website"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="resource-subject-link" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <select
                  id="resource-subject-link"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newResource.subject}
                  onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                >
                  <option>Computer Science</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>History</option>
                  <option>Literature</option>
                  <option>General</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="resource-description-link" className="block text-sm font-medium mb-1">
                  Description (Optional)
                </label>
                <Input
                  id="resource-description-link"
                  placeholder="Brief description of this resource"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource} disabled={!newResource.name}>
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 