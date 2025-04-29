import Image from "next/image";
import { auth } from "../../auth";
import { redirect } from "next/navigation"

export default async function Panel() {
   const session = await auth()

  if(!session?.user)
	redirect('/login')

    return (
        <section className="flex w-full justify-center items-center h-screen p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto text-center">
                <Image src="/oreka-logo.png" width={300} height={80} alt="logo" className="mx-auto mb-6" />
                <h1 className="text-2xl font-semibold mb-4">Witaj, {session?.user?.name} 👋</h1>
                <p className="text-gray-600 mb-6">
                  To jest Twój panel zarządzania treścią strony. Możesz tutaj:
                </p>
                <ul className="text-left list-disc list-inside space-y-2 text-gray-700 text-sm">
                    <li>Przeglądać próby kontaktu z formularza</li>
                    <li>Zarządzać kategoriami projektów</li>
                    <li>Tworzyć i edytować projekty wraz z multimediami</li>
                    <li>Dodawać i zarządzać użytkownikami z dostępem do treści na stronie</li>
                </ul>
            </div>
        </section>
    )
}