import { useEffect, useState } from 'react';
import './StatsCards.css';

export default function StatsCards({ students }) {
  const [animatedValues, setAnimatedValues] = useState({ total: 0, avgGpa: 0, courses: 0 });

  const stats = {
    total: students.length,
    avgGpa: students.length > 0
      ? (students.reduce((sum, s) => sum + (s.gpa || 0), 0) / students.filter(s => s.gpa != null).length).toFixed(2)
      : '0.00',
    courses: new Set(students.map(s => s.course)).size,
  };

  useEffect(() => {
    // Animate numbers on mount
    const duration = 800;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedValues({
        total: Math.round(stats.total * eased),
        avgGpa: (parseFloat(stats.avgGpa) * eased).toFixed(2),
        courses: Math.round(stats.courses * eased),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [students.length]);

  const cards = [
    {
      id: 'stat-total',
      label: 'Total Students',
      value: animatedValues.total,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      gradient: 'stat-gradient-blue',
    },
    {
      id: 'stat-gpa',
      label: 'Average GPA',
      value: animatedValues.avgGpa,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      gradient: 'stat-gradient-purple',
    },
    {
      id: 'stat-courses',
      label: 'Active Courses',
      value: animatedValues.courses,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      gradient: 'stat-gradient-cyan',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div
          key={card.id}
          className={`stat-card glass-card ${card.gradient}`}
          id={card.id}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="stat-icon-wrap">{card.icon}</div>
          <div className="stat-info">
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
          <div className="stat-bg-decoration" />
        </div>
      ))}
    </div>
  );
}
