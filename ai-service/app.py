import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from classifier import ComplaintClassifier
from summarizer import summarize
from duplicate_detector import find_possible_duplicates

app = Flask(__name__)
CORS(app)

classifier = ComplaintClassifier()


@app.get('/health')
def health():
    return jsonify({'status': 'ok', 'service': 'CrimeTrack AI Service'})


@app.post('/classify')
def classify():
    data = request.get_json(silent=True) or {}
    description = data.get('description') or ''
    result = classifier.predict(description)
    result['source'] = 'ai-service'
    return jsonify(result)


@app.post('/summarize')
def summarize_route():
    data = request.get_json(silent=True) or {}
    description = data.get('description') or ''
    title = data.get('title') or ''
    summary = summarize(description, title=title)
    return jsonify({'summary': summary, 'source': 'ai-service'})


@app.post('/duplicate-check')
def duplicate_check():
    data = request.get_json(silent=True) or {}
    report = data.get('report') or {}
    existing = data.get('existing') or []
    matches = find_possible_duplicates(report, existing)
    return jsonify({'possibleDuplicates': matches, 'source': 'ai-service'})


def chatbot_reply(message: str):
    m = (message or '').lower().strip()
    if not m:
        return "Please ask a question about reporting, tracking complaints, safety tips, or emergency contacts."
    if any(k in m for k in ['track', 'status', 'complaint id', 'complaintid']):
        return ("To track a complaint, open the 'Track Complaint' page and enter your unique complaint ID (for example, CT-2026-123456). "
                "You will see the current status, timeline, and latest updates. Authorized users may see additional details for their own complaints.")
    if any(k in m for k in ['report', 'submit', 'file a complaint', 'how to complain', 'lodge']):
        return ("To submit a crime report: register or log in as a citizen, go to 'Report a Crime', complete the form with incident details, "
                "location, date/time, and optionally upload evidence, then submit. You will receive a unique complaint ID to track progress.")
    if any(k in m for k in ['emergency', 'police number', 'ambulance', 'fire', 'helpline', '112', '100']):
        return ("If you are in immediate danger, contact local emergency services immediately. Common numbers: Police 100, Ambulance 108/102, "
                "Fire 101, Women Helpline 1091, Child Helpline 1098, National Emergency 112 (availability may vary by region). "
                "I am an AI assistant, not an emergency response service.")
    if any(k in m for k in ['safety', 'tip', 'prevent', 'protect', 'secure']):
        return ("General safety tips: stay aware of your surroundings, avoid sharing sensitive personal information, secure your home and devices, "
                "keep emergency contacts accessible, travel in well-lit areas when possible, and report suspicious activity through official channels. "
                "For immediate threats, contact emergency services.")
    if any(k in m for k in ['evidence', 'upload', 'photo', 'document']):
        return ("When reporting a crime, you can upload supporting evidence such as images or documents (subject to file type and size limits). "
                "Evidence is stored securely and access is restricted to authorized users.")
    if any(k in m for k in ['hello', 'hi', 'hey']):
        return ("Hello! I can help with general public safety questions, how to submit or track complaints, and emergency contact information. "
                "I cannot identify suspects or make enforcement decisions.")
    return ("I can help with: (1) how to submit a crime report, (2) how to track complaint status, (3) general public safety tips, and "
            "(4) emergency contact information. I am not an emergency response service and I do not identify suspects or determine guilt. "
            "Please tell me what you need help with.")


@app.post('/chat')
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get('message') or ''
    return jsonify({'reply': chatbot_reply(message), 'source': 'ai-service'})


if __name__ == '__main__':
    port = int(os.environ.get('AI_PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
