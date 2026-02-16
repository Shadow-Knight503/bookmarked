'use client'
import {signinWithGoogle} from "@/app/utils/actions";

export default function LoginBtn() {
    return (
        <button onClick={signinWithGoogle}>
            Sign In with Google
        </button>
    )
}
