import { For } from 'solid-js';
import { FRAMEWORKS, getFrameworkUrl } from 'shared-types';
import './FrameworkHeader.css';

const CURRENT_FRAMEWORK = 'solid';

export default function FrameworkHeader() {
  return (
    <header class="framework-header">
      <span class="current-framework">
        {FRAMEWORKS.find((f) => f.id === CURRENT_FRAMEWORK)?.name}
      </span>
      <nav class="framework-nav">
        <For each={FRAMEWORKS}>
          {(framework) => (
            <a
              href={getFrameworkUrl(CURRENT_FRAMEWORK, framework.id, window.location.pathname, window.location.port)}
              class={`framework-link ${framework.id === CURRENT_FRAMEWORK ? 'active' : ''}`}
              style={{ '--framework-color': framework.color }}
            >
              {framework.name}
            </a>
          )}
        </For>
      </nav>
    </header>
  );
}
