'use client';

import { Note } from '@/types';
import { Timestamp } from 'firebase/firestore';
import { NoteCard } from './note-card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import Link from 'next/link';

// This is a mock. In a real app, this would come from a Firestore query.
const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Inkling Notes',
    content:
      'This is your first note. You can edit it, add tags, and more. Use markdown for rich text formatting!',
    tags: ['getting-started', 'welcome'],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    userId: '123',
  },
  {
    id: '2',
    title: 'Brainstorming new project ideas',
    content:
      '- A "smart" to-do list that learns your habits.\n- A recipe app that suggests meals based on ingredients you have.\n- A personal finance tracker with AI insights.',
    tags: ['ideas', 'projects'],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    userId: '123',
  },
  {
    id: '3',
    title: 'Meeting Notes - Q2 Planning',
    content:
      "## Key Takeaways\n*   Finalize marketing budget by EOW.\n*   John to lead the new 'Phoenix' initiative.\n*   Team retreat scheduled for August.",
    tags: ['work', 'meetings'],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    userId: '123',
  },
];

export function NoteList() {
  const notes = dummyNotes;
  const isLoading = false; // Set to true to see skeleton loaders

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
        <h3 className="text-xl font-semibold tracking-tight">
          You have no notes yet
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first note.
        </p>
        <Button asChild className="mt-4">
          <Link href="/notes/new">Create Note</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
