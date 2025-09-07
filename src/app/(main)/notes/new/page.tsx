'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function NewNotePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isCreating) {
      setIsCreating(true);
      const createNote = async () => {
        try {
          const docRef = await addDoc(collection(db, 'notes'), {
            title: 'Untitled Note',
            content: '',
            tags: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: user.uid,
          });
          toast({ title: "Created new note!" });
          router.replace(`/notes/${docRef.id}`);
        } catch (error) {
          console.error('Error creating new note:', error);
          toast({
            variant: 'destructive',
            title: 'Failed to create note',
            description: 'Please try again later.',
          });
          router.replace('/dashboard');
        }
      };
      createNote();
    }
  }, [user, router, isCreating, toast]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Creating new note...</span>
      </div>
    </div>
  );
}
