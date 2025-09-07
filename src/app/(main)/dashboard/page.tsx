
import { NoteList } from '@/components/note-list';

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const { tag } = searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {tag ? `Notes tagged with "${tag}"` : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {tag
            ? `Showing all notes with the tag "${tag}".`
            : 'Here are your most recent notes.'}
        </p>
      </div>
      <NoteList tag={tag} />
    </div>
  );
}
