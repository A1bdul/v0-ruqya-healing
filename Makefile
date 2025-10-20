.PHONY: help setup dev stop restart clean logs shell health info docker-* frontend-* backend-*

# Variables
DOCKER_COMPOSE := docker-compose
BACKEND_DIR := ruqya-backend
FRONTEND_DIR := .

# Colors
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
RED := \033[0;31m
MAGENTA := \033[0;35m
CYAN := \033[0;36m
NC := \033[0m

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║        Ruqya Healing Hub - Full Stack Commands           ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(MAGENTA)⚡ Quick Start:$(NC)"
	@echo "  $(GREEN)make setup$(NC)               - Complete setup (backend + frontend)"
	@echo "  $(GREEN)make dev$(NC)                 - Start development environment"
	@echo "  $(GREEN)make stop$(NC)                - Stop all services"
	@echo ""
	@echo "$(MAGENTA)🚀 Main Commands:$(NC)"
	@echo "  $(YELLOW)make setup$(NC)               - Complete project setup"
	@echo "  $(YELLOW)make dev$(NC)                 - Start all services"
	@echo "  $(YELLOW)make stop$(NC)                - Stop all services"
	@echo "  $(YELLOW)make restart$(NC)             - Restart all services"
	@echo "  $(YELLOW)make logs$(NC)                - View all logs"
	@echo "  $(YELLOW)make clean$(NC)               - Clean all resources"
	@echo "  $(YELLOW)make reset$(NC)               - Complete reset"
	@echo "  $(YELLOW)make fix-docker$(NC)          - Fix Docker conflicts"
	@echo "  $(YELLOW)make fix-connectivity$(NC)   - Fix frontend-backend connection"
	@echo "  $(YELLOW)make diagnose$(NC)           - Diagnose connectivity issues"
	@echo ""
	@echo "$(MAGENTA)🐳 Docker Commands:$(NC)"
	@echo "  $(YELLOW)make docker-up$(NC)           - Start all Docker services"
	@echo "  $(YELLOW)make docker-down$(NC)         - Stop all Docker services"
	@echo "  $(YELLOW)make docker-build$(NC)        - Build all Docker images"
	@echo "  $(YELLOW)make docker-logs$(NC)         - View Docker logs"
	@echo "  $(YELLOW)make docker-cleanup$(NC)      - Remove conflicting containers"
	@echo ""
	@echo "$(MAGENTA)🔧 Backend Commands:$(NC)"
	@echo "  $(YELLOW)make backend-shell$(NC)       - Open backend shell"
	@echo "  $(YELLOW)make backend-migrate$(NC)     - Run database migrations"
	@echo "  $(YELLOW)make backend-migrate-safe$(NC) - Run migrations (handles existing tables)"
	@echo "  $(YELLOW)make backend-seed$(NC)        - Seed database"
	@echo "  $(YELLOW)make backend-logs$(NC)        - View backend logs"
	@echo "  $(YELLOW)make backend-db-reset$(NC)    - Reset database (⚠️ Deletes data)"
	@echo "  $(YELLOW)make backend-migration-fix$(NC) - Fix migration conflicts"
	@echo ""
	@echo "$(MAGENTA)💻 Frontend Commands:$(NC)"
	@echo "  $(YELLOW)make frontend-shell$(NC)      - Open frontend shell"
	@echo "  $(YELLOW)make frontend-logs$(NC)       - View frontend logs"
	@echo "  $(YELLOW)make frontend-build$(NC)      - Build frontend"
	@echo ""
	@echo "$(MAGENTA)🔍 Other Commands:$(NC)"
	@echo "  $(YELLOW)make health$(NC)              - Check all services health"
	@echo "  $(YELLOW)make info$(NC)                - Show project information"
	@echo ""

# ============================================================================
# DOCKER CONFLICT RESOLUTION
# ============================================================================

docker-cleanup: ## Remove conflicting Docker containers
	@echo "$(YELLOW)🧹 Checking for conflicting containers...$(NC)"
	@if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q '^ruqya_backend$$'; then \
		echo "$(RED)Found conflicting ruqya_backend container$(NC)"; \
		if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^ruqya_backend$$'; then \
			echo "$(YELLOW)⏸️  Stopping ruqya_backend...$(NC)"; \
			docker stop ruqya_backend 2>/dev/null || true; \
		fi; \
		echo "$(YELLOW)🗑️  Removing ruqya_backend...$(NC)"; \
		docker rm -f ruqya_backend 2>/dev/null || true; \
	fi
	@if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q '^ruqya_db$$'; then \
		echo "$(RED)Found conflicting ruqya_db container$(NC)"; \
		if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^ruqya_db$$'; then \
			echo "$(YELLOW)⏸️  Stopping ruqya_db...$(NC)"; \
			docker stop ruqya_db 2>/dev/null || true; \
		fi; \
		echo "$(YELLOW)🗑️  Removing ruqya_db...$(NC)"; \
		docker rm -f ruqya_db 2>/dev/null || true; \
	fi
	@if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -q '^ruqya_frontend$$'; then \
		echo "$(RED)Found conflicting ruqya_frontend container$(NC)"; \
		if docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^ruqya_frontend$$'; then \
			echo "$(YELLOW)⏸️  Stopping ruqya_frontend...$(NC)"; \
			docker stop ruqya_frontend 2>/dev/null || true; \
		fi; \
		echo "$(YELLOW)🗑️  Removing ruqya_frontend...$(NC)"; \
		docker rm -f ruqya_frontend 2>/dev/null || true; \
	fi
	@echo "$(GREEN)✅ Cleanup complete!$(NC)"

fix-docker: docker-cleanup docker-up ## Quick fix for Docker conflicts
	@echo "$(GREEN)✅ Docker issues fixed!$(NC)"

fix-connectivity: ## Fix frontend-backend connectivity
	@echo "$(BLUE)🔧 Fixing frontend-backend connectivity...$(NC)"
	@echo "$(YELLOW)Updating .env.local with correct API URL...$(NC)"
	@echo "NEXT_PUBLIC_API_URL=http://backend:8000" > .env.local
	@echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
	@echo "$(GREEN)✅ .env.local updated$(NC)"
	@echo "$(BLUE)🔄 Restarting frontend...$(NC)"
	@docker restart ruqya_frontend
	@sleep 3
	@echo "$(GREEN)✅ Frontend restarted!$(NC)"
	@echo ""
	@echo "$(CYAN)Testing connectivity...$(NC)"
	@sleep 2
	@curl -s http://localhost:8000/health > /dev/null && echo "$(GREEN)✅ Backend is healthy$(NC)" || echo "$(RED)❌ Backend not responding$(NC)"
	@echo ""
	@echo "$(YELLOW)🔗 URLs:$(NC)"
	@echo "  • Frontend: http://localhost:3000"
	@echo "  • Backend: http://localhost:8000"
	@echo "  • API Docs: http://localhost:8000/docs"

diagnose: ## Diagnose connectivity issues
	@echo "$(BLUE)🔍 Running connectivity diagnostic...$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Checking containers:$(NC)"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep ruqya || echo "$(RED)No ruqya containers running$(NC)"
	@echo ""
	@echo "$(YELLOW)2. Testing backend from host:$(NC)"
	@curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || echo "$(RED)❌ Cannot reach backend$(NC)"
	@echo ""
	@echo "$(YELLOW)3. Testing backend from frontend container:$(NC)"
	@docker exec ruqya_frontend wget -qO- http://backend:8000/health 2>/dev/null || echo "$(RED)❌ Frontend cannot reach backend$(NC)"
	@echo ""
	@echo "$(YELLOW)4. Checking frontend environment:$(NC)"
	@docker exec ruqya_frontend env | grep NEXT_PUBLIC || echo "$(YELLOW)No NEXT_PUBLIC vars found$(NC)"
	@echo ""

# ============================================================================
# MAIN COMMANDS
# ============================================================================

setup: create-env docker-cleanup docker-build docker-up wait-for-services backend-migrate-safe backend-seed ## Complete project setup
	@echo ""
	@echo "$(GREEN)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║              ✅ SETUP COMPLETE!                            ║$(NC)"
	@echo "$(GREEN)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(CYAN)🎉 Ruqya Healing Hub is ready!$(NC)"
	@echo ""
	@echo "$(YELLOW)🔗 Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)🔗 Backend API:$(NC) http://localhost:8000"
	@echo "$(YELLOW)📚 API Docs:$(NC) http://localhost:8000/docs"
	@echo "$(YELLOW)📖 ReDoc:$(NC) http://localhost:8000/redoc"
	@echo ""
	@echo "$(YELLOW)🔑 Admin Credentials:$(NC)"
	@echo "  • Email: admin@ruqyahealinghub.com"
	@echo "  • Password: admin123"
	@echo ""
	@echo "$(MAGENTA)💡 Useful Commands:$(NC)"
	@echo "  • make logs          - View all logs"
	@echo "  • make stop          - Stop all services"
	@echo "  • make restart       - Restart all services"
	@echo "  • make health        - Check services health"
	@echo ""

dev: docker-cleanup docker-up ## Start development environment
	@echo "$(GREEN)✅ Development environment started!$(NC)"
	@echo ""
	@echo "$(YELLOW)🔗 Frontend:$(NC) http://localhost:3000"
	@echo "$(YELLOW)🔗 Backend:$(NC) http://localhost:8000"
	@echo "$(YELLOW)📚 API Docs:$(NC) http://localhost:8000/docs"
	@echo ""
	@echo "$(CYAN)Viewing logs... (Ctrl+C to exit)$(NC)"
	@make logs

stop: docker-down ## Stop all services
	@echo "$(GREEN)✅ All services stopped!$(NC)"

restart: docker-cleanup docker-restart ## Restart all services
	@echo "$(GREEN)✅ All services restarted!$(NC)"

clean: docker-clean ## Clean all resources
	@echo "$(GREEN)✅ All resources cleaned!$(NC)"

reset: clean setup ## Complete reset and setup
	@echo "$(GREEN)✅ Complete reset done!$(NC)"

# ============================================================================
# DOCKER COMMANDS
# ============================================================================

docker-build: ## Build all Docker images
	@echo "$(BLUE)🔨 Building all Docker images...$(NC)"
	@$(DOCKER_COMPOSE) -f docker-compose.yml build
	@echo "$(GREEN)✅ All images built!$(NC)"

docker-up: ## Start all Docker services (with auto-cleanup)
	@echo "$(BLUE)🐳 Starting all Docker services...$(NC)"
	@$(DOCKER_COMPOSE) -f docker-compose.yml up -d
	@echo "$(GREEN)✅ All services started!$(NC)"
	@echo ""
	@echo "$(BLUE)📊 Running containers:$(NC)"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true

docker-down: ## Stop all Docker services
	@echo "$(YELLOW)⏹️  Stopping all Docker services...$(NC)"
	@$(DOCKER_COMPOSE) -f docker-compose.yml down
	@echo "$(GREEN)✅ All services stopped!$(NC)"

docker-restart: ## Restart all Docker services
	@echo "$(BLUE)🔄 Restarting all Docker services...$(NC)"
	@$(DOCKER_COMPOSE) -f docker-compose.yml restart
	@echo "$(GREEN)✅ All services restarted!$(NC)"

docker-logs: ## View all Docker logs
	@$(DOCKER_COMPOSE) -f docker-compose.yml logs -f

docker-ps: ## Show running containers
	@$(DOCKER_COMPOSE) -f docker-compose.yml ps

docker-clean: ## Remove all containers and volumes
	@echo "$(RED)🧹 Cleaning all Docker resources...$(NC)"
	@$(DOCKER_COMPOSE) -f docker-compose.yml down -v --remove-orphans
	@docker system prune -f
	@echo "$(GREEN)✅ Cleaned!$(NC)"

# ============================================================================
# BACKEND COMMANDS
# ============================================================================

backend-shell: ## Open backend shell
	@echo "$(BLUE)🐚 Opening backend shell...$(NC)"
	@docker exec -it ruqya_backend /bin/bash

backend-logs: ## View backend logs
	@$(DOCKER_COMPOSE) -f docker-compose.yml logs -f backend

backend-migrate: ## Run database migrations
	@echo "$(BLUE)⬆️  Running migrations...$(NC)"
	@docker exec ruqya_backend alembic upgrade head
	@echo "$(GREEN)✅ Migrations applied!$(NC)"

backend-migrate-safe: ## Run migrations safely (handles existing tables)
	@echo "$(BLUE)⬆️  Running migrations safely...$(NC)"
	@CURRENT=$$(docker exec ruqya_backend alembic current 2>/dev/null | grep -o 'ca9402ca9ba8' || echo ""); \
	if [ -n "$$CURRENT" ]; then \
		echo "$(GREEN)✅ Migrations already applied!$(NC)"; \
	else \
		echo "$(YELLOW)Attempting to run migrations...$(NC)"; \
		if docker exec ruqya_backend alembic upgrade head 2>&1 | tee /tmp/migration_output.log | grep -q "DuplicateTable\|already exists"; then \
			echo "$(YELLOW)⚠️  Tables already exist, stamping migration state...$(NC)"; \
			docker exec ruqya_backend alembic stamp head; \
			echo "$(GREEN)✅ Migration state synced!$(NC)"; \
		elif grep -q "Error\|Traceback" /tmp/migration_output.log; then \
			echo "$(RED)❌ Migration failed!$(NC)"; \
			cat /tmp/migration_output.log; \
			exit 1; \
		else \
			echo "$(GREEN)✅ Migrations applied successfully!$(NC)"; \
		fi; \
		rm -f /tmp/migration_output.log; \
	fi

backend-seed: ## Seed database
	@echo "$(BLUE)🌱 Seeding database...$(NC)"
	@docker exec ruqya_backend python scripts/seed_data.py
	@echo "$(GREEN)✅ Database seeded!$(NC)"

backend-db-shell: ## Open database shell
	@echo "$(BLUE)🐚 Opening database shell...$(NC)"
	@docker exec -it ruqya_db psql -U postgres ruqya_db

backend-db-reset: ## Reset database (⚠️ Deletes all data)
	@echo "$(RED)⚠️  WARNING: This will delete ALL database data!$(NC)"
	@echo "$(YELLOW)Press Ctrl+C within 3 seconds to cancel...$(NC)"
	@sleep 3
	@echo "$(BLUE)🗑️  Dropping database...$(NC)"
	@docker exec ruqya_db psql -U postgres -c "DROP DATABASE IF EXISTS ruqya_db;" 2>/dev/null || true
	@echo "$(BLUE)🆕 Creating fresh database...$(NC)"
	@docker exec ruqya_db psql -U postgres -c "CREATE DATABASE ruqya_db;" 2>/dev/null || true
	@echo "$(BLUE)📋 Running migrations...$(NC)"
	@docker exec ruqya_backend alembic upgrade head
	@echo "$(BLUE)🌱 Seeding database...$(NC)"
	@docker exec ruqya_backend python scripts/seed_data.py
	@echo "$(GREEN)✅ Database reset complete!$(NC)"

backend-migration-fix: ## Fix migration conflicts
	@echo "$(BLUE)🔧 Fixing migration state...$(NC)"
	@docker exec ruqya_backend alembic stamp head
	@echo "$(GREEN)✅ Migration state fixed!$(NC)"
	@echo "$(YELLOW)If issues persist, run: make backend-db-reset$(NC)"

backend-alembic-current: ## Show current migration version
	@echo "$(BLUE)📊 Current migration version:$(NC)"
	@docker exec ruqya_backend alembic current

backend-alembic-history: ## Show migration history
	@echo "$(BLUE)📜 Migration history:$(NC)"
	@docker exec ruqya_backend alembic history --verbose

# ============================================================================
# FRONTEND COMMANDS
# ============================================================================

frontend-shell: ## Open frontend shell
	@echo "$(BLUE)🐚 Opening frontend shell...$(NC)"
	@docker exec -it ruqya_frontend /bin/sh

frontend-logs: ## View frontend logs
	@$(DOCKER_COMPOSE) -f docker-compose.yml logs -f frontend

frontend-build: ## Build frontend
	@echo "$(BLUE)🔨 Building frontend...$(NC)"
	@docker exec ruqya_frontend pnpm build
	@echo "$(GREEN)✅ Frontend built!$(NC)"

# ============================================================================
# UTILITIES
# ============================================================================

create-env: ## Create environment files
	@echo "$(BLUE)📝 Creating environment files...$(NC)"
	@if [ ! -f .env.local ]; then \
		echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local; \
		echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local; \
		echo "$(GREEN)✅ .env.local created$(NC)"; \
	else \
		echo "$(YELLOW).env.local already exists$(NC)"; \
	fi
	@if [ ! -f $(BACKEND_DIR)/.env ]; then \
		echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/ruqya_db" > $(BACKEND_DIR)/.env; \
		echo "SECRET_KEY=dev-secret-key-change-in-production-min-32-chars-long" >> $(BACKEND_DIR)/.env; \
		echo "FRONTEND_URL=http://localhost:3000" >> $(BACKEND_DIR)/.env; \
		echo "ENVIRONMENT=development" >> $(BACKEND_DIR)/.env; \
		echo "$(GREEN)✅ backend .env created$(NC)"; \
	else \
		echo "$(YELLOW)backend .env already exists$(NC)"; \
	fi

wait-for-services: ## Wait for all services to be ready
	@echo "$(BLUE)⏳ Waiting for services to be ready...$(NC)"
	@sleep 5
	@for i in 1 2 3 4 5 6 7 8 9 10 11 12; do \
		if docker exec ruqya_backend python -c "from app.database import engine; engine.connect()" 2>/dev/null; then \
			echo "$(GREEN)✅ Backend is ready!$(NC)"; \
			sleep 2; \
			break; \
		else \
			echo "  Attempt $$i/12: Services not ready, waiting..."; \
			sleep 3; \
		fi; \
		if [ $$i -eq 12 ]; then \
			echo "$(RED)❌ Services failed to start$(NC)"; \
			exit 1; \
		fi; \
	done

logs: ## View all logs
	@$(DOCKER_COMPOSE) -f docker-compose.yml logs -f

health: ## Check all services health
	@echo "$(BLUE)🏥 Checking services health...$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend API:$(NC)"
	@curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || echo "$(RED)❌ Backend not responding$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000 2>/dev/null || echo "$(RED)❌ Frontend not responding$(NC)"
	@echo ""
	@echo "$(YELLOW)Database:$(NC)"
	@docker exec ruqya_db pg_isready -U postgres && echo "$(GREEN)✅ Database is ready$(NC)" || echo "$(RED)❌ Database not ready$(NC)"

info: ## Show project information
	@echo "$(BLUE)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║        Ruqya Healing Hub - Project Information           ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(CYAN)🎯 Full Stack Islamic Spiritual Healing Platform$(NC)"
	@echo ""
	@echo "$(YELLOW)🔗 URLs:$(NC)"
	@echo "  • Frontend: http://localhost:3000"
	@echo "  • Backend API: http://localhost:8000"
	@echo "  • API Docs: http://localhost:8000/docs"
	@echo "  • ReDoc: http://localhost:8000/redoc"
	@echo ""
	@echo "$(YELLOW)🔑 Admin Credentials:$(NC)"
	@echo "  • Email: admin@ruqyahealinghub.com"
	@echo "  • Password: admin123"
	@echo ""
	@echo "$(YELLOW)🏗️  Technology Stack:$(NC)"
	@echo "  • Frontend: Next.js 15 + React 19 + TypeScript"
	@echo "  • Backend: FastAPI + PostgreSQL + SQLAlchemy"
	@echo "  • Infrastructure: Docker + Docker Compose"
	@echo "  • Styling: Tailwind CSS 4 + shadcn/ui"
	@echo ""
	@echo "$(YELLOW)📦 Services:$(NC)"
	@echo "  • Frontend (Next.js): Port 3000"
	@echo "  • Backend (FastAPI): Port 8000"
	@echo "  • Database (PostgreSQL): Port 5432"
	@echo ""
	@echo "$(MAGENTA)💡 Quick Commands:$(NC)"
	@echo "  • make setup       - Complete setup"
	@echo "  • make dev         - Start development"
	@echo "  • make logs        - View logs"
	@echo "  • make health      - Check health"
	@echo "  • make stop        - Stop services"
	@echo "  • make fix-docker  - Fix Docker conflicts"
	@echo ""
