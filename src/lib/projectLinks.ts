export function getProjectHref(projectId: string) {
  return `/project-detail?id=${encodeURIComponent(projectId)}`;
}
