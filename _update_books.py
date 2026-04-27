"""Replace the books grid in the 3 home pages with the full 18-book lineup,
ordered chronologically (newest first). Excludes Art of Living Large series.
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent
AMZ = 'https://www.amazon.com/stores/Goran-Trajkovski/author/B0B4BMGMFW'

# Each book: (image filename, alt text, title, sub_en, sub_es, sub_mk)
BOOKS = [
    ('mindmeetsmachine.jpg',
     'Mind Meets Machine',
     'Mind Meets Machine',
     'The Evolution of Learning from Ancient Wisdom to AI · 2025',
     'La evolución del aprendizaje desde la sabiduría antigua hasta la IA · 2025',
     'Еволуцијата на учењето од древната мудрост до вештачката интелигенција · 2025'),

    ('BookCoverFinal.jpg',
     'Assessment Under Adversarial Pressure',
     'Assessment Under Adversarial Pressure',
     'Why AI Broke the Evidence Model in Higher Education',
     'Por qué la IA rompió el modelo de evidencia en la educación superior',
     'Како ВИ го разби моделот на докази во високото образование'),

    ('CoverGreen.png',
     "Nurturing Bloom's Garden",
     "Nurturing Bloom's Garden",
     'How AI Transforms the Educational Landscape · 2024',
     'Cómo la IA transforma el panorama educativo · 2024',
     'Како ВИ ја трансформира едукативната сцена · 2024'),

    ('cover.jpg',
     'AI-Assisted Assessment in Education',
     'AI-Assisted Assessment in Education',
     'Transforming Assessment and Measuring Learning · Palgrave Macmillan · with Heather Hayes',
     'Transformando la evaluación y midiendo el aprendizaje · Palgrave Macmillan · con Heather Hayes',
     'Трансформирање на евалуацијата и мерење на учењето · Palgrave Macmillan · со Хедер Хејс'),

    ('AdversarialAI.png',
     'Adversarial AI Threat Response and Secure Model Design',
     'Adversarial AI Threat Response &amp; Secure Model Design',
     'Practical Techniques for Detecting, Preventing, and Managing AI Vulnerabilities · Apress',
     'Técnicas prácticas para detectar, prevenir y gestionar vulnerabilidades de IA · Apress',
     'Практични техники за детекција и управување со ранливости на ВИ · Apress'),

    ('71jHeSN9tVL._SL1499_.jpg',
     'A More Beautiful Prompt',
     'A More Beautiful Prompt',
     'The Art of Human-Centered Prompt Engineering',
     'El arte de la ingeniería de prompts centrada en lo humano',
     'Уметноста на промпт-инженерство со фокус на човекот'),

    ('AIUnleashed.jpg',
     'AI Unleashed',
     'AI Unleashed',
     "A College Student's Guide to Navigating and Mastering Generative AI",
     'Guía universitaria para navegar y dominar la IA generativa',
     'Студентски водич за разбирање и совладување на генеративна ВИ'),

    ('handbook_ai_ml_customer.jpg',
     'Handbook of Research on AI and ML in Customer Support and Analytics',
     'AI &amp; ML in Customer Support &amp; Analytics',
     'Handbook of Research · IGI Global · 2023',
     'Manual de investigación · IGI Global · 2023',
     'Прирачник за истражување · IGI Global · 2023'),

    ('designing_context_rich_xr.jpg',
     'Designing Context-Rich Learning by Extending Reality',
     'Designing Context-Rich Learning by Extending Reality',
     'IGI Global · 2023',
     'IGI Global · 2023',
     'IGI Global · 2023'),

    ('applyingdatascience.jpg',
     'Applying Data Science and Learning Analytics',
     'Applying Data Science &amp; Learning Analytics',
     "Throughout a Learner's Lifespan · IGI Global · ed. with Demeter &amp; Hayes",
     'A lo largo del ciclo de vida del aprendiz · IGI Global · ed. con Demeter y Hayes',
     'Низ животниот циклус на студентот · IGI Global · ур. со Demeter и Hayes'),

    ('healthcare_data_analytics.jpg',
     'Principles of Healthcare Data Analytics',
     'Principles of Healthcare Data Analytics',
     'A Conceptual and Practical Approach · Cognella Textbook',
     'Un enfoque conceptual y práctico · Libro de texto Cognella',
     'Концептуален и практичен пристап · Учебник на Cognella'),

    ('intro_to_data_science.png',
     'Introduction to Data Science',
     'Introduction to Data Science',
     'A Structured Methodology',
     'Una metodología estructurada',
     'Структурирана методологија'),

    ('most_beautiful_place.jpg',
     'The Most Beautiful Place',
     'The Most Beautiful Place',
     '',
     '',
     ''),

    ('handbook_computational_arts.jpg',
     'Handbook of Research on Computational Arts and Creative Informatics',
     'Computational Arts &amp; Creative Informatics',
     'Handbook of Research · IGI Global',
     'Manual de investigación · IGI Global',
     'Прирачник за истражување · IGI Global'),

    ('intelligent_agents_multi.jpg',
     'Developments in Intelligent Agent Technologies and Multi-Agent Systems',
     'Intelligent Agent Technologies &amp; Multi-Agent Systems',
     'Concepts and Applications · IGI Global',
     'Conceptos y aplicaciones · IGI Global',
     'Концепти и примени · IGI Global'),

    ('handbook_agent_societies.jpg',
     'Handbook of Research on Agent-Based Societies',
     'Agent-Based Societies',
     'Social and Cultural Interactions · Handbook of Research',
     'Interacciones sociales y culturales · Manual de investigación',
     'Социјални и културни интеракции · Прирачник за истражување'),

    ('diversity_it_education.jpg',
     'Diversity in Information Technology Education',
     'Diversity in IT Education',
     'Issues and Controversies',
     'Problemas y controversias',
     'Прашања и контроверзии'),

    ('imitation_modeling_agents.jpg',
     'An Imitation-Based Approach to Modeling Homogenous Agents Societies',
     'Modeling Homogenous Agent Societies',
     'An Imitation-Based Approach',
     'Un enfoque basado en imitación',
     'Пристап заснован на имитација'),
]

def render_grid(lang: str) -> str:
    sub_idx = {'en': 3, 'es': 4, 'mk': 5}[lang]
    cards = []
    for b in BOOKS:
        fname, alt, title, *_ = b
        sub = b[sub_idx]
        cards.append(
            f'        <a class="book" href="{AMZ}" target="_blank" rel="noopener">\n'
            f'          <img src="/assets/img/books/{fname}" alt="{alt}" loading="lazy" />\n'
            f'          <p class="book__title">{title}</p>\n'
            f'          <p class="book__sub">{sub}</p>\n'
            f'        </a>'
        )
    return '<div class="books">\n' + '\n'.join(cards) + '\n      </div>'

# Replace the existing <div class="books">...</div> in each file
TARGETS = {
    ROOT / 'index.html':       'en',
    ROOT / 'es' / 'index.html': 'es',
    ROOT / 'mk' / 'index.html': 'mk',
}

GRID_RE = re.compile(r'<div class="books">.*?</div>', re.DOTALL)

for path, lang in TARGETS.items():
    if not path.exists():
        print(f'  MISSING: {path}')
        continue
    text = path.read_text(encoding='utf-8')
    new_grid = render_grid(lang)
    new_text, n = GRID_RE.subn(new_grid, text, count=1)
    if n == 0:
        print(f'  NO MATCH (no <div class="books">): {path.relative_to(ROOT)}')
        continue
    path.write_text(new_text, encoding='utf-8')
    print(f'  OK: {path.relative_to(ROOT)} ({lang}) — {len(BOOKS)} books')

print(f'\nDone. {len(BOOKS)} books per page across {len(TARGETS)} languages.')
