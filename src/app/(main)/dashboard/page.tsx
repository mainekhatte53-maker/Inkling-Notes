
import { NoteList } from '@/components/note-list';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Here are your most recent notes.
        </p>
      </div>
      <NoteList />
    </div>
  );
}
