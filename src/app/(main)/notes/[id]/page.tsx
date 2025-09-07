import { NoteEditor } from "@/components/note-editor";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Note } from "@/types";

async function getNote(id: string) {
    const noteDoc = await getDoc(doc(db, 'notes', id));

    if (!noteDoc.exists()) {
        return null;
    }

    return { id: noteDoc.id, ...noteDoc.data() } as Note;
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
