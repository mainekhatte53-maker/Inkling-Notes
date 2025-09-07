
'use client';

import { Note } from '@/types';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { NoteCard } from './note-card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export function NoteList() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    };

    setIsLoading(true);
    const notesQuery = query(
      collection(db, 'notes'), 
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(notesQuery, (querySnapshot) => {
      const notesData: Note[] = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() } as Note);
      });
      setNotes(notesData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching notes:", error);
      toast({
        variant: 'destructive',
        title: 'Error fetching notes',
        description: 'Please check your permissions and try again.'
      })
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleNewNote = async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        title: 'Untitled Note',
        content: '',
        tags: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      });
      toast({ title: 'Created new note!' });
      router.push(`/notes/${docRef.id}`);
    } catch (error) {
      console.error('Error creating new note:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create note',
        description: 'Please try again later.',
      });
    } finally {
      setIsCreating(false);
    }
  };

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
        <Button onClick={handleNewNote} disabled={isCreating} className="mt-4">
          Create Note
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
