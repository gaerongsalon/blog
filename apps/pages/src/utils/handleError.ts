export default function handleError(error: Error) {
  console.error(error);
  alert(error.message);
  // window.location.href = "/";
}
