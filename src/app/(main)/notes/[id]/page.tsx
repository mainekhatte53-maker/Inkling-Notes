'use client';

import { NoteEditor } from '@/components/note-editor';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Note } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

export default function NotePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // Don't fetch if user is not logged in.
      // The main layout will handle redirecting.
      return;
    }

    const getNote = async () => {
      try {
        const noteDoc = await getDoc(doc(db, 'notes', params.id));

        if (!noteDoc.exists()) {
          setError('Note not found.');
          return;
        }
        
        const noteData = { id: noteDoc.id, ...noteDoc.data() } as Note;

        if (noteData.userId !== user.uid) {
            setError('You do not have permission to view this note.');
            return;
        }

        setNote(noteData);
      } catch (e: any) {
        console.error('Error fetching note:', e);
        setError('Failed to load note. ' + e.message);
      } finally {
        setLoading(false);
      }
    };

    getNote();
  }, [params.id, user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Note not found</h2>
        <p className="text-muted-foreground">This note may have been deleted or never existed.</p>
      </div>
    );
  }


  return <NoteEditor initialNote={note} />;
}
