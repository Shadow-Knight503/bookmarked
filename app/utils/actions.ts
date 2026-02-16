'use server'
import { createClient } from "./supabase/server";
import { Provider } from "@supabase/auth-js";
import { redirect } from "next/navigation";

const signInWith = (provider: Provider) => async () => {
    const supabase = await createClient()
    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: auth_callback_url,
        }
    })

    console.log(data)

    if(error) {
        console.log(error)
    }

    redirect(data.url!)
}

const signinWithGoogle = signInWith('google')

const signOut = async () => {
    const supabase = await createClient()
    const session = await supabase.auth.signOut()
    redirect('/')
}

const addBookmark = async (formData: FormData) => {
    const supabase = await createClient()

    const ttl = formData.get("ttl") as string
    const url = formData.get("url") as string

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        throw new Error("You must be logged in to add bookmarks")
    }

    const { error } = await supabase
        .from('BookMarks')
        .insert([
            {
                title: ttl,
                url,
                user_id: user.id,
            }
        ])

    if (error) {
        console.error('Error adding bookmark', error.message)
        return { error: error.message }
    }

    return { success: true }
}

const deleteBookmark = async (id: string) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('BookMarks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete error:', error.message);
    throw new Error("Failed to delete bookmark");
  }
};

export { signinWithGoogle, signOut, addBookmark, deleteBookmark }