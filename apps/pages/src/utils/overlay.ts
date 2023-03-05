export default function overlay() {
  const $Overlay = document.getElementsByClassName("overlay")[0];
  function show() {
    $Overlay?.classList?.add("overlay-show");
  }
  function hide() {
    $Overlay?.classList?.remove("overlay-show");
  }
  return { show, hide };
}
