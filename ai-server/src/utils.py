def preprocess_text(text: str) -> str:
    """Clean and prepare text for processing."""
    return text.strip().replace("\n", " ")
