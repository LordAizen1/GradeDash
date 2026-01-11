# GradeDash - IIIT Delhi Academic Tracker

**GradeDash** is a next-generation academic dashboard designed for IIIT Delhi students. It goes beyond simple grade tracking by offering AI-powered tools to visualize progress, plan future semesters, and instantly answer regulation-related queries.

![Dashboard Preview](/public/dashboard-preview.png)

## ✨ Key Features

-   **📊 Interactive Dashboard**: Visualise SGPA/CGPA trends with responsive Recharts.
-   **🤖 AI Transcript Import**: Upload a PDF transcript, and our GPT-4o parser extracts courses and grades instantly.
-   **💬 GradeDash Guide (Chatbot)**: A RAG-powered assistant (OpenAI Assistants API) that answers queries about B.Tech regulations, drop deadlines, and branch specifics using official documents.
-   **🛡️ Secure & Quota Protected**: Built-in rate limiting (30 chats/day, 5 uploads/day) to prevent API abuse.
-   **🧮 Smart Calculators**:
    -   **Requirements Tracker**: Tracks credits against branch-specific buckets (Core, Electives, SSH, etc.).
    -   **Target Calculator**: "What SGPA do I need for an 8.5 CGPA?"
    -   **Future Predictor**: Simulate future semester grades.
-   **📱 Modern UI**: Fully responsive, featuring Dark Mode and sleek Shadcn UI components.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Core**: React 19, TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: PostgreSQL, [Prisma ORM](https://www.prisma.io/)
-   **Auth**: [Auth.js (NextAuth v5)](https://authjs.dev/)
-   **AI Integration**:
    -   **Parsing**: OpenAI Typescript SDK (`gpt-4o`).
    -   **Chatbot**: OpenAI Assistants API (File Search/RAG) + Vercel AI SDK.
-   **State**: Zustand

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ (20+ recommended)
-   PostgreSQL (Local or Docker)
-   OpenAI API Key
-   Google OAuth Credentials

### 1. Clone & Install

```bash
git clone https://github.com/LordAizen1/GradeDash.git
cd iiitd-grade-dash
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gradedash?schema=public"

# Auth (NextAuth.js)
AUTH_SECRET="your_random_auth_secret"
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# AI
OPENAI_API_KEY="sk-..."
ASSISTANT_ID="" # Will be generated in step 4
```

### 3. Database Setup

```bash
# Start local DB (optional)
docker compose up -d

# Push schema
npx prisma db push
```

### 4. Chatbot Setup (Important!) 🤖

The chatbot relies on an OpenAI Assistant loaded with regulation PDFs. We have a script to automate this.

1.  Ensure your regulation PDFs are in `public/regulations/`.
2.  Run the setup script:
    ```bash
    node scripts/setup-assistant.js
    ```
3.  Copy the generated `ASSISTANT_ID` from the output and paste it into `.env.local`.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to start using GradeDash!

## 🐳 Docker Deployment

To build and run as a container:

```bash
docker build -t gradedash .
docker run -p 3000:3000 --env-file .env.local gradedash
```

## 🤝 Contributing

Contributions are welcome! Fork, branch, commit, and PR.

## 📄 License

[MIT License](LICENSE)
