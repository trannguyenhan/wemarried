#!/usr/bin/env python3
"""
Create Open Graph preview image for social media sharing
"""

import os
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Installing Pillow...")
    os.system("pip3 install Pillow --quiet")
    from PIL import Image, ImageDraw, ImageFont

def create_og_image():
    """Create Open Graph image 1200x630px"""
    # Load hero image
    hero_path = Path('images/DSC07940.jpg')
    if not hero_path.exists():
        print(f"Error: {hero_path} not found")
        return False
    
    try:
        with Image.open(hero_path) as img:
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Create 1200x630 canvas (OG image standard size)
            og_width, og_height = 1200, 630
            og_img = Image.new('RGB', (og_width, og_height), (255, 255, 255))
            
            # Calculate size to fit image while maintaining aspect ratio
            img_width, img_height = img.size
            scale = min(og_width / img_width, og_height / img_height)
            new_width = int(img_width * scale)
            new_height = int(img_height * scale)
            
            # Resize image
            resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Center image on canvas
            x_offset = (og_width - new_width) // 2
            y_offset = (og_height - new_height) // 2
            og_img.paste(resized_img, (x_offset, y_offset))
            
            # Add gradient overlay for text readability (pink theme)
            overlay = Image.new('RGBA', (og_width, og_height), (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            
            # Dark overlay from edges for better text contrast
            for i in range(og_height):
                # Top and bottom gradient
                if i < og_height // 3 or i > og_height * 2 // 3:
                    alpha = int(150 * (1 - abs(i - og_height/2) / (og_height/2)))
                    if alpha > 0:
                        draw.rectangle([(0, i), (og_width, i+1)], fill=(0, 0, 0, alpha))
            
            # Center overlay for text area
            center_y = og_height // 2
            text_area_height = 250
            for i in range(center_y - text_area_height//2, center_y + text_area_height//2):
                alpha = 120
                draw.rectangle([(0, i), (og_width, i+1)], fill=(0, 0, 0, alpha))
            
            og_img = Image.alpha_composite(og_img.convert('RGBA'), overlay).convert('RGB')
            
            # Add text overlay
            draw = ImageDraw.Draw(og_img)
            
            # Try to use a nice font, fallback to default
            try:
                # Try to use system font
                font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
                font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
            except:
                try:
                    font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
                    font_medium = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
                except:
                    font_large = ImageFont.load_default()
                    font_medium = ImageFont.load_default()
            
            # Add couple names
            text1 = "Trần Ngọc Anh"
            text2 = "&"
            text3 = "Nguyễn Quang Huy"
            text4 = "29.11.2025"
            
            # Calculate text positions (centered)
            bbox1 = draw.textbbox((0, 0), text1, font=font_large)
            bbox2 = draw.textbbox((0, 0), text2, font=font_medium)
            bbox3 = draw.textbbox((0, 0), text3, font=font_large)
            bbox4 = draw.textbbox((0, 0), text4, font=font_medium)
            
            text_width1 = bbox1[2] - bbox1[0]
            text_width2 = bbox2[2] - bbox2[0]
            text_width3 = bbox3[2] - bbox3[0]
            text_width4 = bbox4[2] - bbox4[0]
            
            # Draw text with shadow for readability
            y_start = og_height // 2 - 100
            
            # Text shadow
            shadow_offset = 3
            draw.text(((og_width - text_width1) // 2 + shadow_offset, y_start + shadow_offset), 
                     text1, fill=(0, 0, 0, 180), font=font_large)
            draw.text(((og_width - text_width2) // 2 + shadow_offset, y_start + 70 + shadow_offset), 
                     text2, fill=(0, 0, 0, 180), font=font_medium)
            draw.text(((og_width - text_width3) // 2 + shadow_offset, y_start + 110 + shadow_offset), 
                     text3, fill=(0, 0, 0, 180), font=font_large)
            draw.text(((og_width - text_width4) // 2 + shadow_offset, y_start + 180 + shadow_offset), 
                     text4, fill=(0, 0, 0, 180), font=font_medium)
            
            # Text with pink gradient effect
            # Text 1 - Trần Ngọc Anh
            draw.text(((og_width - text_width1) // 2, y_start), 
                     text1, fill=(255, 255, 255), font=font_large)
            # Text 2 - &
            draw.text(((og_width - text_width2) // 2, y_start + 70), 
                     text2, fill=(255, 179, 209), font=font_medium)  # Pastel pink color
            # Text 3 - Nguyễn Quang Huy
            draw.text(((og_width - text_width3) // 2, y_start + 110), 
                     text3, fill=(255, 255, 255), font=font_large)
            # Text 4 - Date
            draw.text(((og_width - text_width4) // 2, y_start + 180), 
                     text4, fill=(255, 255, 255), font=font_medium)
            
            # Save OG image
            output_path = Path('images/og-image.jpg')
            og_img.save(output_path, 'JPEG', quality=90, optimize=True)
            
            print(f"✓ Created Open Graph image: {output_path}")
            print(f"  Size: {og_width}x{og_height}px")
            return True
            
    except Exception as e:
        print(f"Error creating OG image: {e}")
        return False

if __name__ == '__main__':
    create_og_image()

