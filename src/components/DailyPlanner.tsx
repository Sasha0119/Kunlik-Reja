import { Task, TimeBlockType } from '../types';
import { Sunset, Sunrise, Sun, Moon, Plus, CheckCircle, Clock } from 'lucide-react';

interface DailyPlannerProps {
  tasks: Task[];
  onAddTaskInBlock: (block: TimeBlockType) => void;
  onEditTask: (task: Task) => void;
  onToggleComplete: (id: string) => void;
}

export default function DailyPlanner({
  tasks,
  onAddTaskInBlock,
  onEditTask,
  onToggleComplete,
}: DailyPlannerProps) {
  
  const blocks: { id: TimeBlockType; title: string; span: string; icon: any; color: string }[] = [
    { id: 'morning', title: 'Ertalab', span: '06:00 - 12:00', icon: Sunrise, color: 'var(--color-warning)' },
    { id: 'afternoon', title: 'Tushdan so‘ng', span: '12:00 - 18:00', icon: Sun, color: 'var(--color-category-work)' },
    { id: 'evening', title: 'Kechqurun', span: '18:00 - 24:00', icon: Sunset, color: 'var(--color-category-study)' },
    { id: 'night', title: 'Tun', span: '00:00 - 06:00', icon: Moon, color: 'var(--color-category-health)' },
  ];

  return (
    <div className="planner-grid" id="planner_blocks_grid">
      {blocks.map((block) => {
        const BlockIcon = block.icon;
        const blockTasks = tasks.filter(t => t.timeBlock === block.id);

        return (
          <div className="time-block-card" key={block.id} id={`time_block_box_${block.id}`}>
            <div className="time-block-header" id={`time_block_header_${block.id}`}>
              <h4 className="time-block-title" id={`time_block_title_lbl_${block.id}`}>
                <BlockIcon size={18} style={{ color: block.color }} />
                {block.title}
              </h4>
              <span className="time-block-span">{block.span}</span>
            </div>

            <div className="planner-list-items" id={`planner_task_list_${block.id}`}>
              {blockTasks.length > 0 ? (
                blockTasks.map((t) => (
                  <div 
                    className="planner-task-item" 
                    key={t.id}
                    onClick={() => onEditTask(t)}
                    style={{ 
                      borderColor: block.color,
                      opacity: t.completed ? 0.6 : 1,
                      textDecoration: t.completed ? 'line-through' : 'none'
                    }}
                    title="Tahrirlash uchun bosing"
                    id={`planner_block_item_${t.id}`}
                  >
                    <div className="planner-task-title" id={`planner_item_title_${t.id}`}>
                      {t.title}
                    </div>
                    
                    <div className="planner-task-meta" id={`planner_item_meta_${t.id}`}>
                      <span className={`planner-tag ${t.priority}`} id={`prio_tag_${t.id}`}>
                        {t.priority === 'high' ? 'Yuqori' : t.priority === 'medium' ? 'O‘rta' : 'Past'}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(t.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: t.completed ? 'var(--color-success)' : 'var(--text-muted)'
                        }}
                        title={t.completed ? "Bajarilmagan deb belgilash" : "Bajarilgan deb belgilash"}
                        id={`planner_prio_toggle_btn_${t.id}`}
                      >
                        {t.completed ? <CheckCircle size={14} /> : <Clock size={14} />}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="planner-no-tasks" id={`planner_empty_lbl_${block.id}`}>
                  Ushbu vaqtda rejalar yo‘q
                </div>
              )}
            </div>

            <button
              className="accent-button secondary"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                fontSize: '12px',
                padding: '8px 12px',
                marginTop: '6px'
              }}
              onClick={() => onAddTaskInBlock(block.id)}
              id={`planner_add_btn_block_${block.id}`}
            >
              <Plus size={14} />
              Reja qo‘shish
            </button>
          </div>
        );
      })}
    </div>
  );
}
