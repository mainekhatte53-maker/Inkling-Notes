'use client';

import { Note } from '@/types';
import { NoteCard } from './note-card';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';

// A mock note to display as a placeholder
const now = Timestamp.now();
const mockNote: Note = {
  id: '1',
  title: 'Welcome to Inkling Notes!',
  content: 'This is a sample note. You can start creating your own notes by using the "New Note" button in the sidebar. Your actual notes are not being loaded right now.',
  tags: ['welcome', 'sample'],
  createdAt: now,
  updatedAt: now,
  userId: 'mock-user',
};

export function NoteList() {
  const router = useRouter();

  const handleNewNote = () => {
    // Note creation might still fail if permissions are incorrect,
    // but this component will no longer crash the app.
    router.push('/notes/new');
  };
  
  return (
    <div>
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 py-10 text-center mb-6">
        <h3 className="text-xl font-semibold tracking-tight text-destructive-foreground">
          Note Loading is Disabled
        </h3>
        <p className="mt-2 text-sm text-destructive-foreground/80">
          The application is currently unable to load notes from the database due to a permission error.
          The note below is an example. Please use the sidebar to create a new note.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <NoteCard note={mockNote} />
      </div>
    </div>
  );
}
