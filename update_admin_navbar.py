
import os

admin_dir = r"c:\Users\SUPRAJA\Desktop\project-11\admin"

def update_admin_navbar():
    for filename in os.listdir(admin_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(admin_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # 1. Hide Logo on Desktop (lg:hidden)
            target_logo = '<a href="index.html" class="flex items-center gap-2">'
            replacement_logo = '<a href="index.html" class="flex items-center gap-2 lg:hidden">'
            
            if target_logo in new_content:
                new_content = new_content.replace(target_logo, replacement_logo)
                print(f"Updated Logo in {filename}")
            
            # 2. Align Actions to Right (ml-auto)
            target_actions = '<div class="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">'
            replacement_actions = '<div class="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0 ml-auto">'
            
            if target_actions in new_content:
                new_content = new_content.replace(target_actions, replacement_actions)
                print(f"Updated Actions Alignment in {filename}")

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
            else:
                print(f"No changes made to {filename}")

if __name__ == "__main__":
    update_admin_navbar()
