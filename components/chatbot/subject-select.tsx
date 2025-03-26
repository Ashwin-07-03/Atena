"use client";

import { useState } from 'react';
import { studySubjects } from '@/lib/services/chatbot-service';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface SubjectSelectProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (subjectId: string, customTitle?: string) => void;
}

export default function SubjectSelect({ isOpen, onClose, onSelectSubject }: SubjectSelectProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [isCustomTitle, setIsCustomTitle] = useState<boolean>(false);

  const handleSelectSubject = () => {
    if (!selectedSubject) return;
    onSelectSubject(selectedSubject, isCustomTitle ? customTitle : undefined);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSubject("");
    setCustomTitle("");
    setIsCustomTitle(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Study Subject</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {studySubjects.map((subject) => (
              <Button
                key={subject.id}
                variant="outline"
                className={cn(
                  "h-16 justify-start gap-3",
                  selectedSubject === subject.id ? "border-primary bg-primary/10" : ""
                )}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <span className="text-xl">{subject.icon}</span>
                <span>{subject.name}</span>
              </Button>
            ))}
          </div>

          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="custom-title"
                className="rounded border-gray-300"
                checked={isCustomTitle}
                onChange={(e) => setIsCustomTitle(e.target.checked)}
              />
              <label htmlFor="custom-title" className="text-sm">Use custom conversation title</label>
            </div>
            
            {isCustomTitle && (
              <Input
                placeholder="Enter custom title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!selectedSubject}
            onClick={handleSelectSubject}
          >
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 