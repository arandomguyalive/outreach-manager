import re

file_path = 'src/data/replies.ts'

with open(file_path, 'r') as f:
    content = f.read()

# Pattern to match the start of the reply object
# reply: {
#   from: ...
pattern = r"(reply:\s*\{)(\s*from:)"
replacement = r"\1\n      to: 'info@abhed.co',\2"

# Apply replacement
new_content = re.sub(pattern, replacement, content)

with open(file_path, 'w') as f:
    f.write(new_content)

print("Updated src/data/replies.ts")
