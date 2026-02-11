
import os

client_dir = r"c:\Users\SUPRAJA\Desktop\project-11\client"

def update_client_profile():
    for filename in os.listdir(client_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(client_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Replace Name
            new_content = content.replace("Johnathan Doe", "Sarah Johnson")
            
            # Replace Avatar
            new_content = new_content.replace(
                "https://i.pravatar.cc/150?u=inspector",
                "https://i.pravatar.cc/150?u=sarah"
            )

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
            else:
                print(f"No changes in {filename}")

if __name__ == "__main__":
    update_client_profile()
