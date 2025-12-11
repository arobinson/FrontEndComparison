import { Component } from '@angular/core';
import { FRAMEWORKS, getFrameworkUrl } from 'shared-types';

const CURRENT_FRAMEWORK = 'angular';

@Component({
  selector: 'aff-framework-header',
  standalone: true,
  templateUrl: './framework-header.html',
  styleUrl: './framework-header.css',
})
export class FrameworkHeader {
  protected readonly frameworks = FRAMEWORKS;
  protected readonly currentFramework = CURRENT_FRAMEWORK;
  protected readonly currentFrameworkName = FRAMEWORKS.find((f) => f.id === CURRENT_FRAMEWORK)?.name;

  protected getUrl(frameworkId: string): string {
    return getFrameworkUrl(
      CURRENT_FRAMEWORK,
      frameworkId,
      window.location.pathname,
      window.location.port
    );
  }
}
