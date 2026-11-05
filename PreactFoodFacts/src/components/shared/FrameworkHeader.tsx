import type { CSSProperties } from 'preact';
import { FRAMEWORKS, getFrameworkUrl } from 'shared-types';
import './FrameworkHeader.css';

const CURRENT_FRAMEWORK = 'preact';

export default function FrameworkHeader() {
  return (
    <header className="framework-header">
      <span className="current-framework">
        {FRAMEWORKS.find((f) => f.id === CURRENT_FRAMEWORK)?.name}
      </span>
      <nav className="framework-nav">
        {FRAMEWORKS.map((framework) => (
          <a
            key={framework.id}
            href={getFrameworkUrl(CURRENT_FRAMEWORK, framework.id, window.location.pathname, window.location.port)}
            className={`framework-link ${framework.id === CURRENT_FRAMEWORK ? 'active' : ''}`}
            style={{ '--framework-color': framework.color } as CSSProperties}
          >
            {framework.name}
          </a>
        ))}
      </nav>
    </header>
  );
}
