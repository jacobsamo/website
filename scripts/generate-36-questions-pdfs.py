"""Generate the downloadable cut-out cards from the website's question data."""

import json
import subprocess
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, A5
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads"

# ReportLab needs a TrueType font for the quotation marks in the prompts.
SYSTEM_FONT = next(
    (
        font for font in (
            Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
            Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        ) if font.exists()
    ),
    None,
)
if SYSTEM_FONT:
    pdfmetrics.registerFont(TTFont("Cards", str(SYSTEM_FONT)))
    FONT_NAME = "Cards"
else:
    FONT_NAME = "Helvetica"

data = subprocess.check_output(
    ["bun", "-e", "import { allSteps, questionSets } from './src/lib/closer-questions.ts'; console.log(JSON.stringify({ allSteps, questionSets }))"],
    cwd=ROOT,
    text=True,
)
source = json.loads(data)


def draw_pdf(name, size, columns):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    page_width, page_height = size
    margin = 24
    gap = 7
    footer_height = 20
    rows = 4
    card_width = (page_width - margin * 2 - gap * (columns - 1)) / columns
    card_height = (page_height - margin * 2 - footer_height - gap * (rows - 1)) / rows
    per_page = columns * rows
    pdf = canvas.Canvas(str(OUTPUT / name), pagesize=size)
    pdf.setTitle("36 questions to get a little closer - printable cards")
    pdf.setAuthor("Jacob Samorowski")

    def draw_footer(page_number):
        pdf.setFillColor(colors.HexColor("#766d72"))
        pdf.setFont(FONT_NAME, 7)
        pdf.drawString(margin, 13, "Adapted from Aron et al. (1997)  |  jacobsamorowski.com")
        pdf.drawRightString(page_width - margin, 13, str(page_number))

    for index, step in enumerate(source["allSteps"]):
        slot = index % per_page
        if slot == 0 and index:
            draw_footer(index // per_page)
            pdf.showPage()
        column = slot % columns
        row = slot // columns
        x = margin + column * (card_width + gap)
        y = page_height - margin - card_height - row * (card_height + gap)
        set_index = step["setIndex"]
        fill = source["questionSets"][set_index]["colour"] if set_index < 3 else "#f6e7c8"

        pdf.setFillColor(colors.HexColor(fill))
        pdf.roundRect(x, y, card_width, card_height, 8, stroke=0, fill=1)
        pdf.setStrokeColor(colors.HexColor("#766d72"))
        pdf.setLineWidth(0.6)
        pdf.setDash(2, 3)
        pdf.roundRect(x, y, card_width, card_height, 8, stroke=1, fill=0)
        pdf.setDash()

        inset = 14
        label = f"SET {set_index + 1}" if set_index < 3 else "OPTIONAL ENDING"
        number = f"{step['number']:02}" if index < 36 else "*"
        pdf.setFillColor(colors.HexColor("#443d43"))
        pdf.setFont(FONT_NAME, 8)
        pdf.drawString(x + inset, y + card_height - 22, label)
        pdf.drawRightString(x + card_width - inset, y + card_height - 22, number)

        text = step["text"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        font_size = 13 if columns == 1 else 11
        style = ParagraphStyle(
            "card", fontName=FONT_NAME, fontSize=font_size,
            leading=font_size * 1.35, textColor=colors.HexColor("#302b35"),
            alignment=TA_CENTER,
        )
        paragraph = Paragraph(text, style)
        available_width = card_width - inset * 2
        available_height = card_height - 54
        _, height = paragraph.wrap(available_width, available_height)
        while height > available_height and font_size > 9:
            font_size -= 0.5
            style.fontSize = font_size
            style.leading = font_size * 1.35
            paragraph = Paragraph(text, style)
            _, height = paragraph.wrap(available_width, available_height)
        paragraph.drawOn(pdf, x + inset, y + (card_height - height) / 2 - 5)

    draw_footer((len(source["allSteps"]) + per_page - 1) // per_page)
    pdf.save()


draw_pdf("36-questions-a4.pdf", A4, 2)
draw_pdf("36-questions-a5.pdf", A5, 1)
