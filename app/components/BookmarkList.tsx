'use client'
import {useEffect, useState} from 'react'
import {createClient} from "@/app/utils/supabase/client";
import {deleteBookmark} from "@/app/utils/actions";

interface BookmarkProps {
    title: string
    url: string
    id: string
}

export default function BookmarkList({initialBookmarks}: { initialBookmarks: BookmarkProps[] }) {
    const [bookmarks, setBookmarks] = useState(initialBookmarks)
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel('any-name-works') // The name here is arbitrary
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen for ALL changes
                    schema: 'public',
                    table: 'BookMarks', // MUST match your table name exactly
                },
                (payload) => {
                    console.log('Change received!', payload); // Step 1: Check if this logs!

                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as BookmarkProps, ...prev]);
                    }

                    if (payload.eventType === 'DELETE') {
                        // Note: On DELETE, payload.new is null. Use payload.old
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status); // Should log "SUBSCRIBED"
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return (
        <div className="grid gap-4 mt-8">
            {bookmarks.map((bookmark) => (
                <div key={bookmark.id}
                     className="p-4 border rounded shadow-sm flex justify-between items-center bg-white">
                    <div>
                        <h3 className="font-bold text-black">{bookmark.title}</h3>
                        <a href={bookmark.url} target="_blank" className="text-blue-500 text-sm hover:underline">
                            {bookmark.url}
                        </a>
                    </div>
                    <button
                        onClick={async () => {
                            if (confirm("Are you sure you want to delete this bookmark?")) {
                                await deleteBookmark(bookmark.id);
                            }
                        }}
                        className="text-red-500 hover:text-red-700 p-2 text-sm font-medium transition-colors">
                        Delete
                    </button>
                    {/* We'll add the Delete button here next */}
                </div>
            ))}
            {bookmarks.length === 0 && <p className="text-gray-500">No bookmarks yet.</p>}
        </div>
    )
}