# Changelog

All notable changes to GradeDash will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-13

### Added
- **Dashboard**: View SGPA/CGPA trends with interactive charts
- **Semester Manager**: Add, edit, and delete semesters and courses
- **Transcript Import**: AI-powered PDF parsing using OpenAI GPT-4o
- **Graduation Requirements**: Track progress for all IIITD B.Tech branches (CSE, CSSS, CSAM, ECE, CSB, CSD, CSAI, EVE)
- **Hypothetical Calculator**: Two scenarios for GPA prediction
- **AI Chatbot**: RAG-powered assistant for B.Tech regulations (5 msg/day for guests, 30/day for users)
- **Guest Login**: Explore the dashboard without an account (read-only mode)
- **Authentication**: Google OAuth restricted to `@iiitd.ac.in` emails
- **Rate Limiting**: Daily limits to prevent API abuse
- **Docker Support**: Dockerfile and docker-compose for containerized deployment
- **Mobile Responsive**: Optimized layout for all screen sizes

### Security
- Guest users are blocked from data mutations (upload, add/delete courses)
- Cookie-based rate limiting for independent per-device quotas

---

<!-- 
VERSIONING GUIDE:
- PATCH (0.1.0 → 0.1.1): Bug fixes, minor tweaks
- MINOR (0.1.0 → 0.2.0): New features (backward compatible)
- MAJOR (0.1.0 → 1.0.0): Breaking changes, major milestones
-->
