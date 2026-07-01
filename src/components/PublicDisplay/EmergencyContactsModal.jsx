import React from 'react';
import { X, Phone, Shield, Ambulance, Flame } from 'lucide-react';

export const EmergencyContactsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const contacts = [
    { title: 'National Emergency', number: '112', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Police', number: '100', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Fire Service', number: '101', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Ambulance', number: '102', icon: Ambulance, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Disaster Management', number: '108', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Women Safety', number: '1091', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500" />
              Emergency Contacts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tap a number to call immediately</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 grid gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {contacts.map((contact, index) => (
            <a 
              key={index}
              href={`tel:${contact.number}`}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${contact.bg} ${contact.color}`}>
                  <contact.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{contact.title}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Government Toll Free</div>
                </div>
              </div>
              <div className="text-lg font-black text-slate-700 dark:text-slate-200 tracking-wider group-hover:text-red-500 transition-colors">
                {contact.number}
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/20 text-center">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">Use these numbers only in case of emergency.</p>
        </div>

      </div>
    </div>
  );
};
