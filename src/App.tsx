import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight,
  TrendingUp, 
  FileText, 
  LayoutDashboard, 
  CheckSquare, 
  Smile, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

import { Task, DailyNote, ActiveTab, CategoryType, PriorityType, TimeBlockType } from './types';
import Sidebar from './components/Sidebar';
import Statistics from './components/Statistics';
import TaskCard from './components/TaskCard';
import TaskFormModal from './components/TaskFormModal';
import DailyPlanner from './components/DailyPlanner';
import NotesSection from './components/NotesSection';

// Uzbek dummy tasks for instant premium layout representation on first visit
const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Choraklik hisobot va tahlilini yakunlash',
    description: 'Kompaniya oylik va choraklik natijalari asosida moliyaviy infografik hisobotni tayyorlash',
    dueDate: '2026-05-20',
    dueTime: '11:00',
    priority: 'high',
    category: 'work',
    completed: false,
    timeBlock: 'morning',
    createdAt: '2026-05-20T08:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Sport mashg‘ulotlari (Yugurish va fitnes)',
    description: 'Sog‘lom turmush tarzi uchun fitnes markazida 1 soatlik kardio va jismoniy mashqlar',
    dueDate: '2026-05-20',
    dueTime: '18:30',
    priority: 'medium',
    category: 'health',
    completed: true,
    timeBlock: 'evening',
    createdAt: '2026-05-20T08:00:00Z',
  },
  {
    id: 'task-3',
    title: 'React darsligining 5-modulini ko‘rish',
    description: 'React state optimizatsiyasi darslari va TypeScript integratsiyasi amaliyoti',
    dueDate: '2026-05-20',
    dueTime: '15:00',
    priority: 'medium',
    category: 'study',
    completed: false,
    timeBlock: 'afternoon',
    createdAt: '2026-05-20T08:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Xaridlar ro‘yxati (Oziq-ovqatlar)',
    description: 'Sut, mevalar hamda reja bo‘yicha sabzavot mahsulotlarini supermarketdan sotib olish',
    dueDate: '2026-05-20',
    dueTime: '20:00',
    priority: 'low',
    category: 'personal',
    completed: false,
    timeBlock: 'evening',
    createdAt: '2026-05-20T08:00:00Z',
  }
];

const DEFAULT_NOTES: DailyNote[] = [
  {
    id: 'note-1',
    content: "💡 Kunlik foydali odat:\nKunning muhim rejalarini tongda tuzib oling va tushgacha eng murakkab bo‘lgan 2 ta yuqori muhimlikdagi vazifani tamomlang.",
    createdAt: '2026-05-20',
  },
  {
    id: 'note-2',
    content: "🎯 Kun unumdorligi shiori:\nMuntazamlik - bu muvaffaqiyatning kalitidir. Mukammallikka intilmang, bugun kechagidan yaxshiroq bo‘lish kifoya!",
    createdAt: '2026-05-20',
  }
];

export default function App() {
  // Load initial store
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kunlik_reja_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [notes, setNotes] = useState<DailyNote[]>(() => {
    const saved = localStorage.getItem('kunlik_reja_notes');
    return saved ? JSON.parse(saved) : DEFAULT_NOTES;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kunlik_reja_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityType | 'all'>('all');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Live clock state
  const [liveTime, setLiveTime] = useState('');

  // Apply sync to local storage
  useEffect(() => {
    localStorage.setItem('kunlik_reja_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kunlik_reja_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('kunlik_reja_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Updating clock live
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setLiveTime(`${hrs}:${mins}:${secs}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Uzbek dates algorithm
  const getUzbekDateString = () => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    
    // Use target date from metadata: 2026-05-20. 
    // We can parse the standard modern date
    const d = new Date();
    const dayOfWeek = days[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const yearNum = d.getFullYear();
    
    return `${dayOfWeek}, ${dateNum}-${monthName}, ${yearNum}-yil`;
  };

  const getGreetingMessage = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return 'Xayrli tong! 👋';
    if (hr >= 12 && hr < 18) return 'Xayrli kun! ☀️';
    if (hr >= 18 && hr < 23) return 'Xayrli kech! 🌆';
    return 'Xayrli tun! 🌌';
  };

  // ADD or EDIT task submission
  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    if (editingTask) {
      // Modify task
      setTasks(prev => prev.map(t => t.id === editingTask.id ? {
        ...t,
        ...taskData
      } : t));
      setEditingTask(null);
    } else {
      // Create new
      const newTask: Task = {
        id: 'task_' + Math.random().toString(36).substring(2, 9),
        completed: false,
        createdAt: new Date().toISOString(),
        ...taskData
      };
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleEditTrigger = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Ushbu rejani o'chirib tashlamoqchimisiz?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddTaskInBlock = (block: TimeBlockType) => {
    setEditingTask(null);
    setIsModalOpen(true);
    // Directly pre-fill time block state can be done by utilizing editTask placeholder
    const prefilledTaskPlaceholder: any = {
      title: '',
      description: '',
      dueDate: '2026-05-20',
      dueTime: block === 'morning' ? '08:00' : block === 'afternoon' ? '14:00' : block === 'evening' ? '19:00' : '23:00',
      priority: 'medium',
      category: 'work',
      timeBlock: block
    };
    setEditingTask(prefilledTaskPlaceholder);
  };

  // Sticky Notes logic
  const handleAddNote = () => {
    const newNote: DailyNote = {
      id: 'note_' + Math.random().toString(36).substring(2, 9),
      content: '',
      createdAt: '2026-05-20'
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleUpdateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, content } : note));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Filters calculation
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'completed' && task.completed) || 
                          (statusFilter === 'active' && !task.completed);

    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  return (
    <div className="app-container" id="main_app_layout">
      {/* Sidebar sidebar navigation panel only on desktop */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Workspace Frame */}
      <div className="main-wrapper" id="content_workspace">
        
        {/* Sticky Topbar */}
        <header className="topbar" id="app_topbar">
          <div className="greeting-section" id="greeting_block">
            <h1 className="greeting-title" id="greeting_title_welcome">{getGreetingMessage()}</h1>
            <span className="greeting-subtitle" id="greeting_subtitle_date">{getUzbekDateString()}</span>
          </div>

          <div className="topbar-actions" id="topbar_actions_box">
            <div className="live-time-chip" id="clock_time_chip">
              <span className="pulse-indicator" id="clock_pulse"></span>
              <span id="live_clock_span">{liveTime}</span>
            </div>

            <button 
              className="accent-button" 
              onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
              id="global_add_task_btn"
            >
              <Plus size={16} />
              Reja qo‘shish
            </button>
          </div>
        </header>

        {/* Dynamic Inner Workspace Content */}
        <main className="content-container" id="inner_container">
          
          {/* TAB 1: Boshqaruv paneli (Dashboard Overview) */}
          {activeTab === 'dashboard' && (
            <div className="tab-view-animation" id="tab_dashboard_view" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="section-header">
                <h2 className="section-title">
                  <LayoutDashboard size={20} style={{ color: 'var(--color-primary)' }} />
                  Boshqaruv paneli
                </h2>
              </div>

              <div className="dashboard-grid">
                {/* Left Column: Stats + Dynamic lists */}
                <div className="bento-column">
                  
                  {/* Statistics Widgets Row */}
                  <div className="stats-row" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                      <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Jami rejalar</span>
                        <span style={{ fontSize: '30px', fontWeight: 'bold', fontFamily: 'var(--font-family-mono)' }}>{tasks.length}</span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Faol va yakunlanganlar</div>
                      </div>
                      <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--color-success)' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Bajarildi</span>
                        <span style={{ fontSize: '30px', fontWeight: 'bold', color: 'var(--color-success)', fontFamily: 'var(--font-family-mono)' }}>
                          {tasks.filter(t => t.completed).length}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Yaxshi natija!</div>
                      </div>
                      <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--color-warning)' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Bajarilishi kutilmoqda</span>
                        <span style={{ fontSize: '30px', fontWeight: 'bold', color: 'var(--color-warning)', fontFamily: 'var(--font-family-mono)' }}>
                          {tasks.filter(t => !t.completed).length}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Faol vazifalar soni</div>
                      </div>
                    </div>
                  </div>

                  {/* Todo list on Dashboard with quick filter */}
                  <div className="premium-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 className="card-title" style={{ margin: 0 }}>
                        <CheckSquare size={18} style={{ color: 'var(--color-primary)' }} />
                        Bugungi dolzarb rejalar ({filteredTasks.length})
                      </h3>
                      <button 
                        onClick={() => setActiveTab('tasks')} 
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Barchasini ko‘rish <ArrowRight size={14} />
                      </button>
                    </div>

                    {/* Shared Filter Component on Dashboard */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Vazifalardan izlash..."
                        style={{
                          background: 'var(--bg-hover)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '8px 12px',
                          fontSize: '13px',
                          flex: 1,
                          outline: 'none'
                        }}
                      />
                      <select 
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        style={{
                          background: 'var(--bg-hover)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          padding: '8px',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      >
                        <option value="all">Barcha muhimliklar</option>
                        <option value="high">Yuqori</option>
                        <option value="medium">O‘rta</option>
                        <option value="low">Past</option>
                      </select>
                    </div>

                    <div className="tasks-container-grid">
                      {filteredTasks.length > 0 ? (
                        filteredTasks.slice(0, 5).map(task => (
                          <TaskCard 
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleComplete}
                            onEdit={handleEditTrigger}
                            onDelete={handleDeleteTask}
                          />
                        ))
                      ) : (
                        <div className="empty-state">
                          <Smile size={32} style={{ color: 'var(--text-muted)' }} />
                          <h4 className="empty-state-title">Mos keluvchi rejalar topilmadi</h4>
                          <p style={{ fontSize: '13px' }}>Yangi vazifalar ro‘yxatini qo‘shish uchun yuqoridagi tugmadan foydalaning.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column: Mini Planner Timeline Summary */}
                <div className="bento-column" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className="premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 className="card-title" style={{ margin: 0 }}>
                        <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                        Reja taqvimi (Kunlik)
                      </h3>
                      <button 
                        onClick={() => setActiveTab('planner')} 
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                      >
                        Kengaytirish
                      </button>
                    </div>

                    {/* Timeline Summary Blocks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      {[
                        { id: 'morning' as TimeBlockType, name: 'Ertalabgi reja', time: '06:00 - 12:00', color: 'var(--color-warning)' },
                        { id: 'afternoon' as TimeBlockType, name: 'Tushdan keyingi reja', time: '12:00 - 18:00', color: 'var(--color-category-work)' },
                        { id: 'evening' as TimeBlockType, name: 'Kechki reja', time: '18:00 - 24:00', color: 'var(--color-category-study)' },
                        { id: 'night' as TimeBlockType, name: 'Tungi reja', time: '00:00 - 06:00', color: 'var(--color-category-health)' }
                      ].map(block => {
                        const count = tasks.filter(t => t.timeBlock === block.id).length;
                        const doneCount = tasks.filter(t => t.timeBlock === block.id && t.completed).length;

                        return (
                          <div 
                            key={block.id} 
                            style={{ 
                              padding: '12px 16px', 
                              backgroundColor: 'var(--bg-hover)', 
                              borderRadius: '8px',
                              borderLeft: `4px solid ${block.color}`,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600 }}>{block.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{block.time}</div>
                            </div>
                            <span style={{ fontSize: '12px', fontFamily: 'var(--font-family-mono)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                              {doneCount} / {count} bajarildi
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Vazifalar ro‘yxati (Extended Filterable Tasks list) */}
          {activeTab === 'tasks' && (
            <div className="tab-view-animation" id="tab_tasks_list_view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="section-header">
                <h2 className="section-title">
                  <CheckSquare size={20} style={{ color: 'var(--color-primary)' }} />
                  Barcha vazifalar
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Jami topildi: <strong>{filteredTasks.length}</strong> ta vazifa
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="filter-search-widget">
                <div className="search-box">
                  <Search size={18} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Vazifalardan matn bo‘yicha izlang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="tasks_search_input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="filter-pills" id="status_filter_pills">
                  {[
                    { id: 'all', label: 'Hammasi' },
                    { id: 'active', label: 'Faol' },
                    { id: 'completed', label: 'Bajarilgan' }
                  ].map(pill => (
                    <button
                      key={pill.id}
                      className={`pill-btn ${statusFilter === pill.id ? 'active' : ''}`}
                      onClick={() => setStatusFilter(pill.id as any)}
                      id={`pill_filter_${pill.id}`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority & Category Filtering Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Kategoriyalar bo‘yicha filtrlash
                </div>
                <div className="category-filters">
                  <span 
                    className={`cat-chip all ${categoryFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('all')}
                  >
                    🚀 Hammasi
                  </span>
                  <span 
                    className={`cat-chip work ${categoryFilter === 'work' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('work')}
                  >
                    💼 Ish va Vazifalar
                  </span>
                  <span 
                    className={`cat-chip personal ${categoryFilter === 'personal' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('personal')}
                  >
                    👤 Shaxsiy
                  </span>
                  <span 
                    className={`cat-chip study ${categoryFilter === 'study' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('study')}
                  >
                    📚 O‘qish
                  </span>
                  <span 
                    className={`cat-chip health ${categoryFilter === 'health' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('health')}
                  >
                    ❤️ Sog‘lik
                  </span>
                  <span 
                    className={`cat-chip other ${categoryFilter === 'other' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('other')}
                  >
                    🏷️ Boshqa
                  </span>
                </div>
              </div>

              {/* Real Tasks Grid */}
              <div className="tasks-container-grid">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTrigger}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <CheckSquare size={44} style={{ color: 'var(--text-muted)' }} />
                    <span className="empty-state-title">Siz qidirgan mezonlar bo‘yicha reja topilmadi</span>
                    <p style={{ fontSize: '13px' }}>Filtr sozlamalarini tozalashga harakat qiling yoki yangi eslatma reja yarating.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Kunlik reja (Four block planner layout) */}
          {activeTab === 'planner' && (
            <div className="tab-view-animation" id="tab_daily_planner_view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="section-header">
                <h2 className="section-title">
                  <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
                  Kunlik reja taqvimi
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Kuningizni vaqt guruhlari bo‘yicha tizimlashtiring
                </div>
              </div>

              <DailyPlanner
                tasks={tasks}
                onAddTaskInBlock={handleAddTaskInBlock}
                onEditTask={handleEditTrigger}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          )}

          {/* TAB 4: Statistika (Visual analytics and charts) */}
          {activeTab === 'analytics' && (
            <div className="tab-view-animation" id="tab_analytics_chart_view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="section-header">
                <h2 className="section-title">
                  <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} />
                  Samaradorlik statistikasi
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Vazifalaringizni bajarilish statistikasi va tahliliy hisoboti
                </div>
              </div>

              <Statistics tasks={tasks} />
            </div>
          )}

          {/* TAB 5: Eslatmalar (Notepad stickers synced dynamically) */}
          {activeTab === 'notes' && (
            <div className="tab-view-animation" id="tab_notes_view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="section-header">
                <h2 className="section-title">
                  <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                  Kreativ eslatmalar va g‘oyalar
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Miyangizni bo‘shating, barcha daho fikrlarni qayd qiling
                </div>
              </div>

              <NotesSection
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          )}

        </main>
      </div>

      {/* MOBILE DEVICE COMPANION: Floating Bottom Navigator bar */}
      <nav className="mobile-nav-bar" id="mobile_navbar">
        <button 
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          id="mobile_tab_dash"
        >
          <LayoutDashboard size={20} />
          <span className="mobile-nav-item-text">Bosh sahifa</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
          id="mobile_tab_tasks"
        >
          <CheckSquare size={20} />
          <span className="mobile-nav-item-text">Vazifalar</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'planner' ? 'active' : ''}`}
          onClick={() => setActiveTab('planner')}
          id="mobile_tab_planner"
        >
          <Calendar size={20} />
          <span className="mobile-nav-item-text">Taqvim</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          id="mobile_tab_stats"
        >
          <TrendingUp size={20} />
          <span className="mobile-nav-item-text">Tahlillar</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
          id="mobile_tab_notes"
        >
          <FileText size={20} />
          <span className="mobile-nav-item-text">Eslatmalar</span>
        </button>
      </nav>

      {/* Task Modal Overlay integration */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        editTask={editingTask}
      />

    </div>
  );
}
