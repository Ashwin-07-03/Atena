"use client";

import React, { useState } from "react";
import { Search, FileText, Image, Link as LinkIcon, MoreHorizontal, Upload, Grid, List, Filter, Plus, X, Grid3X3, FileImage, Link2, Tag, Download, Trash2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SharedResource, 
  addSharedResource, 
  getSharedResources, 
  getCurrentUser 
} from '@/lib/services/collaboration-service';

interface Resource {
  id: string;
  type: "document" | "image" | "link";
  name: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  size?: string;
  tags: string[];
}

interface SharedResourcesProps {
  resources: Resource[];
  groupId?: string;
  onAddResource: (resource: { name: string; url: string; type: string; tags: string[] }) => void;
  onDeleteResource?: (id: string) => void;
  currentUserId: string;
}

export function SharedResources({
  resources,
  groupId,
  onAddResource,
  onDeleteResource,
  currentUserId,
}: SharedResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addResourceDialog, setAddResourceDialog] = useState(false);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<"all" | "document" | "image" | "link">("all");
  const [newResource, setNewResource] = useState({
    name: "",
    url: "",
    type: "link",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  // Filter resources based on search query and selected filter
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    switch (resourceTypeFilter) {
      case "document":
        return resource.type === "document";
      case "image":
        return resource.type === "image";
      case "link":
        return resource.type === "link";
      default:
        return true;
    }
  });

  const handleAddResource = () => {
    if (!newResource.name || !newResource.url) return;
    
    onAddResource(newResource);
    
    setNewResource({
      name: "",
      url: "",
      type: "link",
      tags: [],
    });
    
    setAddResourceDialog(false);
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    if (newResource.tags.includes(newTag.trim())) return;
    
    setNewResource({
      ...newResource,
      tags: [...newResource.tags, newTag.trim()],
    });
    
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setNewResource({
      ...newResource,
      tags: newResource.tags.filter(t => t !== tag),
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getResourceIcon = (type: string, className: string = "h-5 w-5") => {
    switch (type) {
      case "document":
        return <FileText className={className} />;
      case "image":
        return <Image className={className} />;
      case "link":
        return <LinkIcon className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Shared Resources</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${viewMode === "grid" ? "bg-accent" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${viewMode === "list" ? "bg-accent" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setAddResourceDialog(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Resource
            </Button>
          </div>
        </div>
        
        <div className="relative">
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
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Filter buttons */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          <Button
            variant={resourceTypeFilter === "all" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setResourceTypeFilter("all")}
          >
            All
          </Button>
          <Button
            variant={resourceTypeFilter === "document" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setResourceTypeFilter("document")}
          >
            Documents
          </Button>
          <Button
            variant={resourceTypeFilter === "image" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setResourceTypeFilter("image")}
          >
            Images
          </Button>
          <Button
            variant={resourceTypeFilter === "link" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setResourceTypeFilter("link")}
          >
            Links
          </Button>
        </div>
      </div>
      
      {/* Resources list */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredResources.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4" : "space-y-3"}>
              {filteredResources.map((resource) => (
                viewMode === "grid" ? (
                  <div key={resource.id} className="relative group rounded-lg border p-3 hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-md bg-primary/10 text-primary`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(resource.url, "_blank")}>
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(resource.url);
                            }}
                          >
                            Copy link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {resource.createdBy.id === currentUserId && onDeleteResource && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDeleteResource(resource.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <h3 className="font-medium truncate mb-1">{resource.name}</h3>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>
                        {formatDate(resource.createdAt)}
                      </span>
                      {resource.size && <span>{resource.size}</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        {resource.createdBy.avatar ? (
                          <img src={resource.createdBy.avatar} alt={resource.createdBy.name} />
                        ) : (
                          <div className="bg-primary/10 text-primary flex items-center justify-center w-full h-full text-[10px] font-medium">
                            {resource.createdBy.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Avatar>
                      <span className="text-xs">{resource.createdBy.name}</span>
                    </div>
                    
                    {resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {resource.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={resource.id} className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors">
                    <div className={`p-2 rounded-md bg-primary/10 text-primary mr-3`}>
                      {getResourceIcon(resource.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{resource.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(resource.createdAt)}</span>
                        {resource.size && <span>• {resource.size}</span>}
                        <span>• Added by {resource.createdBy.name}</span>
                      </div>
                      
                      {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 ml-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(resource.url, "_blank")}>
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(resource.url);
                          }}
                        >
                          Copy link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {resource.createdBy.id === currentUserId && onDeleteResource && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDeleteResource(resource.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-3 bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No resources found</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {searchQuery
                  ? "Try a different search term"
                  : "Share files, images, and links with your team"}
              </p>
              <Button size="sm" onClick={() => setAddResourceDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Add Resource Dialog */}
      <Dialog open={addResourceDialog} onOpenChange={setAddResourceDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>
              Share a document, image, or link with your team.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="link" className="mt-2">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger
                value="link"
                onClick={() => setNewResource({ ...newResource, type: "link" })}
              >
                Link
              </TabsTrigger>
              <TabsTrigger
                value="document"
                onClick={() => setNewResource({ ...newResource, type: "document" })}
              >
                Document
              </TabsTrigger>
              <TabsTrigger
                value="image"
                onClick={() => setNewResource({ ...newResource, type: "image" })}
              >
                Image
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4">
              <div>
                <label htmlFor="link-name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="link-name"
                  placeholder="Website name or description"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="link-url" className="block text-sm font-medium mb-1">
                  URL
                </label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="document" className="space-y-4">
              <div>
                <label htmlFor="doc-name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="doc-name"
                  placeholder="Document name"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="doc-url" className="block text-sm font-medium mb-1">
                  URL
                </label>
                <Input
                  id="doc-url"
                  placeholder="https://example.com/document.pdf"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Or upload a file directly (coming soon)
                </span>
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4">
              <div>
                <label htmlFor="image-name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="image-name"
                  placeholder="Image name or description"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="image-url" className="block text-sm font-medium mb-1">
                  URL
                </label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Or upload an image directly (coming soon)
                </span>
              </div>
            </TabsContent>
          </Tabs>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <Input
                id="tags"
                placeholder="Add tags..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            
            {newResource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {newResource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddResourceDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddResource}
              disabled={!newResource.name || !newResource.url}
            >
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 