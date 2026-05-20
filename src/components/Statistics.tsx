import { Task } from '../types';
import { 
  CheckCircle, 
  Clock, 
  BarChart2, 
  AlertTriangle,
  Bookmark,
  TrendingUp
} from 'lucide-react';

interface StatisticsProps {
  tasks: Task[];
}

export default function Statistics({ tasks }: StatisticsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority count
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;

  const completedHigh = tasks.filter(t => t.priority === 'high' && t.completed).length;
  const completedMedium = tasks.filter(t => t.priority === 'medium' && t.completed).length;
  const completedLow = tasks.filter(t => t.priority === 'low' && t.completed).length;

  // Category count
  const categories = {
    work: tasks.filter(t => t.category === 'work').length,
    personal: tasks.filter(t => t.category === 'personal').length,
    study: tasks.filter(t => t.category === 'study').length,
    health: tasks.filter(t => t.category === 'health').length,
    other: tasks.filter(t => t.category === 'other').length,
  };

  // SVG parameters
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="statistics-wrap" id="statistics_component_wrap" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      
      {/* Bento Stats Panel */}
      <div className="stats-summary" id="stats_items_grid">
        <div className="stat-item" id="stat_total">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-num">{total}</span>
            <BarChart2 size={24} style={{ color: 'var(--color-primary)' }} />
          </div>
          <span className="stat-label">Jami rejalar</span>
        </div>

        <div className="stat-item" id="stat_completed">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-num" style={{ color: 'var(--color-success)' }}>{completed}</span>
            <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
          </div>
          <span className="stat-label">Bajarildi</span>
        </div>

        <div className="stat-item" id="stat_pending">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-num" style={{ color: 'var(--color-warning)' }}>{pending}</span>
            <Clock size={24} style={{ color: 'var(--color-warning)' }} />
          </div>
          <span className="stat-label">Kutilmoqda</span>
        </div>
      </div>

      {/* Circle progress bar component */}
      <div className="progress-circular-container" id="radial_progress_panel">
        <div className="progress-text-block" id="progress_text_block">
          <span className="progress-percent" id="progress_percent_val">{percentage}%</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Bugungi samaradorlik</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {percentage === 100 
              ? 'Ajoyib natija! Barcha vazifalar bajarildi.' 
              : percentage >= 50 
              ? 'Yaxshi samaradorlik, yarmi ortda qoldi.' 
              : total === 0 
              ? 'Hali vazifalar qo‘shilmagan.' 
              : 'Kunni samarali boshlash vaqti keldi.'}
          </span>
        </div>
        <div className="progress-svg-wrap" id="progress_svg_con">
          <svg width="80" height="80" viewBox="0 0 80 80" id="progress_radial_svg">
            <circle 
              className="progress-svg-circle-bg" 
              cx="40" 
              cy="40" 
              r={radius} 
            />
            <circle 
              className="progress-svg-circle-fg" 
              cx="40" 
              cy="40" 
              r={radius} 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        </div>
      </div>

      {/* Priority Analytics breakdown */}
      <div className="premium-card" id="priority_breakdown_card" style={{ marginTop: '10px' }}>
        <h3 className="card-title" id="priority_card_title">
          <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
          Muvofiqlik va Muhimlik Tahlili
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="priority_metrics">
          {/* High Priority bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} id="metric_high">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} id="metric_labels_high">
              <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>Yuqori daraja</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-family-mono)' }}>
                {completedHigh} / {highPriority}
              </span>
            </div>
            <div style={{ background: 'var(--bg-hover)', height: '8px', borderRadius: '4px', overflow: 'hidden' }} id="track_high">
              <div 
                style={{ 
                  background: 'var(--color-danger)', 
                  height: '100%', 
                  width: `${highPriority > 0 ? (completedHigh / highPriority) * 100 : 0}%`,
                  transition: 'width 0.6s ease'
                }} 
                id="bar_high"
              />
            </div>
          </div>

          {/* Medium Priority bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} id="metric_medium">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} id="metric_labels_medium">
              <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>O‘rta daraja</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-family-mono)' }}>
                {completedMedium} / {mediumPriority}
              </span>
            </div>
            <div style={{ background: 'var(--bg-hover)', height: '8px', borderRadius: '4px', overflow: 'hidden' }} id="track_medium">
              <div 
                style={{ 
                  background: 'var(--color-warning)', 
                  height: '100%', 
                  width: `${mediumPriority > 0 ? (completedMedium / mediumPriority) * 100 : 0}%`,
                  transition: 'width 0.6s ease'
                }} 
                id="bar_medium"
              />
            </div>
          </div>

          {/* Low Priority bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} id="metric_low">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} id="metric_labels_low">
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Past daraja</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-family-mono)' }}>
                {completedLow} / {lowPriority}
              </span>
            </div>
            <div style={{ background: 'var(--bg-hover)', height: '8px', borderRadius: '4px', overflow: 'hidden' }} id="track_low">
              <div 
                style={{ 
                  background: 'var(--color-primary)', 
                  height: '100%', 
                  width: `${lowPriority > 0 ? (completedLow / lowPriority) * 100 : 0}%`,
                  transition: 'width 0.6s ease'
                }} 
                id="bar_low"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category distribution widgets */}
      <div className="premium-card" id="category_breakdown_card">
        <h3 className="card-title" id="category_card_title">
          <Bookmark size={18} style={{ color: 'var(--color-primary)' }} />
          Kategoriyalar bo‘yicha
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} id="category_bars_list">
          {[
            { key: 'work', label: 'Ish', color: 'var(--color-category-work)', count: categories.work },
            { key: 'personal', label: 'Shaxsiy', color: 'var(--color-category-personal)', count: categories.personal },
            { key: 'study', label: 'Mavzu kashfi (O‘qish)', color: 'var(--color-category-study)', count: categories.study },
            { key: 'health', label: 'Sog‘lik va sport', color: 'var(--color-category-health)', count: categories.health },
            { key: 'other', label: 'Boshqa', color: 'var(--color-category-other)', count: categories.other },
          ].map((cat) => {
            const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
            return (
              <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }} id={`cat_row_${cat.key}`}>
                <span style={{ fontSize: '13px', width: '130px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {cat.label}
                </span>
                <div style={{ flex: 1, backgroundColor: 'var(--bg-hover)', height: '6px', borderRadius: '3px', position: 'relative' }}>
                  <div 
                    style={{ 
                      backgroundColor: cat.color, 
                      height: '100%', 
                      width: `${pct}%`,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }} 
                  />
                </div>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-family-mono)', color: 'var(--text-secondary)', width: '40px', textAlign: 'right' }}>
                  {cat.count} ta
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
