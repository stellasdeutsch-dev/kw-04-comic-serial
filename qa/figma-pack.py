# Упаковывает JSON в PNG (оттенки серого, без сжатия), чтобы передать данные в Figma картинкой
import json, zlib, struct, sys
src, dst = sys.argv[1], sys.argv[2]
raw = open(src, 'rb').read()
data = struct.pack('>I', len(raw)) + raw
W = 1000; H = (len(data) + W - 1) // W
data += b'\0' * (W * H - len(data))
rows = b''.join(b'\0' + data[i*W:(i+1)*W] for i in range(H))
def chunk(t, d): c = struct.pack('>I', len(d)) + t + d; return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', W, H, 8, 0, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(rows, 0)) + chunk(b'IEND', b'')
open(dst, 'wb').write(png); print(dst, len(raw), W, H, len(png))
