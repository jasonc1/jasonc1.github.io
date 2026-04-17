import { useLocation } from 'react-router-dom';
import { projectMeta } from './projectMeta';
import './ProjectBar.scss';

export const ProjectBar = () => {
  const { pathname } = useLocation();
  const meta = projectMeta[pathname];

  if (!meta) return null;

  return (
    <div className="project-bar">
      <span className="project-bar__name">{meta.name}</span>
      <span className="project-bar__meta">
        {meta.role} · {meta.duration}
      </span>
    </div>
  );
};
