import { redirect } from "next/navigation";

/** Redirects direct visits to /play/results back to the game. */
export default function ResultsRedirect() {
  redirect("/play");
}
