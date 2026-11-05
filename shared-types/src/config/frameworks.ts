export interface FrameworkConfig {
  id: string;
  name: string;
  devPort: number;
  color: string;
}

export const FRAMEWORKS: FrameworkConfig[] = [
  { id: 'angular', name: 'Angular', devPort: 3005, color: '#dd0031' },
  { id: 'react', name: 'React', devPort: 3002, color: '#61dafb' },
  { id: 'svelte', name: 'Svelte', devPort: 3003, color: '#ff3e00' },
  { id: 'solid', name: 'Solid', devPort: 3004, color: '#2c4f7c' },
  { id: 'lit', name: 'Lit', devPort: 3006, color: '#325cff' },
  { id: 'vue', name: 'Vue', devPort: 3007, color: '#42b883' },
  { id: 'preact', name: 'Preact', devPort: 3008, color: '#673ab8' },
  { id: 'vue-vapor', name: 'Vue Vapor', devPort: 3009, color: '#35495e' },
];

export const PERF_SERVER_PORT = 8888;

export function getFrameworkUrl(
  currentFrameworkId: string,
  targetFrameworkId: string,
  currentPath: string,
  port: string
): string {
  const isPerf = port === String(PERF_SERVER_PORT);
  const targetFramework = FRAMEWORKS.find((f) => f.id === targetFrameworkId);

  if (!targetFramework) {
    return currentPath;
  }

  if (isPerf) {
    // In perf mode: /angular/list -> /react/list
    const pathMatch = currentPath.match(/\/[^/]+(\/.*)/) || [null, '/list'];
    const subPath = pathMatch[1] || '/list';
    return `/${targetFrameworkId}${subPath}`;
  } else {
    // In dev mode: strip current base path and redirect to other port
    // Handle paths like /list or /detail/123
    const pathParts = currentPath.split('/').filter(Boolean);
    const subPath = pathParts.length > 0 ? `/${pathParts.join('/')}` : '/list';
    return `http://localhost:${targetFramework.devPort}${subPath}`;
  }
}
