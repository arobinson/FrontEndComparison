import { Component } from '@angular/core';
import { FRAMEWORKS, getFrameworkUrl } from 'shared-types';

const CURRENT_FRAMEWORK = 'angular';

@Component({
  selector: 'aff-framework-header',
  templateUrl: './framework-header.html',
  styleUrl: './framework-header.css',
})
export class FrameworkHeader {
  protected readonly currentFramework = CURRENT_FRAMEWORK;
  protected readonly currentFrameworkName = FRAMEWORKS.find((f) => f.id === CURRENT_FRAMEWORK)?.name;

  /** Header links, resolved once from the URL the app was opened at */
  protected readonly links = FRAMEWORKS.map((framework) => ({
    ...framework,
    url: getFrameworkUrl(CURRENT_FRAMEWORK, framework.id, window.location.pathname, window.location.port),
  }));
}
