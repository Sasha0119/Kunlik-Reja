import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  theme,
  setTheme,
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard' as ActiveTab, text: 'Boshqaruv paneli', icon: LayoutDashboard },
    { id: 'tasks' as ActiveTab, text: 'Vazifalar ro‘yxati', icon: CheckSquare },
    { id: 'planner' as ActiveTab, text: 'Kunlik reja', icon: Calendar },
    { id: 'analytics' as ActiveTab, text: 'Statistika', icon: TrendingUp },
    { id: 'notes' as ActiveTab, text: 'Eslatmalar', icon: FileText },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar_container">
      <div className="sidebar-header" id="sidebar_header">
        <div className="brand-container" id="brand_container">
          <div className="brand-icon" id="brand_logo_icon">
            <Sparkles size={20} />
          </div>
          {!isCollapsed && <span className="brand-name" id="brand_text">Kunlik Reja</span>}
        </div>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Sidebar-ni kengaytirish" : "Sidebar-ni yig'ish"}
          id="sidebar_collapse_btn"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <ul className="sidebar-menu" id="sidebar_menu_list">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <li key={item.id} id={`menu_item_li_${item.id}`}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                id={`menu_button_${item.id}`}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
              >
                <IconComponent size={20} />
                {!isCollapsed && <span className="menu-item-text">{item.text}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer" id="sidebar_footer">
        <div className="theme-toggle-container" id="theme_toggle_box">
          <button
            className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Yorug' rejim"
            id="theme_light_btn"
          >
            <Sun size={16} />
            {!isCollapsed && <span>Yorug'</span>}
          </button>
          <button
            className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Tungi rejim"
            id="theme_dark_btn"
          >
            <Moon size={16} />
            {!isCollapsed && <span>Tungi</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
