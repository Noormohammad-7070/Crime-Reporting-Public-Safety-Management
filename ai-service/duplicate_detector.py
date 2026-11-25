import re


def _tokens(text: str):
    words = re.findall(r'[a-z0-9]+', (text or '').lower())
    stop = {'the', 'and', 'for', 'with', 'was', 'were', 'from', 'that', 'this', 'have', 'has', 'had', 'near', 'area', 'report', 'reported', 'incident'}
    return set(w for w in words if len(w) > 2 and w not in stop)


def similarity(a: str, b: str):
    ta, tb = _tokens(a), _tokens(b)
    if not ta or not tb:
        return 0.0
    inter = len(ta & tb)
    union = len(ta | tb)
    return inter / union if union else 0.0


def find_possible_duplicates(report: dict, existing: list, threshold: float = 0.35, limit: int = 5):
    if not report:
        return []
    r_text = f"{report.get('title','')} {report.get('description','')}"
    r_date = str(report.get('incidentDate', ''))[:10]
    r_loc = str(report.get('location', '')).strip().lower()
    r_cat = str(report.get('category', '')).strip().lower()
    results = []
    for e in existing or []:
        e_text = f"{e.get('title','')} {e.get('description','')}"
        sim = similarity(r_text, e_text)
        score = sim * 0.7
        e_date = str(e.get('incidentDate', ''))[:10]
        e_loc = str(e.get('location', '')).strip().lower()
        e_cat = str(e.get('category', '')).strip().lower()
        if r_date and e_date and r_date == e_date:
            score += 0.15
        if r_loc and e_loc and (r_loc == e_loc or r_loc in e_loc or e_loc in r_loc):
            score += 0.1
        if r_cat and e_cat and r_cat == e_cat:
            score += 0.05
        if score >= threshold:
            results.append({
                'complaintId': e.get('complaintId'),
                'title': e.get('title'),
                'category': e.get('category'),
                'incidentDate': e.get('incidentDate'),
                'location': e.get('location'),
                'similarity': round(min(score, 0.99), 2),
            })
    results.sort(key=lambda x: x['similarity'], reverse=True)
    return results[:limit]
