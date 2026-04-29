import os
import sys
import glob
from google import genai
from google.genai import types

# Ensure the API key is available
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY environment variable is not set.")
    sys.exit(1)

client = genai.Client(api_key=api_key)

def list_files(directory: str) -> str:
    """Lists all files in a given directory recursively. Ignore node_modules, .git, and __pycache__."""
    print(f">> Agent called list_files('{directory}')")
    files = glob.glob(f"{directory}/**/*", recursive=True)
    filtered = [f for f in files if os.path.isfile(f) and '__pycache__' not in f and 'node_modules' not in f and '.git' not in f]
    return "\n".join(filtered) if filtered else "No files found."

def read_file(filepath: str) -> str:
    """Reads the content of a file."""
    print(f">> Agent called read_file('{filepath}')")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {e}"

def write_file(filepath: str, content: str) -> str:
    """Writes the given content to a file, completely overwriting it."""
    print(f">> Agent called write_file('{filepath}')")
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return f"Successfully wrote to {filepath}"
    except Exception as e:
        return f"Error writing file: {e}"

def search_code(query: str) -> str:
    """Searches for a text query across all files and returns matching lines."""
    print(f">> Agent called search_code('{query}')")
    results = []
    files = glob.glob("**/*", recursive=True)
    for f in files:
        if os.path.isfile(f) and '__pycache__' not in f and 'node_modules' not in f and '.git' not in f:
            try:
                with open(f, 'r', encoding='utf-8') as file:
                    lines = file.readlines()
                    for i, line in enumerate(lines):
                        if query.lower() in line.lower():
                            results.append(f"{f}:{i+1}: {line.strip()}")
            except:
                pass
    return "\n".join(results) if results else "No matches found."

def finish(summary: str) -> str:
    """Call this tool when you have successfully completed the task and made all necessary file changes."""
    print(f">> Agent called finish('{summary}')")
    return f"TASK_COMPLETED: {summary}"

def resolve_issue(issue_title, issue_body):
    system_instruction = (
        "You are an autonomous AI software engineer. Your task is to resolve a GitHub issue.\n"
        "You have access to tools to navigate the file system, read files, write files, and search code.\n"
        "Steps to follow:\n"
        "1. First, search for relevant code or list files to understand where to make the change.\n"
        "2. Read the files you need to modify to understand the current implementation.\n"
        "3. Rewrite the files with the requested changes using write_file (always provide the COMPLETE file content, do not output partial snippets).\n"
        "4. Call the finish tool with a summary of your changes when you are completely done."
    )
    
    prompt = f"Please resolve the following GitHub Issue.\n\nIssue Title: {issue_title}\nIssue Body: {issue_body}\n"
    
    chat = client.chats.create(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=[list_files, read_file, write_file, search_code, finish],
            temperature=0.0
        )
    )
    
    print(f"Starting resolution for issue: {issue_title}")
    
    # Send the initial message
    response = chat.send_message(prompt)
    
    # We loop to allow the agent to make multiple tool calls. 
    # With google-genai, if the agent outputs text without a tool call, we feed it back if it hasn't finished,
    # but the SDK auto-handles tool loop internally. We just check if it finished.
    # However, sometimes the agent might just output text instead of calling finish.
    
    print("\n--- Final Agent Output ---")
    print(response.text)

if __name__ == "__main__":
    title = os.environ.get("ISSUE_TITLE", "Test Issue")
    body = os.environ.get("ISSUE_BODY", "Update the code to add some test feature.")
    
    print(f"Running AI Issue Resolver...")
    resolve_issue(title, body)
