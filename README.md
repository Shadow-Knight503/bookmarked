## Secure Real-time Bookmark Manager 
A full-stack, real-time bookmarking application built with Next.js 15, Supabase, and Tailwind CSS. This project was developed within a 72-hour sprint, focusing on secure server-side authentication and live data synchronization.

🚀 Features
* Secure Google OAuth: Implemented via Supabase SSR and Next.js Server Actions for a robust PKCE flow.
* Real-time Synchronization: Uses Postgres Changes via WebSockets to sync bookmarks across multiple tabs instantly.
* Private User Spaces: Row Level Security (RLS) ensures users can only create, view, and delete their own bookmarks.
* Optimized Data Handling: Uses Server Actions for data mutations to reduce client-side overhead.

🛠️ Tech Stack
* Framework: Next.js (App Router)
* Database: PostgreSQL (Supabase)
* Auth: Supabase Auth (SSR)
* Real-time: Supabase Realtime (Replication)
* Styling: Tailwind CSS
* Language: TypeScript

🧠 Challenges & Solutions
1. The "Implicit Flow" Trap
Problem: Initially, the OAuth redirect was returning a fragment (#access_token) which is invisible to the server, breaking the auth/callback logic.
Solution: Switched the OAuth trigger from a client-side call to a Next.js Server Action. This forced the use of the PKCE (Proof Key for Code Exchange) flow, allowing the server to exchange the code for a secure session cookie.

2. Partial Real-time Sync
Problem: Real-time updates worked for DELETE events but failed for INSERT events.
Solution: Identified that the Supabase Realtime engine requires a SELECT RLS policy to broadcast new data. Additionally, set the table's REPLICA IDENTITY to FULL to ensure the entire row payload was sent to the client state.

3. TypeScript Environment Strictness
Problem: The build failed due to potential undefined types for Supabase environment variables.
Solution: Implemented non-null assertions (!) in the Supabase client utility, ensuring the TypeScript compiler that the environment variables are strictly defined in the production environment.
