import LoginBtn from "@/app/components/loginBtn";
import { createClient } from "@/app/utils/supabase/server";
import Image from "next/image";
import AddBookmark from "@/app/components/AddBookmark";
import BookmarkList from "@/app/components/BookmarkList";

export default async function Home() {
    const supabase = await createClient()
    const session = await supabase.auth.getUser()

    if (!session.data.user) {
        return (
            <main className="flex min-h-screen items-center justify-center
                bg-zinc-50 font-sans dark:bg-black">
                <LoginBtn />
            </main>
        );
    }

    const {
        data: {
            user: {user_metadata, app_metadata}
        }
    } = session

    const { name, email, user_name, avatar_url } = user_metadata
    const userName = user_name ? user_name : "Username not set"

    const { data: bookmarks } = await supabase
        .from('BookMarks')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <main>
            <nav className={"flex justify-end items-center gap-4 bg-blue-950 px-2"}>
                <h2 className={"text-xl basis-5/6"}>Bookmarked</h2>
                <p className={"text-md"}>{userName}</p>
                {avatar_url && (
                    <Image src={avatar_url} alt={name} width={20} height={20}
                           quality={100} className={"rounded-xl"}/>
                )}

                {/*<form action={signOut}>*/}
                {/*    <button className={"bg-slate-800 px-4 py-2 rounded-xl"}>*/}
                {/*        Sign Out*/}
                {/*    </button>*/}
                {/*</form>*/}
            </nav>
            <article className={"mt-4 px-12 text-white"}>
                <AddBookmark />
                <BookmarkList initialBookmarks={bookmarks || []} />
            </article>
        </main>
    )
}
