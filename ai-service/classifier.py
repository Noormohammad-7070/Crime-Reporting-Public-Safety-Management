try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.naive_bayes import MultinomialNB
    from sklearn.pipeline import Pipeline
    SKLEARN_AVAILABLE = True
except Exception:
    SKLEARN_AVAILABLE = False

CATEGORIES = [
    'Theft', 'Robbery', 'Cybercrime', 'Harassment', 'Assault',
    'Missing Person', 'Fraud', 'Vandalism', 'Domestic Violence', 'Other'
]

# Small built-in training set (fictional examples) for offline classification demo
TRAIN_DATA = [
    ('my phone was stolen at the bus stop pickpocket took wallet', 'Theft'),
    ('bike stolen from parking area last night', 'Theft'),
    ('someone snatched my bag and ran away', 'Theft'),
    ('armed robbery gun knife took cash and jewelry', 'Robbery'),
    ('mugged on street two people robbed me', 'Robbery'),
    ('looted shop with weapon', 'Robbery'),
    ('phishing email asking for otp bank account hacked online scam', 'Cybercrime'),
    ('upi fraud call impersonating bank internet password hacked', 'Cybercrime'),
    ('fake website stole my card details cyber attack', 'Cybercrime'),
    ('someone is stalking and threatening me repeatedly harassment', 'Harassment'),
    ('verbal abuse bullying and lewd messages harassment', 'Harassment'),
    ('physical attack assault beaten hit injured fight', 'Assault'),
    ('stabbed and attacked causing injury violence', 'Assault'),
    ('person missing not found since morning disappeared', 'Missing Person'),
    ('child lost cannot locate family member missing', 'Missing Person'),
    ('cheated in online purchase fraud fake seller no delivery', 'Fraud'),
    ('forgery fake documents impersonation financial fraud scam', 'Fraud'),
    ('property damaged graffiti vandalism wall smashed window broken', 'Vandalism'),
    ('car vandalized spray paint destruction of property', 'Vandalism'),
    ('domestic violence abuse by spouse partner at home family violence', 'Domestic Violence'),
    ('husband beating wife domestic abuse in-laws harassment at home', 'Domestic Violence'),
    ('suspicious activity noise complaint general issue', 'Other'),
    ('lost item found later not a crime', 'Other'),
]

KEYWORDS = {
    'Theft': ['stolen', 'steal', 'theft', 'pickpocket', 'snatch', 'wallet', 'bike', 'phone'],
    'Robbery': ['robbery', 'robbed', 'mugged', 'looted', 'armed', 'gun', 'knife'],
    'Cybercrime': ['cyber', 'hack', 'hacked', 'phishing', 'otp', 'online', 'scam', 'upi', 'password', 'account'],
    'Harassment': ['harass', 'stalk', 'threaten', 'abuse', 'bully', 'lewd'],
    'Assault': ['assault', 'attack', 'beaten', 'hit', 'injury', 'fight', 'stabbed', 'violence'],
    'Missing Person': ['missing', 'disappear', 'not found', 'lost person', 'child lost'],
    'Fraud': ['fraud', 'cheat', 'forgery', 'fake', 'impersonat', 'seller'],
    'Vandalism': ['vandal', 'damage', 'graffiti', 'smashed', 'broken', 'destroy'],
    'Domestic Violence': ['domestic', 'spouse', 'partner', 'in-laws', 'family violence'],
}


class ComplaintClassifier:
    def __init__(self):
        self.model = None
        self.mode = 'rules'
        if SKLEARN_AVAILABLE:
            try:
                texts = [t for t, _ in TRAIN_DATA]
                labels = [l for _, l in TRAIN_DATA]
                self.model = Pipeline([
                    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
                    ('clf', MultinomialNB()),
                ])
                self.model.fit(texts, labels)
                self.mode = 'sklearn'
            except Exception:
                self.model = None
                self.mode = 'rules'

    def predict(self, description: str):
        text = (description or '').strip()
        if not text:
            return {'category': 'Other', 'confidence': 0.0}
        if self.model is not None:
            try:
                pred = self.model.predict([text])[0]
                probs = self.model.predict_proba([text])[0]
                classes = list(self.model.classes_)
                confidence = float(probs[classes.index(pred)]) if pred in classes else 0.5
                confidence = max(0.35, min(confidence, 0.99))
                if pred not in CATEGORIES:
                    pred = 'Other'
                return {'category': pred, 'confidence': round(confidence, 2), 'mode': self.mode}
            except Exception:
                pass
        # rule-based fallback
        low = text.lower()
        best_cat, best_score = 'Other', 0
        for cat, kws in KEYWORDS.items():
            score = sum(1 for kw in kws if kw in low)
            if score > best_score:
                best_cat, best_score = cat, score
        confidence = 0.35 if best_score == 0 else min(0.95, 0.45 + best_score * 0.1)
        return {'category': best_cat, 'confidence': round(confidence, 2), 'mode': 'rules'}

