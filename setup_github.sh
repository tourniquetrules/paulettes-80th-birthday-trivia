#!/bin/bash
# GitHub Repository Setup for Paulette's 80th Birthday Trivia Game

echo "🎂 Setting up GitHub repository for Paulette's Birthday Trivia Game"
echo "=================================================================="
echo ""

# Repository details
REPO_NAME="paulettes-80th-birthday-trivia"
GITHUB_USERNAME="tourniquetrules"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "📋 Repository Details:"
echo "Name: $REPO_NAME"
echo "Username: $GITHUB_USERNAME"
echo "URL: $REPO_URL"
echo ""

echo "🔧 Steps to complete the setup:"
echo ""
echo "1. Create the repository on GitHub:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: $REPO_NAME"
echo "   - Description: 'Mobile trivia game for Paulette's 80th birthday celebration'"
echo "   - Set to Public (so others can see the fun code!)"
echo "   - Do NOT initialize with README (we already have one)"
echo "   - Click 'Create repository'"
echo ""

echo "2. After creating the repository, run these commands:"
echo ""
echo "   # Add the remote repository"
echo "   git remote add origin $REPO_URL"
echo ""
echo "   # Push the code to GitHub"
echo "   git push -u origin main"
echo ""

echo "3. Optional: Set up GitHub Pages for easy access"
echo "   - Go to repository Settings > Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main"
echo "   - This will make the game available at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo ""

echo "💡 Alternative: Use GitHub CLI (if installed)"
echo "   gh repo create $REPO_NAME --public --description 'Mobile trivia game for Paulette's 80th birthday celebration'"
echo "   git remote add origin $REPO_URL"
echo "   git push -u origin main"
echo ""

echo "🎉 After setup, your trivia game will be available at:"
echo "   - Main site: https://paulette.haydd.com"
echo "   - GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   - GitHub Pages: https://$GITHUB_USERNAME.github.io/$REPO_NAME (if enabled)"
echo ""

read -p "Press Enter when you've created the repository on GitHub..."

# Add remote and push
echo ""
echo "🚀 Adding remote and pushing to GitHub..."
git remote add origin $REPO_URL

echo ""
echo "📤 Pushing code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully uploaded to GitHub!"
    echo ""
    echo "🔗 Your repository is now available at:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "🎮 Game is live at:"
    echo "   https://paulette.haydd.com"
    echo ""
    echo "🎂 Happy 80th Birthday Paulette!"
else
    echo ""
    echo "❌ Error pushing to GitHub. Please check:"
    echo "   1. Repository was created correctly"
    echo "   2. Repository name matches: $REPO_NAME"
    echo "   3. You have push permissions"
    echo ""
    echo "Manual commands:"
    echo "   git remote add origin $REPO_URL"
    echo "   git push -u origin main"
fi
