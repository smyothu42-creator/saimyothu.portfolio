from pathlib import Path
from docx import Document
from docx.shared import Pt

path = Path('/Users/saimyothu/claude-workspace/portfolio-revamp/output/docs/Sai_Myo_Thu_Resume.docx')
doc = Document(path)

section_names = {'PROFILE', 'EXPERIENCE', 'CAPABILITIES', 'EDUCATION'}

for index, paragraph in enumerate(doc.paragraphs):
    text = paragraph.text.strip()
    if text in section_names:
        paragraph.paragraph_format.space_before = Pt(9)
        paragraph.paragraph_format.space_after = Pt(4)
        paragraph.paragraph_format.keep_with_next = True
    elif paragraph.style and paragraph.style.name == 'List Bullet':
        paragraph.paragraph_format.space_after = Pt(2.4)
        paragraph.paragraph_format.line_spacing = 1.06
    elif index > 0 and doc.paragraphs[index - 1].text.strip() == 'PROFILE':
        paragraph.paragraph_format.space_after = Pt(5)
        paragraph.paragraph_format.line_spacing = 1.08
    elif text.startswith(('Product design', 'Delivery', 'Tools')):
        paragraph.paragraph_format.space_after = Pt(2)
        paragraph.paragraph_format.line_spacing = 1.05
    elif text.startswith(('Google UX Design', 'Dagon University')):
        paragraph.paragraph_format.space_after = Pt(1.5)
        paragraph.paragraph_format.line_spacing = 1.04

for table in doc.tables:
    for cell in table.rows[0].cells:
        paragraph = cell.paragraphs[0]
        paragraph.paragraph_format.space_before = Pt(2)
        paragraph.paragraph_format.space_after = Pt(1)

doc.save(path)
