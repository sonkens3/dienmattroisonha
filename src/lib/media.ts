export function isPlayableVideoUrl(url?: string) {
  return Boolean(url && (url.startsWith("blob:") || /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)));
}
