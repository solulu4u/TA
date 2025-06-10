import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  PenTool, 
  Headphones, 
  MessageSquare, 
  BookMarked, 
  FileText,
  Mic,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Reading', href: '/dashboard/lessons/reading', icon: BookOpen },
  { name: 'Writing', href: '/dashboard/lessons/writing', icon: PenTool },
  { name: 'Listening', href: '/dashboard/lessons/listening', icon: Headphones },
  { name: 'Speaking', href: '/dashboard/lessons/speaking', icon: MessageSquare },
  { name: 'Dictation', href: '/dashboard/dictation', icon: Mic },
  { name: 'Vocabulary', href: '/dashboard/lessons/vocabulary', icon: BookMarked },
  { name: 'Grammar', href: '/dashboard/lessons/grammar', icon: FileText },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

const Sidebar: React.FC = () => {
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl border-r border-slate-200">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;