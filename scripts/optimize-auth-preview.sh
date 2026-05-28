#!/usr/bin/env sh
set -eu

SOURCE="${1:-public/auth-home-preview-source.png}"
OUTPUT="public/auth-home-preview.webp"
WIDTH="${AUTH_PREVIEW_WIDTH:-1280}"
QUALITY="${AUTH_PREVIEW_QUALITY:-74}"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp nao encontrado. Instale webp para otimizar a imagem." >&2
  exit 1
fi

if [ ! -f "$SOURCE" ]; then
  echo "Arquivo de origem nao encontrado: $SOURCE" >&2
  echo "Uso: npm run optimize:auth-preview -- caminho/para/print.png" >&2
  exit 1
fi

cwebp \
  -q "$QUALITY" \
  -m 6 \
  -mt \
  -metadata none \
  -resize "$WIDTH" 0 \
  "$SOURCE" \
  -o "$OUTPUT"

echo "Imagem otimizada gerada em $OUTPUT"
du -h "$OUTPUT"