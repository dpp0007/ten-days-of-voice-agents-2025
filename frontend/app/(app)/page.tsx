import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect to welcome page
  redirect('/welcome');
}
