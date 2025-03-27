"use client";

import { v4 as uuidv4 } from 'uuid';

// Types for collaboration features
export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: Date;
  isOnline?: boolean;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  createdAt: Date;
  createdBy: string;
  members: string[]; // User IDs
  isPublic: boolean;
  tags: string[];
  avatar?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  readBy: string[]; // User IDs
  attachments?: Array<{
    id: string;
    type: "image" | "document" | "link";
    name: string;
    url: string;
  }>;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  pinned?: boolean;
  groupId?: string; // If this is a group conversation
}

export interface SharedResource {
  id: string;
  type: "document" | "image" | "link";
  name: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: Date;
  createdBy: User;
  size?: string;
  tags: string[];
  downloads: number;
}

export interface SharedCalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  groupId?: string;
  createdBy: string;
  attendees: string[]; // User IDs
  reminders: Date[];
}

export interface SharedNote {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  groupId: string;
  contributors: string[]; // User IDs
  tags: string[];
}

export interface ProjectBoard {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  columns: ProjectColumn[];
}

export interface ProjectColumn {
  id: string;
  title: string;
  cards: ProjectCard[];
  order: number;
}

export interface ProjectCard {
  id: string;
  title: string;
  description?: string;
  assignees: string[]; // User IDs
  dueDate?: Date;
  labels: string[];
  attachments?: SharedResource[];
  comments: {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
  }[];
  order: number;
}

// Mock data for testing and development
let currentUser: User = {
  id: 'user-1',
  name: 'Current User',
  email: 'user@example.com',
  avatar: '/avatars/user.jpg',
  status: 'online',
  isOnline: true,
};

const mockUsers: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: 'Emma S',
    email: 'emma@example.com',
    avatar: '/avatars/emma.jpg',
    status: 'online',
    lastSeen: new Date(),
    isOnline: true,
  },
  {
    id: 'user-3',
    name: 'Liam K',
    email: 'liam@example.com',
    avatar: '/avatars/liam.jpg',
    status: 'busy',
    lastSeen: new Date(),
    isOnline: false,
  },
  {
    id: 'user-4',
    name: 'Sophia T',
    email: 'sophia@example.com',
    avatar: '/avatars/sophia.jpg',
    status: 'offline',
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isOnline: true,
  },
  {
    id: 'user-5',
    name: 'Noah P',
    email: 'noah@example.com',
    avatar: '/avatars/noah.jpg',
    status: 'away',
    lastSeen: new Date(),
    isOnline: true,
  },
];

const mockStudyGroups: StudyGroup[] = [
  {
    id: 'group-1',
    name: 'Physics Study Group',
    description: 'Weekly sessions covering quantum mechanics and relativity',
    subject: 'Physics',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    createdBy: 'user-2',
    members: ['user-1', 'user-2', 'user-3', 'user-4'],
    isPublic: true,
    tags: ['physics', 'quantum mechanics', 'relativity'],
    avatar: '/study-groups/physics.jpg',
  },
  {
    id: 'group-2',
    name: 'Computer Science Club',
    description: 'Algorithm practice and project collaborations',
    subject: 'Computer Science',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    createdBy: 'user-5',
    members: ['user-1', 'user-5'],
    isPublic: true,
    tags: ['algorithms', 'data structures', 'programming'],
    avatar: '/study-groups/cs.jpg',
  },
];

let conversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    title: 'Direct Conversation',
    createdAt: new Date('2023-06-10T10:00:00'),
    updatedAt: new Date('2023-06-15T14:30:00'),
    createdBy: 'user-1',
    participants: [currentUser, mockUsers[1]],
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-2',
        senderName: 'Emma S',
        content: 'Hey, how\'s your physics study going?',
        timestamp: new Date('2023-06-15T14:20:00'),
        readBy: ['user-1', 'user-2'],
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'user-1',
        senderName: 'Current User',
        content: 'Pretty good! I\'m working on those relativity problems now.',
        timestamp: new Date('2023-06-15T14:25:00'),
        readBy: ['user-1', 'user-2'],
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'user-2',
        senderName: 'Emma S',
        content: 'That would be great! No rush, but if you could get back to me by tomorrow that would be perfect.',
        timestamp: new Date('2023-06-15T14:30:00'),
        readBy: ['user-1', 'user-2'],
      },
    ],
    unreadCount: 0,
    pinned: true,
  },
  {
    id: 'conv-2',
    type: 'group',
    title: 'Study Group - Physics',
    createdAt: new Date('2023-06-05T09:00:00'),
    updatedAt: new Date('2023-06-14T16:45:00'),
    createdBy: 'user-3',
    participants: [
      mockUsers.find(u => u.id === 'user-1') || currentUser,
      mockUsers.find(u => u.id === 'user-3') || mockUsers[2],
      mockUsers.find(u => u.id === 'user-4') || mockUsers[3]
    ],
    messages: [
      {
        id: 'msg-4',
        conversationId: 'conv-2',
        senderId: 'user-3',
        senderName: 'Liam K',
        content: 'I\'ve shared some notes on quantum mechanics in the resources. Check them out when you have time.',
        timestamp: new Date('2023-06-14T16:40:00'),
        readBy: ['user-3'],
      },
      {
        id: 'msg-5',
        conversationId: 'conv-2',
        senderId: 'user-4',
        senderName: 'Sophia T',
        content: 'Thanks, Liam! I\'ll take a look before our next session.',
        timestamp: new Date('2023-06-14T16:45:00'),
        readBy: ['user-3', 'user-4'],
      },
    ],
    unreadCount: 2,
  },
  {
    id: 'conv-3',
    type: 'direct',
    createdAt: new Date('2023-05-20T11:00:00'),
    updatedAt: new Date('2023-06-13T10:15:00'),
    createdBy: 'user-1',
    participants: [currentUser, mockUsers[4]],
    messages: [
      {
        id: 'msg-6',
        conversationId: 'conv-3',
        senderId: 'user-5',
        senderName: 'Noah P',
        content: 'Have you started on the assignment yet?',
        timestamp: new Date('2023-06-13T10:10:00'),
        readBy: ['user-5'],
      },
      {
        id: 'msg-7',
        conversationId: 'conv-3',
        senderId: 'user-1',
        senderName: 'Current User',
        content: 'Just started. It\'s more complex than I expected. Want to collaborate?',
        timestamp: new Date('2023-06-13T10:15:00'),
        readBy: ['user-1'],
      },
    ],
    unreadCount: 1,
  },
];

let sharedResources: SharedResource[] = [
  {
    id: 'res-1',
    type: 'document',
    name: 'Physics Study Guide - Fall 2023.pdf',
    url: 'https://example.com/resources/physics-guide.pdf',
    thumbnailUrl: '/thumbnails/pdf.png',
    createdAt: new Date('2023-06-10T14:30:00'),
    createdBy: mockUsers[2],
    size: '4.2 MB',
    tags: ['physics', 'study guide', 'notes'],
    downloads: 0,
  },
  {
    id: 'res-2',
    type: 'image',
    name: 'Quantum Mechanics Diagram.jpg',
    url: 'https://example.com/resources/quantum-diagram.jpg',
    thumbnailUrl: 'https://example.com/thumbnails/quantum-diagram.jpg',
    createdAt: new Date('2023-06-14T09:15:00'),
    createdBy: mockUsers[1],
    size: '1.8 MB',
    tags: ['physics', 'diagram', 'quantum'],
    downloads: 0,
  },
  {
    id: 'res-3',
    type: 'document',
    name: 'Chemistry Lab Report Template.docx',
    url: 'https://example.com/resources/chem-template.docx',
    thumbnailUrl: '/thumbnails/docx.png',
    createdAt: new Date('2023-06-05T11:45:00'),
    createdBy: mockUsers[3],
    size: '320 KB',
    tags: ['chemistry', 'template', 'lab report'],
    downloads: 0,
  },
  {
    id: 'res-4',
    type: 'link',
    name: 'Khan Academy - Quantum Physics',
    url: 'https://www.khanacademy.org/science/physics/quantum-physics',
    createdAt: new Date('2023-06-12T16:30:00'),
    createdBy: currentUser,
    tags: ['physics', 'resource', 'learning'],
    downloads: 0,
  },
];

let sharedCalendarEvents: SharedCalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Quantum Mechanics Review',
    description: 'Weekly session covering wave functions and probabilities',
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 17.5 * 60 * 60 * 1000), // Tomorrow at 5:30 PM
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // Tomorrow at 7:00 PM
    location: 'Zoom Meeting',
    groupId: 'group-1',
    createdBy: 'user-2',
    attendees: ['user-1', 'user-2', 'user-3', 'user-4'],
    reminders: [
      new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 16.5 * 60 * 60 * 1000), // 1 hour before
    ],
  },
];

// Collection storage
let users = [...mockUsers];
let studyGroups = [...mockStudyGroups];
let friendRequests: FriendRequest[] = [];
let sharedNotes: SharedNote[] = [];
let projectBoards: ProjectBoard[] = [];

// Service methods for data management
// User related methods
export function getCurrentUser(): User {
  return currentUser;
}

export function getUserById(userId: string): User | undefined {
  return users.find(user => user.id === userId);
}

export function getFriends(): User[] {
  // In this mock version, we're considering all users as friends for simplicity
  return users.filter(user => user.id !== currentUser.id);
}

export function updateUserStatus(userId: string, status: User['status']): void {
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      status,
      lastSeen: status === 'offline' ? new Date() : undefined,
      isOnline: status === 'online',
    };
  }
}

// Friend requests
export function sendFriendRequest(recipientId: string): FriendRequest {
  const request: FriendRequest = {
    id: uuidv4(),
    senderId: currentUser.id,
    recipientId,
    status: 'pending',
    createdAt: new Date(),
  };
  friendRequests.push(request);
  return request;
}

export function getPendingFriendRequests(): FriendRequest[] {
  return friendRequests.filter(
    req => req.recipientId === currentUser.id && req.status === 'pending'
  );
}

export function respondToFriendRequest(requestId: string, accept: boolean): void {
  const requestIndex = friendRequests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    friendRequests[requestIndex].status = accept ? 'accepted' : 'rejected';
  }
}

// Study groups
export function getStudyGroups(): StudyGroup[] {
  return studyGroups;
}

export function getUserStudyGroups(): StudyGroup[] {
  return studyGroups.filter(group => group.members.includes(currentUser.id));
}

export function getStudyGroupById(groupId: string): StudyGroup | undefined {
  return studyGroups.find(group => group.id === groupId);
}

export function createStudyGroup(groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'createdBy'>): StudyGroup {
  const newGroup: StudyGroup = {
    ...groupData,
    id: uuidv4(),
    createdAt: new Date(),
    createdBy: currentUser.id,
  };
  studyGroups.push(newGroup);
  return newGroup;
}

export function joinStudyGroup(groupId: string): boolean {
  const groupIndex = studyGroups.findIndex(group => group.id === groupId);
  if (groupIndex !== -1) {
    if (!studyGroups[groupIndex].members.includes(currentUser.id)) {
      studyGroups[groupIndex].members.push(currentUser.id);
    }
    return true;
  }
  return false;
}

export function leaveStudyGroup(groupId: string): boolean {
  const groupIndex = studyGroups.findIndex(group => group.id === groupId);
  if (groupIndex !== -1) {
    studyGroups[groupIndex].members = studyGroups[groupIndex].members.filter(
      id => id !== currentUser.id
    );
    return true;
  }
  return false;
}

// Conversations and messages
export function getConversations(): Conversation[] {
  return conversations;
}

export function getConversationById(conversationId: string): Conversation | undefined {
  return conversations.find(conv => conv.id === conversationId);
}

export function getDirectConversation(userId: string): Conversation | undefined {
  return conversations.find(
    conv => 
      conv.type === 'direct' && 
      conv.participants.some(p => p.id === userId) && 
      conv.participants.some(p => p.id === currentUser.id)
  );
}

export function createDirectConversation(userId: string): Conversation {
  const target = getUserById(userId);
  if (!target) throw new Error("User not found");
  
  // Check if conversation already exists
  const existingConv = conversations.find(conv => 
    conv.type === "direct" && 
    conv.participants.some(p => p.id === userId) &&
    conv.participants.some(p => p.id === currentUser.id)
  );
  
  if (existingConv) return existingConv;
  
  // Create new conversation
  const newConversation: Conversation = {
    id: `conv-${uuidv4()}`,
    type: "direct",
    title: 'Direct Conversation',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: currentUser.id,
    participants: [currentUser, target],
    messages: [],
    unreadCount: 0,
  };
  
  conversations = [newConversation, ...conversations];
  return newConversation;
}

export function getGroupConversation(groupId: string): Conversation | undefined {
  return conversations.find(
    conv => 
      conv.type === 'group' && 
      conv.groupId === groupId && 
      conv.participants.some(p => p.id === currentUser.id)
  );
}

export function sendMessage(conversationId: string, content: string): Message | null {
  const conversation = getConversationById(conversationId);
  if (!conversation) return null;
  
  const newMessage: Message = {
    id: `msg-${uuidv4()}`,
    conversationId,
    senderId: currentUser.id,
    senderName: currentUser.name,
    content,
    timestamp: new Date(),
    readBy: [currentUser.id]
  };
  
  // Update conversation
  conversation.messages.push(newMessage);
  conversation.updatedAt = new Date();
  
  // In a real app, this would trigger a server update
  return newMessage;
}

export function markMessagesAsRead(conversationId: string): void {
  const conversation = getConversationById(conversationId);
  if (!conversation) return;
  
  conversation.messages.forEach(message => {
    if (!message.readBy.includes(currentUser.id)) {
      message.readBy.push(currentUser.id);
    }
  });
  
  conversation.unreadCount = 0;
}

// Shared resources
export function getSharedResources(groupId?: string): SharedResource[] {
  if (!groupId) return sharedResources;
  return sharedResources.filter(resource => resource.tags.includes(groupId));
}

export function addSharedResource(resource: {
  type: "document" | "image" | "link";
  name: string;
  url: string;
  thumbnailUrl?: string;
  size?: string;
  tags: string[];
}): SharedResource {
  const newResource: SharedResource = {
    id: `res-${uuidv4()}`,
    ...resource,
    createdAt: new Date(),
    createdBy: currentUser,
    downloads: 0,
  };
  
  sharedResources = [newResource, ...sharedResources];
  return newResource;
}

export function downloadResource(resourceId: string): SharedResource | undefined {
  const resourceIndex = sharedResources.findIndex(resource => resource.id === resourceId);
  if (resourceIndex !== -1) {
    sharedResources[resourceIndex].downloads += 1;
    return sharedResources[resourceIndex];
  }
  return undefined;
}

// Calendar events
export function getSharedCalendarEvents(groupId?: string): SharedCalendarEvent[] {
  if (groupId) {
    return sharedCalendarEvents.filter(event => event.groupId === groupId);
  }
  return sharedCalendarEvents.filter(event => 
    event.attendees.includes(currentUser.id)
  );
}

export function createCalendarEvent(event: Omit<SharedCalendarEvent, 'id' | 'createdBy'>): SharedCalendarEvent {
  const newEvent: SharedCalendarEvent = {
    ...event,
    id: uuidv4(),
    createdBy: currentUser.id,
  };
  sharedCalendarEvents.push(newEvent);
  return newEvent;
}

export function updateCalendarEvent(eventId: string, updates: Partial<SharedCalendarEvent>): SharedCalendarEvent | undefined {
  const eventIndex = sharedCalendarEvents.findIndex(
    event => event.id === eventId && (event.createdBy === currentUser.id || event.attendees.includes(currentUser.id))
  );
  
  if (eventIndex !== -1) {
    sharedCalendarEvents[eventIndex] = {
      ...sharedCalendarEvents[eventIndex],
      ...updates,
    };
    return sharedCalendarEvents[eventIndex];
  }
  return undefined;
}

// Shared notes
export function getSharedNotes(groupId: string): SharedNote[] {
  return sharedNotes.filter(note => note.groupId === groupId);
}

export function createSharedNote(note: Omit<SharedNote, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'contributors'>): SharedNote {
  const newNote: SharedNote = {
    ...note,
    id: uuidv4(),
    createdBy: currentUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    contributors: [currentUser.id],
  };
  sharedNotes.push(newNote);
  return newNote;
}

export function updateSharedNote(noteId: string, updates: Partial<SharedNote>): SharedNote | undefined {
  const noteIndex = sharedNotes.findIndex(note => note.id === noteId);
  
  if (noteIndex !== -1) {
    // Add current user to contributors if not already there
    if (!sharedNotes[noteIndex].contributors.includes(currentUser.id)) {
      sharedNotes[noteIndex].contributors.push(currentUser.id);
    }
    
    sharedNotes[noteIndex] = {
      ...sharedNotes[noteIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return sharedNotes[noteIndex];
  }
  return undefined;
}

// Project boards
export function getProjectBoards(groupId: string): ProjectBoard[] {
  return projectBoards.filter(board => board.groupId === groupId);
}

export function createProjectBoard(board: Omit<ProjectBoard, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'columns'>): ProjectBoard {
  const newBoard: ProjectBoard = {
    ...board,
    id: uuidv4(),
    createdBy: currentUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    columns: [
      {
        id: uuidv4(),
        title: 'To Do',
        cards: [],
        order: 0,
      },
      {
        id: uuidv4(),
        title: 'In Progress',
        cards: [],
        order: 1,
      },
      {
        id: uuidv4(),
        title: 'Done',
        cards: [],
        order: 2,
      },
    ],
  };
  projectBoards.push(newBoard);
  return newBoard;
}

export function addCardToProjectBoard(boardId: string, columnId: string, card: Omit<ProjectCard, 'id' | 'comments' | 'order'>): ProjectCard | undefined {
  const boardIndex = projectBoards.findIndex(board => board.id === boardId);
  if (boardIndex === -1) return undefined;
  
  const columnIndex = projectBoards[boardIndex].columns.findIndex(column => column.id === columnId);
  if (columnIndex === -1) return undefined;
  
  const newCard: ProjectCard = {
    ...card,
    id: uuidv4(),
    comments: [],
    order: projectBoards[boardIndex].columns[columnIndex].cards.length,
  };
  
  projectBoards[boardIndex].columns[columnIndex].cards.push(newCard);
  projectBoards[boardIndex].updatedAt = new Date();
  
  return newCard;
}

export function updateCardInProjectBoard(boardId: string, columnId: string, cardId: string, updates: Partial<ProjectCard>): ProjectCard | undefined {
  const boardIndex = projectBoards.findIndex(board => board.id === boardId);
  if (boardIndex === -1) return undefined;
  
  const columnIndex = projectBoards[boardIndex].columns.findIndex(column => column.id === columnId);
  if (columnIndex === -1) return undefined;
  
  const cardIndex = projectBoards[boardIndex].columns[columnIndex].cards.findIndex(card => card.id === cardId);
  if (cardIndex === -1) return undefined;
  
  projectBoards[boardIndex].columns[columnIndex].cards[cardIndex] = {
    ...projectBoards[boardIndex].columns[columnIndex].cards[cardIndex],
    ...updates,
  };
  
  projectBoards[boardIndex].updatedAt = new Date();
  
  return projectBoards[boardIndex].columns[columnIndex].cards[cardIndex];
}

export function addCommentToCard(boardId: string, columnId: string, cardId: string, content: string): { id: string; userId: string; content: string; createdAt: Date } | undefined {
  const boardIndex = projectBoards.findIndex(board => board.id === boardId);
  if (boardIndex === -1) return undefined;
  
  const columnIndex = projectBoards[boardIndex].columns.findIndex(column => column.id === columnId);
  if (columnIndex === -1) return undefined;
  
  const cardIndex = projectBoards[boardIndex].columns[columnIndex].cards.findIndex(card => card.id === cardId);
  if (cardIndex === -1) return undefined;
  
  const newComment = {
    id: uuidv4(),
    userId: currentUser.id,
    content,
    createdAt: new Date(),
  };
  
  projectBoards[boardIndex].columns[columnIndex].cards[cardIndex].comments.push(newComment);
  projectBoards[boardIndex].updatedAt = new Date();
  
  return newComment;
}

// Socket.io connection mock (in a real app, this would use actual WebSockets)
let socketCallbacks: {
  onConnect?: () => void;
  onMessage?: (message: Message) => void;
  onDisconnect?: () => void;
} = {};

export function connectToCollaborationServer(
  onConnect?: () => void,
  onMessage?: (message: Message) => void,
  onDisconnect?: () => void
): void {
  socketCallbacks = {
    onConnect,
    onMessage,
    onDisconnect
  };
  
  // Simulate connection success
  setTimeout(() => {
    socketCallbacks.onConnect?.();
  }, 500);
}

export function disconnectFromCollaborationServer(): void {
  socketCallbacks.onDisconnect?.();
  socketCallbacks = {};
}

// This function would be called by the server in a real app
// Here we use it to simulate receiving messages
export function simulateIncomingMessage(senderId: string, conversationId: string, content: string): void {
  const sender = getUserById(senderId);
  if (!sender) return;
  
  const conversation = getConversationById(conversationId);
  if (!conversation) return;
  
  const newMessage: Message = {
    id: `msg-${uuidv4()}`,
    conversationId,
    senderId,
    senderName: sender.name,
    content,
    timestamp: new Date(),
    readBy: [senderId]
  };
  
  conversation.messages.push(newMessage);
  conversation.updatedAt = new Date();
  conversation.unreadCount++;
  
  socketCallbacks.onMessage?.(newMessage);
} 