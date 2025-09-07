'use client';

import type { Note } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TagInput } from './tag-input';
import { doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { suggestTags } from '@/ai/ai-tag-suggestion';

type NoteEditorProps = {
  initialNote: Note;
};

export function NoteEditor({ initialNote: note }: NoteEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);
  const debouncedTags = useDebounce(tags, 500);

  const saveNote = useCallback(async (newTitle: string, newContent: string, newTags: string[]) => {
    setIsSaving(true);
    try {
      const noteRef = doc(db, 'notes', note.id);
      await updateDoc(noteRef, {
        title: newTitle,
        content: newContent,
        tags: newTags,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save note',
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsSaving(false);
    }
  }, [note.id, toast]);

  useEffect(() => {
    // This effect handles saving debounced changes.
    // We check against the original note prop to avoid saving on initial load.
    if (debouncedTitle !== note.title || debouncedContent !== note.content || JSON.stringify(debouncedTags) !== JSON.stringify(note.tags)) {
      saveNote(debouncedTitle, debouncedContent, debouncedTags);
    }
  }, [debouncedTitle, debouncedContent, debouncedTags, note, saveNote]);


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'notes', note.id));
      toast({ title: 'Note deleted' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting note:', error);
      setIsDeleting(false);
      toast({
        variant: 'destructive',
        title: 'Failed to delete note',
      });
    }
  };

  const handleSuggestTags = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestTags({ noteContent: content });
      if (result.tags) {
        // Merge without duplicates
        const newTags = [...new Set([...tags, ...result.tags])];
        setTags(newTags);
      }
    } catch (error) {
      console.error('Error suggesting tags:', error);
      toast({
        variant: 'destructive',
        title: 'AI Tag Suggestion Failed',
        description: 'Could not get suggestions. Please try again later.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground w-20 text-right">
                {isSaving ? 'Saving...' : 'Saved'}
            </div>
            <Button variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggesting || !content}>
                {isSuggesting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest Tags
            </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" /> }
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex-grow space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="text-3xl font-bold tracking-tight border-none shadow-none focus-visible:ring-0 px-0 h-auto"
        />

        <TagInput tags={tags} setTags={setTags} />

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="min-h-[50vh] text-base border-none shadow-none focus-visible:ring-0 px-0 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
