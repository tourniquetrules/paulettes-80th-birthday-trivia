#!/usr/bin/env python3
"""
Parse 100questions.md and generate questions.js for the trivia game
"""

import re
import json

def parse_questions_from_file(filename):
    """Parse questions from the 100questions.md file"""
    questions = []
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by question markers (###)
    question_blocks = re.split(r'\n### \d+\.', content)
    
    for i, block in enumerate(question_blocks):
        if i == 0:  # Skip the header part
            continue
            
        lines = block.strip().split('\n')
        if len(lines) < 7:  # Need at least question + 4 options + answer
            continue
            
        # Extract question text
        question_text = lines[0].strip()
        if not question_text:
            continue
            
        # Find the options (lines starting with -)
        options = []
        answer_line = ""
        
        for line in lines[1:]:
            line = line.strip()
            if line.startswith('- '):
                # Extract option text after "- A) ", "- B) ", etc.
                option_match = re.match(r'- [A-D]\) (.+)', line)
                if option_match:
                    options.append(option_match.group(1))
            elif line.startswith('**Answer:**'):
                # Extract answer text after "**Answer:** A) "
                answer_match = re.match(r'\*\*Answer:\*\* [A-D]\) (.+)', line)
                if answer_match:
                    answer_line = answer_match.group(1)
        
        # Only add if we have all required parts
        if question_text and len(options) == 4 and answer_line:
            questions.append({
                'question': question_text,
                'options': options,
                'correct': answer_line,
                'category': 'August 17th History'
            })
    
    return questions

def generate_questions_js(questions):
    """Generate the questions.js file content"""
    js_content = "// Auto-generated from 100questions.md\n"
    js_content += "// Generated on: " + str(len(questions)) + " questions total\n\n"
    js_content += "const triviaQuestions = [\n"
    
    for i, q in enumerate(questions):
        js_content += "    {\n"
        js_content += f"        question: {json.dumps(q['question'])},\n"
        js_content += f"        options: {json.dumps(q['options'])},\n"
        js_content += f"        correct: {json.dumps(q['correct'])},\n"
        js_content += f"        category: {json.dumps(q['category'])}\n"
        js_content += "    }"
        if i < len(questions) - 1:
            js_content += ","
        js_content += "\n"
    
    js_content += "];\n"
    return js_content

def main():
    print("🔄 Parsing /home/tourniquetrules/80th100questions.md...")
    
    try:
        questions = parse_questions_from_file('/home/tourniquetrules/80th100questions.md')
        
        if not questions:
            print("❌ No questions found! Check the file format.")
            return
        
        print(f"✅ Found {len(questions)} questions")
        
        # Generate questions.js
        js_content = generate_questions_js(questions)
        
        with open('questions.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"✅ Generated questions.js with {len(questions)} questions")
        print("📝 All questions categorized as 'August 17th History'")
        
    except FileNotFoundError:
        print("❌ Could not find /home/tourniquetrules/80th100questions.md file")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
