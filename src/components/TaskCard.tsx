import { Task, PriorityType, CategoryType } from '../types';
import { 
  Briefcase, 
  User, 
  BookOpen, 
  HeartPulse, 
  Tag, 
  Clock, 
  Calendar,
  AlertTriangle, 
  AlertCircle,
  ArrowDown,
  Edit2, 
  Trash2,
  Check
} from 'lucide-react';

interface TaskCardProps {
  key?: any;
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  
  // Choose priority icon/detail
  const getPriorityInfo = (priority: PriorityType) => {
    switch (priority) {
      case 'high':
        return { label: 'Yuqori', icon: AlertTriangle, className: 'high' };
      case 'medium':
        return { label: 'O‘rta', icon: AlertCircle, className: 'medium' };
      case 'low':
        return { label: 'Past', icon: ArrowDown, className: 'low' };
    }
  };

  // Choose category icon/detail
  const getCategoryInfo = (category: CategoryType) => {
    switch (category) {
      case 'work':
        return { label: 'Ish', icon: Briefcase, className: 'work' };
      case 'personal':
        return { label: 'Shaxsiy', icon: User, className: 'personal' };
      case 'study':
        return { label: 'O‘qish', icon: BookOpen, className: 'study' };
      case 'health':
        return { label: 'Sog‘lik', icon: HeartPulse, className: 'health' };
      case 'other':
        return { label: 'Boshqa', icon: Tag, className: 'other' };
    }
  };

  // Uzbek labels for standard time blocks
  const getTimeBlockLabel = (block: string) => {
    switch (block) {
      case 'morning': return 'Ertalab (06:00-12:00)';
      case 'afternoon': return 'Tushdan so‘ng (12:00-18:00)';
      case 'evening': return 'Kechqurun (18:00-24:00)';
      case 'night': return 'Tun (00:00-06:00)';
      default: return 'Kun davomida';
    }
  };

  const priorityMeta = getPriorityInfo(task.priority);
  const categoryMeta = getCategoryInfo(task.category);
  const PriorityIcon = priorityMeta.icon;
  const CategoryIcon = categoryMeta.icon;

  return (
    <div className={`task-row-card ${task.completed ? 'completed' : ''}`} id={`task_card_element_${task.id}`}>
      
      <div className="task-left-section" id={`task_left_grp_${task.id}`}>
        
        {/* Customized Checkbox Wrapper */}
        <div className="custom-checkbox-wrapper" id={`checkbox_wrap_${task.id}`}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="custom-checkbox-input"
            id={`chk_input_${task.id}`}
          />
          <div className="checkbox-display" onClick={() => onToggleComplete(task.id)} id={`chk_display_${task.id}`}>
            <Check className="checkbox-icon" size={14} strokeWidth={3} />
          </div>
        </div>

        {/* Text information */}
        <div className="task-text-info" id={`task_info_block_${task.id}`}>
          <span className="task-row-title" id={`task_row_title_${task.id}`}>{task.title}</span>
          
          {task.description && (
            <p className="task-row-desc" id={`task_row_desc_${task.id}`}>{task.description}</p>
          )}

          {/* Badges bar */}
          <div className="badges-wrap" id={`badges_wrap_${task.id}`}>
            {/* Priority tag */}
            <span className={`badge badge-priority ${priorityMeta.className}`} id={`badge_prio_${task.id}`}>
              <PriorityIcon size={12} />
              {priorityMeta.label}
            </span>

            {/* Category tag */}
            <span className={`badge badge-category ${categoryMeta.className}`} id={`badge_cat_${task.id}`}>
              <CategoryIcon size={12} />
              {categoryMeta.label}
            </span>

            {/* Date and Time badge */}
            {(task.dueDate || task.dueTime) && (
              <span className="time-badge" id={`time_badge_${task.id}`}>
                <Calendar size={11} />
                {task.dueDate} {task.dueTime && `| ${task.dueTime}`}
              </span>
            )}

            {/* Planner slot allocation */}
            {task.timeBlock && (
              <span className="time-badge" style={{ color: 'var(--color-primary)' }} id={`block_badge_${task.id}`}>
                <Clock size={11} />
                {getTimeBlockLabel(task.timeBlock)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action controls */}
      <div className="task-actions-section" id={`task_actions_${task.id}`}>
        <button
          onClick={() => onEdit(task)}
          className="action-dot-btn edit"
          title="Tahrirlash"
          id={`edit_task_btn_${task.id}`}
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="action-dot-btn delete"
          title="O'chirish"
          id={`delete_task_btn_${task.id}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

    </div>
  );
}
