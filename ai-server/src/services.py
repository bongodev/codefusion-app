from transformers import pipeline

from src.utils import preprocess_text


def summarize_note(note_data):
    """Generate a summary of the note using a pre-trained LLM."""
    try:
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        text = f"{note_data['title']}\n{note_data['note']}"
        summary = summarizer(preprocess_text(text), max_length=100, min_length=20, do_sample=False)[0]["summary_text"]
        return summary
    except Exception as e:
        return f"Error summarizing note: {str(e)}"


def assign_tag(note_data):
    """Assign a single tag using zero-shot classification with clearer labels."""
    try:
        classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        text = f"{note_data['title']}\n{note_data['note']}"

        # More explicit candidate labels
        candidate_labels = ["Educational session", "Project meeting", "Personal note"]

        result = classifier(preprocess_text(text), candidate_labels, multi_label=False)

        top_label = result["labels"][0]

        return top_label
    except Exception as e:
        return {"error": str(e)}


def analyze_sentiment(note_data) -> dict:
    """Analyze sentiment and map to an emoji."""
    try:
        sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        text = f"{note_data['title']}\n{note_data['note']}"
        sentiment = sentiment_analyzer(preprocess_text(text))[0]
        label, score = sentiment["label"], sentiment["score"]
        return {
            "label": label,
            "score": score,
        }
    except Exception as e:
        return {"error": str(e)}
