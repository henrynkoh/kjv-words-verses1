import { redirect } from "next/navigation";

export default function Home() {
  // Match the app-like first screen (header + Verse/Compare/All verses).
  redirect("/verse");
}
