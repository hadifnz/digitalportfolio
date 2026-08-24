# Muhammad Hadif - Portfolio Website

This is a full-stack, responsive portfolio website built with Next.js (App Router), Tailwind CSS, and Supabase.

## Tech Stack
* **Frontend:** Next.js 14, Tailwind CSS, Lucide React
* **Backend:** Supabase (Database, Auth, Storage)
* **Deployment:** Vercel (Recommended)

## Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Supabase Configuration**
   - Create a project on [Supabase](https://supabase.com).
   - Go to the **SQL Editor** and run the contents of `schema.sql`.
   - Go to **Storage** and create a new public bucket named `portfolio-images`.
   - Create an Admin user via Supabase Auth (or sign up via the app if enabled, then disable public signups).

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the public site, and [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

## Deployment to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. In the Vercel project settings, add the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy! Next.js and Vercel will automatically configure the build settings.

## Admin Features
- Secure login using Supabase Auth.
- Dashboard with high-level metrics.
- Complete CRUD operations for Projects (with extensible structure for others).
- Direct image uploads to Supabase Storage.
- **Live Preview Mode:** Visualize your project updates exactly as they will appear on the public site before saving.
