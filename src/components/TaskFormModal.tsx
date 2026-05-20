import React, { useState, useEffect } from 'react';
import { Task, PriorityType, CategoryType, TimeBlockType } from '../types';
import { X, Calendar, Clock, Edit3, PlusCircle } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  editTask?: Task | null;
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  editTask,
}: TaskFormModalProps) {
  const today = '2026-05-20'; // Based on current ISO time in workspace metadata

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(today);
  const [dueTime, setDueTime] = useState('09:00');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [category, setCategory] = useState<CategoryType>('work');
  const [timeBlock, setTimeBlock] = useState<TimeBlockType>('morning');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '');
      setDescription(editTask.description || '');
      setDueDate(editTask.dueDate || today);
      setDueTime(editTask.dueTime || '09:00');
      setPriority(editTask.priority || 'medium');
      setCategory(editTask.category || 'work');
      setTimeBlock(editTask.timeBlock || 'morning');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(today);
      setDueTime('09:00');
      setPriority('medium');
      setCategory('work');
      setTimeBlock('morning');
    }
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
      category,
      timeBlock,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="task_form_modal_overlay">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        id="task_form_modal_content"
      >
        <div className="modal-header" id="task_form_modal_header">
          <h3 className="modal-title" id="task_form_heading">
            {editTask ? (
              <>
                <Edit3 size={20} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'middle', color: 'var(--color-primary)' }} />
                Vazifani o‘zgartirish
              </>
            ) : (
              <>
                <PlusCircle size={20} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'middle', color: 'var(--color-primary)' }} />
                Yangi reja qo‘shish
              </>
            )}
          </h3>
          <button className="modal-close-btn" onClick={onClose} id="task_form_close_btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" id="task_form_element">
          
          {/* Title */}
          <div className="form-group" id="form_grp_title">
            <label className="form-label" htmlFor="taskTitleInput">Vazifa sarlavhasi *</label>
            <input
              type="text"
              id="taskTitleInput"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Hisobot tayyorlash yoki Kitob o'qish"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="form-group" id="form_grp_desc">
            <label className="form-label" htmlFor="taskDescText">Batafsil izoh (ixtiyoriy)</label>
            <textarea
              id="taskDescText"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vazifa haqida batafsil ma'lumotlar yoki kichik eslatmalar yozishingiz mumkin..."
              maxLength={500}
            />
          </div>

          {/* Category Selector */}
          <div className="form-group" id="form_grp_category">
            <label className="form-label" htmlFor="taskCategorySelect">Kategoriya</label>
            <select
              id="taskCategorySelect"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
            >
              <option value="work">💼 Ish va Vazifalar</option>
              <option value="personal">👤 Shaxsiy ishlar</option>
              <option value="study">📚 O‘qish va Izlanish</option>
              <option value="health">❤️ Sog‘lik va Sport</option>
              <option value="other">🏷️ Boshqa masalalar</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="form-row-2" id="form_grp_datetime">
            <div className="form-group">
              <label className="form-label" htmlFor="taskDateInput">
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Muddati (Sana)
              </label>
              <input
                type="date"
                id="taskDateInput"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="taskTimeInput">
                <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Vaqti (Soat)
              </label>
              <input
                type="time"
                id="taskTimeInput"
                className="form-input"
                value={dueTime}
                onChange={(e) => setKeepOrTime(e.target.value)}
              />
            </div>
          </div>

          {/* Daily Planner Time Block */}
          <div className="form-group" id="form_grp_timeblock">
            <label className="form-label" htmlFor="taskTimeBlockSelect">Kundagi rejalashtirish davri</label>
            <select
              id="taskTimeBlockSelect"
              className="form-select"
              value={timeBlock}
              onChange={(e) => setTimeBlock(e.target.value as TimeBlockType)}
            >
              <option value="morning">🌅 Ertalab (06:00 - 12:00)</option>
              <option value="afternoon">☀️ Tushdan so‘ng (12:00 - 18:00)</option>
              <option value="evening">🌆 Kechqurun (18:00 - 24:00)</option>
              <option value="night">🌌 Tun (00:00 - 06:00)</option>
            </select>
          </div>

          {/* Priority Options */}
          <div className="form-group" id="form_grp_priority">
            <label className="form-label">Muhimlilik darajasi</label>
            <div className="form-radio-group">
              
              <div className="radio-option">
                <input
                  type="radio"
                  id="prio_high"
                  name="priorityGroup"
                  value="high"
                  checked={priority === 'high'}
                  onChange={() => setPriority('high')}
                />
                <label htmlFor="prio_high" className="radio-label" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  🔴 Yuqori
                </label>
              </div>

              <div className="radio-option">
                <input
                  type="radio"
                  id="prio_medium"
                  name="priorityGroup"
                  value="medium"
                  checked={priority === 'medium'}
                  onChange={() => setPriority('medium')}
                />
                <label htmlFor="prio_medium" className="radio-label" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                  🟡 O‘rta
                </label>
              </div>

              <div className="radio-option">
                <input
                  type="radio"
                  id="prio_low"
                  name="priorityGroup"
                  value="low"
                  checked={priority === 'low'}
                  onChange={() => setPriority('low')}
                />
                <label htmlFor="prio_low" className="radio-label" style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                  🔵 Past
                </label>
              </div>

            </div>
          </div>

        </form>

        <div className="modal-footer" id="task_form_actions">
          <button className="accent-button secondary" onClick={onClose} id="cancel_task_btn">
            Bekor qilish
          </button>
          <button 
            type="submit" 
            form="task_form_element" 
            className="accent-button" 
            id="save_task_btn"
          >
            {editTask ? 'O‘zgarishlarni saqlash' : 'Vazifani qo‘shish'}
          </button>
        </div>
      </div>
    </div>
  );

  function setKeepOrTime(val: string) {
    setDueTime(val);
  }
}
