# TaskFlow

TaskFlow is a modern task management application built with Next.js, featuring real-time analytics, team collaboration, and an intuitive user interface.

## Features

- 🚀 Real-time task tracking and management
- 📊 Interactive dashboard with performance analytics
- 👥 Team collaboration and workspace management
- 🎯 Task completion tracking and statistics
- 🔐 Secure authentication with NextAuth.js
- 🎨 Modern UI with Tailwind CSS and Framer Motion

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **State Management**: React Hooks
- **Icons**: Heroicons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-database-url"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
