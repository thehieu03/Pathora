This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Image Host Allowlist

To optimize user avatars with `next/image`, configure allowed remote hosts:

```bash
NEXT_PUBLIC_REMOTE_IMAGE_HOSTS=cdn.example.com,images.example.org,https://localhost:5001
```

- Comma-separated list
- Supports plain host (`cdn.example.com`) or full URL (`https://cdn.example.com`)
- Non-allowlisted avatar URLs automatically fall back to standard `<img>`

## Seeded Backend Data (Admin Pages)

Admin pages should use backend API data as the primary source (not local hardcoded data).

- Admin overview endpoint: `GET /api/admin/overview`
- Frontend service wrapper: `src/services/adminService.ts`
- Integration guide: `../docs/seed-data-integration.md`

For local verification against seeded backend data, follow the checklist in `../docs/seed-data-integration.md`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
