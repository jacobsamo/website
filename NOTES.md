Compressing images using ffmpeg 


```bash
#!/bin/bash

# Directory containing your images (defaults to current directory)
SOURCE_DIR="."

# Output directory for compressed images (creates 'compressed' folder in current dir)
OUTPUT_DIR="./compressed"

# Maximum width in pixels (1920 is good for web, adjust as needed)
MAX_WIDTH=1920

# JPEG quality (1-31, lower is higher quality, 23 is a good balance)
QUALITY=23

# Check if ffmpeg is installed
if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "Error: ffmpeg is not installed. Install it with 'brew install ffmpeg' first."
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Counter for processed files
count=0

# Loop through all image files (jpg, jpeg, png case-insensitive)
for file in "$SOURCE_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
    # Check if files exist (glob might not match anything)
    if [ ! -f "$file" ]; then
        continue
    fi

    # Get filename without path
    filename=$(basename "$file")
    
    # Output file path (force .jpg extension for consistency)
    output_file="$OUTPUT_DIR/${filename%.*}.jpg"
    
    echo "Processing: $filename"
    
    # Use ffmpeg to resize and compress
    # -vf scale maintains aspect ratio, -q:v sets quality
    ffmpeg -i "$file" \
           -vf "scale=$MAX_WIDTH:-1" \
           -q:v "$QUALITY" \
           -y "$output_file" 2>/dev/null
    
    # Increment counter
    ((count++))
    
    # Get original and new file sizes
    original_size=$(stat -f %z "$file")
    new_size=$(stat -f %z "$output_file")
    
    echo "Original size: $((original_size / 1024)) KB -> New size: $((new_size / 1024)) KB"
    echo "------------------------"
done

echo "Processed $count images."
echo "Compressed images saved in: $OUTPUT_DIR"
```