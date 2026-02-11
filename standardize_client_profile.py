
import os
import re

client_dir = r"c:\Users\SUPRAJA\Desktop\project-11\client"

def standardize_client_profile():
    for filename in os.listdir(client_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(client_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1. Update Name and Role in Navbar
            # Warning: This regex assumes a specific structure.
            # <p class="text-sm font-bold">...</p>
            # <p class="text-xs text-gray-500">...</p>
            # We want to catch "Johnathan Doe", "Sarah Johnson", etc. and "Client", "Admin", etc.
            
            # Pattern matches the name paragraph and the role paragraph
            pattern_text = r'(<p class="text-sm font-bold">)(.*?)(</p>\s*<p class="text-xs text-gray-500">)(.*?)(</p>)'
            
            def replace_text(match):
                # match.group(1) is start tag 1
                # match.group(2) is existing name
                # match.group(3) is middle tags
                # match.group(4) is existing role
                # match.group(5) is end tag
                return f'{match.group(1)}Robert Miller{match.group(3)}Facility Manager{match.group(5)}'

            new_content = re.sub(pattern_text, replace_text, content)

            # 2. Update Avatar Image URL
            # Replace u=inspector or u=sarah with u=client
            new_content = re.sub(r'u=(inspector|sarah)', 'u=client', new_content)

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
            else:
                print(f"No changes in {filename}")

if __name__ == "__main__":
    standardize_client_profile()
