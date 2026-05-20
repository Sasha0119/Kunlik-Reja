import { DailyNote } from '../types';
import { Plus, Trash2, Calendar, FileText } from 'lucide-react';

interface NotesSectionProps {
  notes: DailyNote[];
  onAddNote: () => void;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export default function NotesSection({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesSectionProps) {
  
  return (
    <div className="notes-container" id="notes_container_root" style={{ width: '100%' }}>
      <div className="notes-grid" id="notes_cards_layout">
        
        {/* Render Notes */}
        {notes.map((note) => (
          <div className="note-card" key={note.id} id={`note_card_${note.id}`}>
            <textarea
              className="note-textarea"
              value={note.content}
              onChange={(e) => onUpdateNote(note.id, e.target.value)}
              placeholder="Eslatma matnini bu yerga yozing..."
              title="Avtomatik ravishda saqlanadi"
              id={`note_text_${note.id}`}
            />
            <div className="note-footer" id={`note_footer_${note.id}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} />
                {note.createdAt}
              </span>
              <button
                className="note-delete"
                onClick={() => onDeleteNote(note.id)}
                title="Eslatmani o'chirish"
                id={`note_del_btn_${note.id}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Note Card Dotted Dials */}
        <button className="add-note-dashed" onClick={onAddNote} id="add_sticky_note_btn">
          <Plus size={24} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Yangi yopishqoq eslatma</span>
        </button>

      </div>

      {notes.length === 0 && (
        <div 
          className="empty-state" 
          style={{ marginTop: '24px', background: 'var(--bg-secondary)', borderStyle: 'solid' }}
          id="notes_empty_placeholder"
        >
          <FileText size={40} style={{ color: 'var(--text-muted)' }} />
          <span className="empty-state-title">Hozircha hech qanday eslatma yo‘q</span>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Muhim g‘oyalar, fikrlar yoki tezkor qaydlarni yozish uchun yopishqoq eslatma qo‘shing.
          </p>
        </div>
      )}
    </div>
  );
}
