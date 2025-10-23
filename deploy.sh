#!/bin/bash

echo "🚀 SEO Audit Tool Deployment Script"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Build Docker image
echo "📦 Building Docker image..."
docker build -t seo-audit-backend ./backend/

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"

    # Tag for deployment
    docker tag seo-audit-backend seo-audit-backend:latest

    echo ""
    echo "🎯 Ready for deployment to:"
    echo "  • Google Cloud Run (gcloud run deploy)"
    echo "  • AWS ECS/Fargate (aws ecs create-service)"
    echo "  • Azure Container Instances (az container create)"
    echo "  • DigitalOcean App Platform"
    echo "  • Any Docker-compatible platform"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push to container registry: docker push your-registry/seo-audit-backend"
    echo "2. Deploy frontend: Upload frontend/build/ to static hosting"
    echo "3. Update frontend/netlify.toml with backend URL"
    echo "4. Test your live application! 🚀"

else
    echo "❌ Docker build failed"
    exit 1
fi
