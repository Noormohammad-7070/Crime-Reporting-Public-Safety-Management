import re


def summarize(text: str, title: str = '', max_sentences: int = 2, max_chars: int = 240):
    content = (text or '').strip()
    if not content:
        content = (title or '').strip()
    if not content:
        return ''
    # simple extractive heuristic: take first sentences, prefer those with key info words
    sentences = re.split(r'(?<=[.!?])\s+', content)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        sentences = [content]
    keywords = ('stolen', 'robbed', 'assault', 'missing', 'fraud', 'scam', 'harass', 'vandal', 'cyber', 'attack', 'injury', 'reported', 'incident')
    scored = []
    for i, s in enumerate(sentences):
        score = 0
        low = s.lower()
        for k in keywords:
            if k in low:
                score += 1
        score += max(0, 1 - i * 0.1)  # slight preference to earlier sentences
        scored.append((score, i, s))
    scored.sort(key=lambda x: (-x[0], x[1]))
    chosen_idx = sorted([i for _, i, _ in scored[:max_sentences]])
    summary = ' '.join(sentences[i] for i in chosen_idx)
    summary = re.sub(r'\s+', ' ', summary).strip()
    if len(summary) > max_chars:
        summary = summary[: max_chars - 3].rstrip() + '...'
    return summary
