#!/usr/bin/env python3
"""
Question File Creator for 80th Birthday Trivia Game
Helper script to create new trivia question markdown files
"""

import os
from pathlib import Path

def create_question_file():
    """Interactive script to create a new question file."""
    
    print("🎯 Create New Trivia Question File")
    print("=" * 40)
    
    # Get category name
    category = input("Enter the category name (e.g., '1960s Music', 'Movies', etc.): ").strip()
    if not category:
        print("Category name is required!")
        return
    
    # Create filename
    filename = category.lower().replace(' ', '_').replace("'", "").replace(',', '') + "_questions.md"
    questions_dir = Path(__file__).parent / 'questions'
    file_path = questions_dir / filename
    
    # Check if file exists
    if file_path.exists():
        overwrite = input(f"File {filename} already exists. Overwrite? (y/N): ").strip().lower()
        if overwrite != 'y':
            print("Cancelled.")
            return
    
    # Create questions directory if it doesn't exist
    questions_dir.mkdir(exist_ok=True)
    
    # Get number of questions
    try:
        num_questions = int(input("How many questions do you want to add? "))
        if num_questions <= 0:
            raise ValueError()
    except ValueError:
        print("Please enter a valid positive number!")
        return
    
    # Create the markdown content
    content = f"# Trivia Questions: {category}\n\n"
    
    for i in range(1, num_questions + 1):
        print(f"\n--- Question {i} ---")
        
        question = input("Enter the question: ").strip()
        if not question:
            print("Question cannot be empty!")
            return
        
        options = []
        for letter in ['A', 'B', 'C', 'D']:
            option = input(f"Option {letter}: ").strip()
            if not option:
                print("All options are required!")
                return
            options.append(option)
        
        while True:
            correct_letter = input("Which option is correct? (A/B/C/D): ").strip().upper()
            if correct_letter in ['A', 'B', 'C', 'D']:
                correct_index = ord(correct_letter) - ord('A')
                correct_answer = options[correct_index]
                break
            else:
                print("Please enter A, B, C, or D")
        
        # Add question to content
        content += f"**{i}. {question}**\n\n"
        for j, option in enumerate(options):
            letter = chr(ord('A') + j)
            content += f"- {letter}. {option}\n"
        content += f"\n*Answer:* {correct_answer}\n\n---\n\n"
    
    # Write the file
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n✅ Successfully created {filename}!")
        print(f"📁 File location: {file_path}")
        print("\n🎮 Restart the server to include these questions in the game!")
        
    except Exception as e:
        print(f"❌ Error creating file: {e}")

if __name__ == '__main__':
    create_question_file()
