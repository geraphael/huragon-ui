import zlib
import struct
import math

def create_png(width, height, is_maskable=False):
    # RGBA image buffer
    raw_data = bytearray()
    
    bg_r, bg_g, bg_b = 0x09, 0x09, 0x0b # zinc 950
    card_r, card_g, card_b = 0x18, 0x18, 0x1b # zinc 900
    border_r, border_g, border_b = 0x27, 0x27, 0x2a # zinc 800
    white_r, white_g, white_b = 0xff, 0xff, 0xff
    
    radius = int(width * 0.18) if not is_maskable else 0
    margin = int(width * 0.08) if not is_maskable else 0
    box_w = width - 2 * margin
    box_h = height - 2 * margin
    
    # H stroke coordinates
    h_left = int(width * 0.30)
    h_right = int(width * 0.70)
    h_top = int(height * 0.26)
    h_bottom = int(height * 0.74)
    h_mid = int(height * 0.50)
    h_thick = max(2, int(width * 0.065))
    h_half_thick = h_thick // 2

    for y in range(height):
        # Filter byte 0 (None)
        raw_data.append(0)
        for x in range(width):
            # Check maskable / card bounds
            in_card = False
            in_border = False
            
            if is_maskable:
                in_card = True
            else:
                if (margin <= x < width - margin) and (margin <= y < height - margin):
                    # Check rounded corners
                    cx = margin + radius if x < margin + radius else (width - margin - radius - 1 if x >= width - margin - radius else x)
                    cy = margin + radius if y < margin + radius else (height - margin - radius - 1 if y >= height - margin - radius else y)
                    dx = x - cx
                    dy = y - cy
                    dist = math.sqrt(dx*dx + dy*dy)
                    if dist <= radius:
                        in_card = True
                        if dist >= radius - 1.5:
                            in_border = True
            
            if not in_card:
                # Transparent outside
                raw_data.extend([0, 0, 0, 0])
                continue
            
            # Draw H
            is_h = False
            # left vertical bar
            if (h_left - h_half_thick <= x <= h_left + h_half_thick) and (h_top <= y <= h_bottom):
                is_h = True
            # right vertical bar
            elif (h_right - h_half_thick <= x <= h_right + h_half_thick) and (h_top <= y <= h_bottom):
                is_h = True
            # horizontal bar
            elif (h_left <= x <= h_right) and (h_mid - h_half_thick <= y <= h_mid + h_half_thick):
                is_h = True
                
            if is_h:
                raw_data.extend([white_r, white_g, white_b, 255])
            elif in_border:
                raw_data.extend([border_r, border_g, border_b, 255])
            else:
                raw_data.extend([card_r, card_g, card_b, 255])

    # PNG chunks
    def chunk(tag, data):
        return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", zlib.crc32(tag + data) & 0xffffffff)

    header = b"\x89PNG\r\n\x1a\n"
    ihdr_data = struct.pack("!IIBBBBB", width, height, 8, 6, 0, 0, 0)
    ihdr = chunk(b"IHDR", ihdr_data)
    idat = chunk(b"IDAT", zlib.compress(bytes(raw_data), level=9))
    iend = chunk(b"IEND", b"")

    return header + ihdr + idat + iend

for size in [192, 512]:
    png_data = create_png(size, size, is_maskable=False)
    with open(f"assets/icons/icon-{size}.png", "wb") as f:
        f.write(png_data)
        
    mask_data = create_png(size, size, is_maskable=True)
    with open(f"assets/icons/icon-maskable-{size}.png", "wb") as f:
        f.write(mask_data)

apple_icon = create_png(180, 180, is_maskable=False)
with open("assets/icons/apple-touch-icon.png", "wb") as f:
    f.write(apple_icon)

print("PWA Icons generated successfully!")
