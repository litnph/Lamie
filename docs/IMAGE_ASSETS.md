# Ảnh concept và placeholder Lamie

## Trạng thái sử dụng

Năm ảnh dưới đây được tạo mới bằng built-in `imagegen` ngày 2026-09-23, sau đó chuyển sang WebP chất lượng 0.82 và giới hạn chiều rộng tối đa 1200px. Đây là ảnh concept phục vụ giao diện, không phải ảnh sản phẩm đang bán và không phải bằng chứng về mẫu hoa Lamie có thể cung cấp.

| Asset | Kích thước | Mục đích | Trạng thái |
| --- | ---: | --- | --- |
| `public/images/editorial/hero-botanical-editorial.webp` | 1122×1402 | Hero và inline bloom | Cần Lamie duyệt trước production |
| `public/images/editorial/story-florist-craft.webp` | 1122×1402 | Story/quy trình thủ công | Cần Lamie duyệt trước production |
| `public/images/editorial/category-fresh-flowers.webp` | 1086×1448 | Nền tile Hoa tươi | Concept, không phải sản phẩm |
| `public/images/editorial/category-lasting-flowers.webp` | 1086×1448 | Nền tile Hoa sáp & lụa | Concept, không phải sản phẩm |
| `public/images/editorial/product-placeholder.webp` | 1122×1402 | Fallback khi thiếu/lỗi ảnh | Placeholder phi hiện thực |

Không đổi caption hoặc dùng bốn ảnh editorial làm ảnh catalog production nếu Lamie chưa duyệt. Placeholder phải tiếp tục đi cùng nhãn “Ảnh đang cập nhật”.

## Prompt set đã dùng

### Hero

```text
Use case: photorealistic-natural
Asset type: Lamie flower shop website hero image, portrait 4:5 crop
Primary request: create an original editorial florist-studio still life that feels quiet, handcrafted and premium, showing loose fresh stems and partially wrapped flowers rather than a finished catalog product
Scene/backdrop: warm cream handmade paper backdrop with subtle fiber texture, a muted sage paper layer and a dusty rose paper edge
Subject: ivory garden roses, delicate pale blue delphinium-like flowers, a few blush accents, natural green stems, kraft wrapping paper and one soft ribbon; no price card and no branded packaging
Style/medium: photorealistic natural editorial photography, tactile and imperfect, refined Vietnamese boutique florist mood
Composition/framing: vertical 4:5, arrangement slightly off-center, complete silhouette, clean margins, enough breathing room for an editorial frame crop
Lighting/mood: diffused window light, gentle shadows, warm calm atmosphere, restrained saturation, subtle film grain
Color palette: paper cream, ink brown, botanical sage, dusty rose, small pale-blue accent
Materials/textures: real petals, crinkled kraft paper, woven ribbon, handmade paper grain
Constraints: no text, no letters, no logo, no watermark, no hands, no people, no storefront, no artificial plastic look; do not imitate a named photographer; this is atmospheric brand imagery, not a sellable product listing
```

### Story / florist craft

```text
Use case: photorealistic-natural
Asset type: Lamie flower shop website story section image, portrait 4:5 crop
Primary request: original candid editorial photograph of a florist's hands quietly preparing loose flower stems at a working table, focused on craft and care rather than a finished commercial bouquet
Scene/backdrop: intimate daylight flower studio with a warm cream plaster wall and a simple wood worktable
Subject: only forearms and natural hands visible, trimming and arranging ivory roses, pale blush lisianthus, small blue accents and green foliage; kraft paper, cotton ribbon and florist scissors placed naturally
Style/medium: photorealistic documentary editorial photography, tactile, authentic, subtle imperfections, no staged advertising gloss
Composition/framing: vertical 4:5, hands and work centered low-to-middle, generous calm negative space above, all fingers anatomically natural
Lighting/mood: soft side window light, quiet reflective atmosphere, restrained contrast, subtle film grain
Color palette: paper cream, warm wood, botanical sage, dusty rose, pale blue
Materials/textures: petal texture, leaf veins, worn wood, crinkled kraft, woven ribbon
Constraints: no face, no text, no letters, no logo, no watermark, no price cards, no finished sellable product, no plastic-looking flowers, no extra fingers or malformed hands
```

### Hoa tươi

```text
Use case: photorealistic-natural
Asset type: Lamie website category tile background for fresh flowers, portrait 3:4
Primary request: original close editorial photograph expressing living fresh flowers through loose garden stems, water droplets and varied natural petal textures, not a finished bouquet or catalog product
Scene/backdrop: shadowed florist workbench with muted plaster and dark earthy paper behind
Subject: fresh blush roses, ivory lisianthus, airy pale-blue flowers and botanical foliage in loose unbound stems; a small ceramic water vessel may sit deep in the background
Style/medium: photorealistic natural editorial photography, premium yet unpolished, botanical still life
Composition/framing: portrait 3:4, flower detail concentrated in upper and middle zones; lower third intentionally darker and visually quiet for white UI copy; no hard border
Lighting/mood: cool soft window light on petals, deep warm shadows toward the bottom, calm and tactile
Color palette: dusty rose, ivory, pale blue, sage, ink brown
Materials/textures: dew, real petals, leaf veins, handmade paper, matte ceramic
Constraints: no text, no letters, no logo, no watermark, no hands, no people, no ribbon label, no price card, no complete sellable bouquet, no plastic look
```

### Hoa sáp và lụa

```text
Use case: photorealistic-natural
Asset type: Lamie website category tile background for wax and silk flowers, portrait 3:4
Primary request: original editorial craft still life expressing long-lasting wax and silk floral work through loose petals, fabric flowers and careful handmade materials, not a finished catalog arrangement
Scene/backdrop: quiet artisan table with warm handmade paper, folded silk, cotton ribbon and a muted sage wall
Subject: refined ivory and dusty-rose silk flower heads, one pale blue accent flower, loose cream wax petals, botanical-shaped leaves, thread spool and ribbon arranged naturally; materials should look intentionally handcrafted and premium
Style/medium: photorealistic editorial craft photography, tactile, restrained, sophisticated, clearly a material study rather than fresh-flower realism
Composition/framing: portrait 3:4, crafted flower materials concentrated in upper and middle zones; lower third darker and visually quiet for white UI copy
Lighting/mood: warm grazing window light, calm atelier atmosphere, gentle shadows, subtle film grain
Color palette: cream, dusty rose, botanical sage, pale blue, ink brown
Materials/textures: matte silk, soft cotton ribbon, waxy petal edges, handmade paper, wood grain
Constraints: no text, no letters, no logo, no watermark, no hands, no people, no price card, no finished sellable bouquet, no cheap plastic sheen, no glitter
```

### Product placeholder

```text
Use case: stylized-concept
Asset type: Lamie product-image placeholder artwork, portrait 4:5
Primary request: an original minimal botanical paper collage that clearly reads as an editorial placeholder rather than a real flower product photo
Scene/backdrop: flat warm cream handmade paper
Subject: abstract cut-paper flower silhouette assembled from one dusty-rose bloom shape, two botanical-sage leaves, a thin ink-brown stem, a small pale-blue paper accent and a loosely torn kraft-paper wrapping shape
Style/medium: tactile handmade paper collage photographed straight-on, elegant and sparse, visible deckled edges, subtle paper fibers, no photoreal flowers
Composition/framing: centered vertical 4:5, generous empty margin, strong simple silhouette suitable behind an “image updating” label
Lighting/mood: even soft studio light with only very shallow paper-edge shadows
Color palette: paper cream, dusty rose, botanical sage, ink brown, pale blue, kraft
Materials/textures: handmade paper, deckled torn edges, matte fibers
Constraints: no text, no letters, no logo, no watermark, no vase, no real bouquet, no gradient, no plastic, no people, no hands, no decorative border
```

## Tối ưu và tái tạo

Lệnh tối ưu một ảnh:

```bash
node scripts/optimize-image.mjs input.png public/images/editorial/output.webp 1200 0.82
```

Script dùng Microsoft Edge qua `playwright-core`, giữ đúng tỷ lệ ảnh và xuất WebP. Không ghi đè ảnh nguồn nếu chưa được yêu cầu.
