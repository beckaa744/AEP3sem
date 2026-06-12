import os
from PIL import Image

img_dir = r"c:\Users\marot\OneDrive\Documentos\3_SEMESTRE\AEP\AEP3sem\assets\imgs"
files = ["1.png", "2.png", "3.png", "whats-passo4b.jpeg", "whats-passo5.jpeg"]

for f in files:
    path = os.path.join(img_dir, f)
    if os.path.exists(path):
        try:
            with Image.open(path) as img:
                print(f"{f}: format={img.format}, size={img.size}, mode={img.mode}")
        except Exception as e:
            print(f"Error reading {f}: {e}")
    else:
        print(f"{f} does not exist")
