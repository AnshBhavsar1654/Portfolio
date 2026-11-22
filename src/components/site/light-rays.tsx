// Decorative beams fixed behind every page (mounted once in the root layout). Pure CSS (see styles/folio/rays.css):
// no JS, no canvas, nothing for assistive tech to read.
export function LightRays() {
  return (
    <div aria-hidden className="light-rays">
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
