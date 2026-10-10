// Server Component, rendered inside <head>. Sets data-theme before first
// paint so there is no flash of the wrong theme.
const code = `(function(){try{
  var s=localStorage.getItem('theme');
  var t=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.dataset.theme=t;
}catch(e){document.documentElement.dataset.theme='light'}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
