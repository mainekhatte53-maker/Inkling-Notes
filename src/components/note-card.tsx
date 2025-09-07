'use client';

import { Note } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type NoteCardProps = {
  note: Note;
};

export function NoteCard({ note }: NoteCardProps) {
  const contentPreview = note.content.substring(0, 100).replace(/#|>/g, '').trim();

  return (
    <Link href={`/notes/${note.id}`} className="block h-full">
      <Card className="flex flex-col h-full transition-shadow duration-200 hover:shadow-md hover:border-primary/50">
        <CardHeader>
          <CardTitle className="truncate">{note.title}</CardTitle>
          <CardDescription>
            Updated{' '}
            {note.updatedAt
              ? formatDistanceToNow(note.updatedAt.toDate(), { addSuffix: true })
              : 'just now'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {contentPreview}...
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
                <Badge variant="outline">+{note.tags.length - 3}</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
