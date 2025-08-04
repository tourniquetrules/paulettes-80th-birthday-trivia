#!/usr/bin/env python3
"""
Question Parser for 80th Birthday Trivia Game
Parses all markdown files in the questions directory and generates a combined questions.js file
"""

import os
import re
import json
from pathlib import Path

def parse_markdown_questions(file_path):
    """Parse questions from a markdown file."""
    questions = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Split content by question blocks (looking for **number. pattern)
        question_blocks = re.split(r'\n\*\*\d+\.', content)
        
        for block in question_blocks[1:]:  # Skip the first empty block
            if not block.strip():
                continue
                
            lines = block.strip().split('\n')
            if len(lines) < 8:  # Need at least question + 4 options + answer
                continue
            
            # Extract question text (remove ** from end)
            question_text = lines[0].rstrip('*').strip()
            if not question_text:
                continue
            
            # Extract options (looking for - A., - B., etc.)
            options = []
            answer_line = None
            
            for line in lines[1:]:
                line = line.strip()
                if line.startswith('- '):
                    # Extract option text (remove "- A. " prefix)
                    option_match = re.match(r'- [A-D]\.\s*(.*)', line)
                    if option_match:
                        options.append(option_match.group(1))
                elif line.startswith('*Answer:*'):
                    answer_line = line
                    break
            
            if len(options) != 4 or not answer_line:
                continue
            
            # Extract correct answer
            answer_match = re.search(r'\*Answer:\*\s*(.*)', answer_line)
            if not answer_match:
                continue
            
            correct_answer = answer_match.group(1).strip()
            
            # Find the index of the correct answer
            correct_index = -1
            for i, option in enumerate(options):
                if option.strip() == correct_answer.strip():
                    correct_index = i
                    break
            
            if correct_index == -1:
                print(f"Warning: Could not find correct answer '{correct_answer}' in options for question: {question_text[:50]}...")
                continue
            
            questions.append({
                'question': question_text,
                'options': options,
                'correct': correct_index,
                'answer': correct_answer
            })
    
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
    
    return questions

def get_category_from_filename(filename):
    """Extract category name from filename."""
    name = Path(filename).stem
    # Convert underscores to spaces and title case
    category = name.replace('_', ' ').title()
    return category

def generate_questions_js():
    """Generate the questions.js file from all markdown files in the questions directory."""
    questions_dir = Path(__file__).parent / 'questions'
    all_questions = []
    categories = {}
    seen_questions = set()  # Track duplicate questions
    
    if not questions_dir.exists():
        print("Questions directory not found!")
        return
    
    # Parse all markdown files
    for md_file in questions_dir.glob('*.md'):
        print(f"Parsing {md_file.name}...")
        questions = parse_markdown_questions(md_file)
        
        if questions:
            category = get_category_from_filename(md_file.name)
            
            # Remove duplicates and add category info
            unique_questions = []
            for question in questions:
                question_text = question['question'].lower().strip()
                if question_text not in seen_questions:
                    seen_questions.add(question_text)
                    question['category'] = category
                    unique_questions.append(question)
                else:
                    print(f"  Skipped duplicate: {question['question'][:50]}...")
            
            if unique_questions:
                categories[category] = len(unique_questions)
                all_questions.extend(unique_questions)
                print(f"  Found {len(unique_questions)} unique questions")
            else:
                print(f"  All questions were duplicates in {md_file.name}")
        else:
            print(f"  No valid questions found in {md_file.name}")
    
    if not all_questions:
        print("No questions found in any files!")
        return
    
    # Generate JavaScript file with proper shuffling
    js_content = f"""// Auto-generated trivia questions from markdown files
// Generated on {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

// Question categories and counts
const questionCategories = {json.dumps(categories, indent=4)};

// All trivia questions
const triviaQuestions = {json.dumps(all_questions, indent=4)};

// Fisher-Yates shuffle algorithm for proper randomization
function fisherYatesShuffle(array) {{
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {{
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }}
    return shuffled;
}}

// Get questions by category
function getQuestionsByCategory(category) {{
    return triviaQuestions.filter(q => q.category === category);
}}

// Get random questions from all categories
function getRandomQuestions(count = 10) {{
    const shuffled = fisherYatesShuffle(triviaQuestions);
    return shuffled.slice(0, count);
}}

// Get random questions from specific categories
function getRandomQuestionsFromCategories(categories, count = 10) {{
    const filteredQuestions = triviaQuestions.filter(q => categories.includes(q.category));
    const shuffled = fisherYatesShuffle(filteredQuestions);
    return shuffled.slice(0, count);
}}
"""

    # Write the JavaScript file
    output_file = Path(__file__).parent / 'questions.js'
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(js_content)
    
    print(f"\nGenerated questions.js with {len(all_questions)} total questions")
    print("Categories:")
    for category, count in categories.items():
        print(f"  - {category}: {count} questions")

if __name__ == '__main__':
    generate_questions_js()
