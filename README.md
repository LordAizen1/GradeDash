# GradeDash - IIIT Delhi Academic Tracker

**GradeDash** is a modern, AI-powered academic dashboard designed specifically for students at IIIT Delhi (and similar credit systems). It allows students to effortlessly track their grades, visualize their academic trajectory, and plan future semesters with hypothetical scenarios.

![Dashboard Preview](/public/dashboard-preview.png)
*(Note: Replace with actual screenshot path if available, or remove)*

## ✨ Key Features

-   **📊 Interactive Dashboard**: Visualise your SGPA and CGPA trends over time with beautiful, responsive charts.
-   **🤖 AI Transcript Import**: Upload your PDF transcript or screenshots, and let GPT-4o automatically parse and verify your courses and grades.
-   **🧮 Smart GPA Calculation**: 
    -   Automatically handles IIITD's specific grading rules (e.g., 'S' grades don't count towards CGPA).
    -   Includes logic for worst-grade exclusion (if applicable).
-   **🔮 Hypothetical Calculator**:
    -   **Target Calculator**: "I want an 8.5 CGPA. What SGPA do I need next sem?"
    -   **Future Predictor**: "If I get a 9.0 next sem, what will my CGPA be?"
-   **📱 Fully Responsive**: Optimized for both desktop and mobile devices.
-   **🌗 Dark Mode**: Seamless theme switching for late-night study sessions.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: PostgreSQL, [Prisma ORM](https://www.prisma.io/)
-   **Auth**: [Auth.js (NextAuth v5)](https://authjs.dev/)
-   **AI Integration**: OpenAI API (`gpt-4o`) for transcript parsing
-   **Charts**: Recharts
-   **Deployment**: Docker-ready

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   Docker (for local Postgres database)
-   OpenAI API Key (for transcript parsing)
-   Google OAuth Credentials (for authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/iiitd-grade-dash.git
cd iiitd-grade-dash
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gradedash?schema=public"

# Auth (NextAuth.js)
AUTH_SECRET="your_random_secret_string" # generate with `npx auth secret`
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# AI
OPENAI_API_KEY="sk-..."
```

### 3. Start Database

Use the provided Compose file to spin up a local Postgres instance:

```bash
docker compose up -d
```

### 4. Install Dependencies & Push Schema

```bash
npm install
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to start using GradeDash!

## 🐳 Docker Deployment

To build and run the application as a standalone container:

```bash
# Build the image
docker build -t gradedash .

# Run the container (ensure env vars are passed or existing in .env)
docker run -p 3000:3000 --env-file .env.local gradedash
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
