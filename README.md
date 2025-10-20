# Ruqya Healing Hub

> **Healing through Qur'an and Sunnah** - An Islamic spiritual healing platform offering authentic Ruqya services, consultations, and educational resources.

**🌐 Live Demo:** [ruqyahub.vercel.app](https://ruqyahub.vercel.app)

## ✨ Features

- 🕌 **Ruqya Services** - Book in-person and online spiritual healing sessions
- 🛒 **E-commerce Store** - Purchase spiritual healing products
- 📚 **Educational Content** - Articles, podcasts, and courses
- 🎧 **Audio Library** - Authentic Ruqya recitations
- 💬 **Live Support Chat** - Real-time customer support
- 👤 **Admin Dashboard** - Content and service management
- 📱 **Responsive Design** - Optimized for all devices


## 🚀 Frontend 

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/ruqya-healing-hub.git
cd ruqya-healing-hub

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

\`\`\`bash
pnpm build
pnpm start
\`\`\`



## 🏗️ Tech Stack

- **Framework:** Next.js 15.2.4 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4.1.9 + shadcn/ui + Radix UI
- **Forms:** React Hook Form + Zod validation
- **State:** React Context API (Cart, Auth, Chat)
- **UI Components:** Lucide icons, date-fns, recharts, embla-carousel
- **Deployment:** Vercel with Analytics



## 📁 Project Structure

\`\`\`
ruqya-healing-hub/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard (dashboard, services, articles, podcasts, audio, chat)
│   ├── articles/          # Public articles
│   ├── auth/              # Authentication
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── courses/           # Educational courses
│   ├── podcasts/          # Podcast episodes
│   ├── ruqya-audio/       # Audio library
│   ├── services/          # Service booking
│   ├── shop/              # E-commerce store
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Layouts, chat widget, guards
├── contexts/             # React Context providers
│   ├── admin-auth-context.tsx
│   ├── cart-context.tsx
│   └── chat-context.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
\`\`\`



## 🎯 Key Pages

### Public Routes
- `/` - Homepage with hero and features
- `/services` - Browse and book Ruqya services
- `/shop` - E-commerce store
- `/cart` & `/checkout` - Shopping flow
- `/articles` - Educational articles
- `/podcasts` - Podcast episodes
- `/ruqya-audio` - Audio recitations
- `/courses` - Learning programs

### Admin Routes (Protected)
- `/auth/admin` - Admin login
- `/admin/dashboard` - Overview & statistics
- `/admin/services` - Service management
- `/admin/articles` - Article management
- `/admin/podcasts` - Podcast management
- `/admin/audio` - Audio file management
- `/admin/chat` - Live customer support



## ⚙️ Configuration

### Environment Variables

Create `.env.local` in the root directory:

\`\`\`env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add your configuration here
# DATABASE_URL=
# NEXTAUTH_SECRET=
# STRIPE_PUBLIC_KEY=
\`\`\`



## 🛠️ Development

\`\`\`bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
\`\`\`

### Development Guidelines
- Use TypeScript for type safety
- Follow component-based architecture
- Style with Tailwind utility classes
- Manage state with React Context API
- Test across different screen sizes



## 🚢 Deployment

**Vercel (Recommended):**
1. Import project to Vercel
2. Connect your Git repository
3. Add environment variables
4. Deploy: `vercel deploy --prod`

**Alternative Platforms:** Netlify, AWS Amplify, Docker, Self-hosted



## 🎯 Roadmap

- [ ] User authentication & profiles
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Calendar/appointment scheduling
- [ ] Multi-language support (Arabic)
- [ ] Video library
- [ ] Mobile app (React Native)
- [ ] SEO optimization

## Backend ⭐

- Python 3.11+
- PostgreSQL 15+
- pip

## Quick Start

### 1. Clone and Setup
\`\`\`bash
# Clone repository
git clone 
cd ruqya-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
\`\`\`

### 2. Install Dependencies
\`\`\`bash
make install
\`\`\`

### 3. Configure Environment

Create `.env` file:
\`\`\`env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ruqya_db
SECRET_KEY=your-secret-key-here
FRONTEND_URL=http://localhost:3000
\`\`\`

### 4. Setup Database
\`\`\`bash
# Create database
createdb ruqya_db

# Run migrations
make migrate-up

# Seed data
make seed
\`\`\`

### 5. Run Development Server
\`\`\`bash
make dev
\`\`\`

API will be available at: http://localhost:8000

- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Available Make Commands
\`\`\`bash
make help              # Show all available commands
make install           # Install dependencies
make dev               # Run development server
make prod              # Run production server
make test              # Run tests
make migrate-create    # Create new migration
make migrate-up        # Apply migrations
make migrate-down      # Rollback migration
make seed              # Seed database
make seed-admin        # Create admin user only
make clean             # Clean up generated files
make format            # Format code with Black
make lint              # Lint code with Flake8
make check             # Run all code quality checks
make db-reset          # Reset database completely
make docker-up         # Start with Docker
make setup             # Complete initial setup
\`\`\`

## Default Admin Credentials

- **Email**: admin@ruqyahealinghub.com
- **Password**: admin123

⚠️ **Change these credentials after first login!**

## Project Structure
\`\`\`
ruqya-backend/
├── app/
│   ├── api/v1/          # API endpoints
│   ├── core/            # Security, config
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── utils/           # Utility functions
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   └── main.py          # FastAPI app
├── alembic/             # Database migrations
├── scripts/             # Utility scripts
├── tests/               # Test files
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── Makefile            # Make commands
└── requirements.txt     # Dependencies
\`\`\`

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing
\`\`\`bash
# Run all tests
make test

# Run with coverage
make test

# Run in watch mode
make test-watch
\`\`\`

## Docker (Optional)
\`\`\`bash
# Build and start
make docker-up

# Stop
make docker-down

# View logs
make docker-logs
\`\`\`

## License

MIT

Usage Instructions
First Time Setup:
bash# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# 2. Complete setup (installs deps, runs migrations, seeds data)
make setup

# 3. Start development server
make dev
Daily Development:
bash# Start dev server
make dev

# Create new migration
make migrate-create MSG="add new table"

# Run tests
make test

# Format and lint code
make check
Common Tasks:
bash# Reset database completely
make db-reset

# Create admin user
make seed-admin

# Show all routes
make routes

# View logs
make logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request



## 📄 License

This project is licensed under the MIT License.

## 👥 Contact & Support

- **Website:** [ruqyahub.vercel.app](https://ruqyahub.vercel.app)
- **Project:** [v0.app](https://v0.app/chat/projects/VyY86pYAlFn)
- **Email:** support@ruqyahub.com

## 🙏 Acknowledgments

Built with [v0.app](https://v0.app) · [shadcn/ui](https://ui.shadcn.com) · [Lucide Icons](https://lucide.dev) · Deployed on [Vercel](https://vercel.com)

---

<div align="center">

**Made with ❤️ for the Muslim Community**

*Healing through the Qur'an and Sunnah*

</div>
