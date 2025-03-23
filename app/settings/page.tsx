'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  
  // State for form values
  const [accountForm, setAccountForm] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    studentId: 'STU-123456',
    phone: '(555) 123-4567',
    program: 'Computer Science'
  });
  
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailAssignments: true,
    emailGrades: true,
    emailReminders: true,
    pushAssignments: true,
    pushGrades: true,
    pushReminders: false
  });
  
  const [appPreferences, setAppPreferences] = useState({
    theme: 'system',
    language: 'english',
    startPage: 'dashboard',
    calendarView: 'week'
  });

  // Handlers
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPreferences(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppPreferences(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="card animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">
            Settings
          </h2>
          <p className="text-foreground/70">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-background rounded-lg p-1 flex space-x-1 border border-border animate-slide-up">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
              activeTab === 'account'
                ? 'bg-accent text-foreground'
                : 'text-foreground/70 hover:bg-secondary'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'bg-accent text-foreground'
                : 'text-foreground/70 hover:bg-secondary'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
              activeTab === 'preferences'
                ? 'bg-accent text-foreground'
                : 'text-foreground/70 hover:bg-secondary'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        {/* Account Settings Tab Content */}
        {activeTab === 'account' && (
          <div className="card animate-scale-in">
            <h3 className="text-lg font-semibold mb-6">
              Account Information
            </h3>
            
            <div className="space-y-4">
              <div className="focus-ring stagger-item animate-slide-up opacity-0">
                <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={accountForm.name}
                  onChange={handleAccountChange}
                  className="input"
                />
              </div>
              
              <div className="focus-ring stagger-item animate-slide-up opacity-0">
                <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={accountForm.email}
                  onChange={handleAccountChange}
                  className="input"
                />
              </div>
              
              <div className="focus-ring stagger-item animate-slide-up opacity-0">
                <label htmlFor="studentId" className="block text-sm font-medium text-foreground/70 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={accountForm.studentId}
                  onChange={handleAccountChange}
                  className="input"
                />
              </div>
              
              <div className="focus-ring stagger-item animate-slide-up opacity-0">
                <label htmlFor="phone" className="block text-sm font-medium text-foreground/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={accountForm.phone}
                  onChange={handleAccountChange}
                  className="input"
                />
              </div>
              
              <div className="focus-ring stagger-item animate-slide-up opacity-0">
                <label htmlFor="program" className="block text-sm font-medium text-foreground/70 mb-1">
                  Program/Major
                </label>
                <input
                  type="text"
                  id="program"
                  name="program"
                  value={accountForm.program}
                  onChange={handleAccountChange}
                  className="input"
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3 stagger-item animate-slide-up opacity-0">
                <button className="btn-secondary">
                  Cancel
                </button>
                <button className="btn-primary hover-lift">
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-border">
              <h4 className="text-md font-medium mb-4">
                Security
              </h4>
              
              <div className="space-y-4">
                <button className="btn-secondary hover-lift">
                  Change Password
                </button>
                
                <p className="text-sm text-foreground/70">
                  Last password change: 45 days ago
                </p>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-border">
              <h4 className="text-md font-medium text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h4>
              
              <div>
                <button className="px-4 py-2 bg-background text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors hover-lift">
                  Delete Account
                </button>
                
                <p className="mt-2 text-sm text-foreground/70">
                  This action cannot be undone. All your data will be permanently removed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div className="card animate-scale-in">
            <h3 className="text-lg font-semibold mb-6">
              Notification Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium mb-4">
                  Email Notifications
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between stagger-item animate-slide-up opacity-0">
                    <div>
                      <div className="text-sm font-medium">Assignment Updates</div>
                      <div className="text-xs text-foreground/70">Receive emails about new and updated assignments</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="emailAssignments"
                        className="sr-only peer" 
                        checked={notificationPreferences.emailAssignments}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between stagger-item animate-slide-up opacity-0">
                    <div>
                      <div className="text-sm font-medium">Grade Updates</div>
                      <div className="text-xs text-foreground/70">Receive emails when grades are posted</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="emailGrades"
                        className="sr-only peer" 
                        checked={notificationPreferences.emailGrades}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between stagger-item animate-slide-up opacity-0">
                    <div>
                      <div className="text-sm font-medium">Reminders</div>
                      <div className="text-xs text-foreground/70">Receive email reminders about upcoming deadlines</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="emailReminders"
                        className="sr-only peer" 
                        checked={notificationPreferences.emailReminders}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <h4 className="text-md font-medium mb-4">
                  Push Notifications
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between stagger-item animate-slide-up opacity-0">
                    <div>
                      <div className="text-sm font-medium">Assignment Updates</div>
                      <div className="text-xs text-foreground/70">Receive push notifications about new and updated assignments</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="pushAssignments"
                        className="sr-only peer" 
                        checked={notificationPreferences.pushAssignments}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between stagger-item animate-slide-up opacity-0">
                    <div>
                      <div className="text-sm font-medium">Grade Updates</div>
                      <div className="text-xs text-foreground/70">Receive push notifications when grades are posted</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="pushGrades"
                        className="sr-only peer" 
                        checked={notificationPreferences.pushGrades}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between stagger-item animate-slide-up opacity-0">
                    <div>
                      <div className="text-sm font-medium">Reminders</div>
                      <div className="text-xs text-foreground/70">Receive push reminders about upcoming deadlines</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="pushReminders"
                        className="sr-only peer" 
                        checked={notificationPreferences.pushReminders}
                        onChange={handleNotificationChange}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end stagger-item animate-slide-up opacity-0">
                <button className="btn-primary hover-lift">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab Content */}
        {activeTab === 'preferences' && (
          <div className="card animate-scale-in">
            <h3 className="text-lg font-semibold mb-6">
              App Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="focus-ring stagger-item animate-slide-up opacity-0">
                  <label htmlFor="theme" className="block text-sm font-medium text-foreground/70 mb-1">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={appPreferences.theme}
                    onChange={handleSelectChange}
                    className="input"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div className="focus-ring stagger-item animate-slide-up opacity-0">
                  <label htmlFor="language" className="block text-sm font-medium text-foreground/70 mb-1">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={appPreferences.language}
                    onChange={handleSelectChange}
                    className="input"
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>
                
                <div className="focus-ring stagger-item animate-slide-up opacity-0">
                  <label htmlFor="startPage" className="block text-sm font-medium text-foreground/70 mb-1">
                    Start Page
                  </label>
                  <select
                    id="startPage"
                    name="startPage"
                    value={appPreferences.startPage}
                    onChange={handleSelectChange}
                    className="input"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="schedules">Schedules</option>
                    <option value="grades">Grades</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>
                
                <div className="focus-ring stagger-item animate-slide-up opacity-0">
                  <label htmlFor="calendarView" className="block text-sm font-medium text-foreground/70 mb-1">
                    Default Calendar View
                  </label>
                  <select
                    id="calendarView"
                    name="calendarView"
                    value={appPreferences.calendarView}
                    onChange={handleSelectChange}
                    className="input"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border">
                <h4 className="text-md font-medium mb-4">
                  Advanced Options
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center stagger-item animate-slide-up opacity-0">
                    <input
                      id="showCompleted"
                      name="showCompleted"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary/30 border-border rounded"
                    />
                    <label htmlFor="showCompleted" className="ml-2 block text-sm text-foreground/70">
                      Show completed tasks in lists
                    </label>
                  </div>
                  
                  <div className="flex items-center stagger-item animate-slide-up opacity-0">
                    <input
                      id="enableSync"
                      name="enableSync"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary/30 border-border rounded"
                      defaultChecked
                    />
                    <label htmlFor="enableSync" className="ml-2 block text-sm text-foreground/70">
                      Enable background data sync
                    </label>
                  </div>
                  
                  <div className="flex items-center stagger-item animate-slide-up opacity-0">
                    <input
                      id="enableAnimations"
                      name="enableAnimations"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary/30 border-border rounded"
                      defaultChecked
                    />
                    <label htmlFor="enableAnimations" className="ml-2 block text-sm text-foreground/70">
                      Enable UI animations
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end stagger-item animate-slide-up opacity-0">
                <button className="btn-primary hover-lift">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 