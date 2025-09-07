import { NoteEditor } from "@/components/note-editor";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function getNote(id: string) {
    // This is a placeholder for fetching a single note.
    // In a real app you'd fetch from Firestore `doc(db, 'notes', id)`
    // and handle loading/error states.
    // Here we return a mock note for demonstration.
    if (id === '1' || id === '2' || id === '3') {
        const { Timestamp } = await import('firebase/firestore');
        const dummyNotes: any = {
            '1': {
                id: '1',
                title: 'Welcome to Inkling Notes',
                content: 'This is your first note. You can edit it, add tags, and more. Use markdown for rich text formatting!',
                tags: ['getting-started', 'welcome'],
            },
            '2': {
                id: '2',
                title: 'Brainstorming new project ideas',
                content: '- A "smart" to-do list that learns your habits.\n- A recipe app that suggests meals based on ingredients you have.\n- A personal finance tracker with AI insights.',
                tags: ['ideas', 'projects'],
            },
            '3': {
                id: '3',
                title: 'Meeting Notes - Q2 Planning',
                content: "## Key Takeaways\n*   Finalize marketing budget by EOW.\n*   John to lead the new 'Phoenix' initiative.\n*   Team retreat scheduled for August.",
                tags: ['work', 'meetings'],
            },
        }
        return {
            ...dummyNotes[id],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            userId: '123'
        };
    }
    return null;
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(params.id);

  if (!note) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Note not found</h2>
        <p className="text-muted-foreground">This note may have been deleted or never existed.</p>
      </div>
    );
  }

  return <NoteEditor note={note} />;
}
