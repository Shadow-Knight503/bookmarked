'use client'
import { addBookmark } from "@/app/utils/actions";
import { useRef } from 'react'

export default function AddBookmark() {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const result = await addBookmark(formData)
    if (result?.success) {
      formRef.current?.reset() // Clear form on success
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-800
        rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Add New Bookmark</h2>
      <input
        name="ttl"
        placeholder="Site Title (e.g., Google)"
        required
        className="border p-2 rounded"
      />
      <input
        name="url"
        type="url"
        placeholder="https://example.com"
        required
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Save Bookmark
      </button>
    </form>
  )
}