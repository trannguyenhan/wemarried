#!/usr/bin/env python3
"""
Script to optimize images for web
Resizes and compresses images to reduce file size
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
    import pillow_heif
except ImportError:
    print("Installing required packages...")
    os.system("pip3 install Pillow pillow-heif --quiet")
    from PIL import Image
    import pillow_heif

def optimize_image(input_path, output_path, max_width=1920, max_height=1920, quality=85):
    """Optimize a single image"""
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = rgb_img
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Calculate new size maintaining aspect ratio
            width, height = img.size
            if width > max_width or height > max_height:
                ratio = min(max_width / width, max_height / height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized image
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            reduction = ((original_size - new_size) / original_size) * 100
            
            return {
                'success': True,
                'original_size': original_size,
                'new_size': new_size,
                'reduction': reduction
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    images_dir = Path('images')
    optimized_dir = Path('images/optimized')
    
    # Create optimized directory
    optimized_dir.mkdir(exist_ok=True)
    
    # Get all image files
    image_files = list(images_dir.glob('*.jpg')) + list(images_dir.glob('*.jpeg')) + \
                  list(images_dir.glob('*.JPG')) + list(images_dir.glob('*.JPEG'))
    
    if not image_files:
        print("No images found in images/ directory")
        return
    
    print(f"Found {len(image_files)} images to optimize...")
    print("-" * 60)
    
    total_original = 0
    total_optimized = 0
    
    for img_path in image_files:
        output_path = optimized_dir / img_path.name
        
        print(f"Processing: {img_path.name}...", end=' ')
        
        # Different sizes for different uses
        if 'DSC07940' in img_path.name:  # Hero image
            result = optimize_image(img_path, output_path, max_width=1200, max_height=800, quality=90)
        else:  # Gallery images
            result = optimize_image(img_path, output_path, max_width=800, max_height=800, quality=85)
        
        if result['success']:
            total_original += result['original_size']
            total_optimized += result['new_size']
            reduction = result['reduction']
            print(f"✓ Reduced by {reduction:.1f}% "
                  f"({result['original_size']//1024}KB → {result['new_size']//1024}KB)")
        else:
            print(f"✗ Error: {result['error']}")
    
    print("-" * 60)
    total_reduction = ((total_original - total_optimized) / total_original) * 100
    print(f"Total: {total_original//1024//1024}MB → {total_optimized//1024//1024}MB "
          f"(Reduced by {total_reduction:.1f}%)")
    print(f"\nOptimized images saved to: {optimized_dir}")
    print("Update your HTML to use images from 'images/optimized/' directory")

if __name__ == '__main__':
    main()

