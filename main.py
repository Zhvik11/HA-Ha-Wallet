from PIL import Image, ImageDraw, ImageFont
import os

def create_meme(image_path, top_text, bottom_text, output_path="meme.jpg"):
    # Проверяем, существует ли изображение
    if not os.path.exists(image_path):
        print(f"Ошибка: файл '{image_path}' не найден.")
        return
    
    # Открываем картинку
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)

    # Загружаем шрифт (если Impact.ttf нет, используй arial.ttf)
    try:
        font = ImageFont.truetype("impact.ttf", size=int(img.width / 10))
    except IOError:
        font = ImageFont.truetype("arial.ttf", size=int(img.width / 10))

    def draw_text(text, position):
        w, h = font.getbbox(text)[2:]  # Новый способ измерения текста
        x = (img.width - w) / 2
        draw.text((x, position), text, font=font, fill="white", stroke_width=2, stroke_fill="black")

    draw_text(top_text, 10)
    draw_text(bottom_text, img.height - 60)

    # Сохраняем и открываем мем
    img.save(output_path)
    img.show()
    print(f"✅ Мем сохранен как '{output_path}'")

# 📌 Запуск генератора мема
image_path = r"d:\Unity\Projects\HA-Ha-Wallet\template.jpg"
create_meme(image_path, "Когда крипта растет", "А ты продал вчера")



