---
name: gemini-learned-1715000000
description: Knowledge learned by Gemini via /learn
metadata:
  type: learning
  source: gemini-model
  date: 2026-07-07T00:00:00Z
  method: /learn-via-gemini
---

# Gemini Learning: PyThaiNLP

## Key Concepts
### Overview
**PyThaiNLP** is an open-source Python library for Thai Natural Language Processing (NLP), designed to be a "NLTK for Thai". It provides a comprehensive set of tools for processing Thai text, which is notably difficult due to the lack of word boundaries (no spaces between words).

### Core Features
- **Word Segmentation**: The most critical feature. It supports several engines:
    - `newmm`: The default dictionary-based engine using Maximum Matching.
    - `attacut`: A fast, neural-network-based segmenter.
    - `deepcut`: A high-accuracy segmenter using Deep Learning (CNN).
- **Part-of-Speech (POS) Tagging**: Assigning grammatical categories to words.
- **Transliteration**: Converting Thai script to Romanization (e.g., for search or phonetic display).
- **Spell Correction**: Suggesting corrections based on Thai dictionaries.
- **Thai Formatting**:
    - `thai_strftime`: Formatting dates into Thai style (Buddhist Era).
    - `bahttext`: Converting numbers to Thai Baht text (e.g., for invoices).
- **Soundex**: Phonetic algorithms for Thai to find similar-sounding words.

### Installation & Basic Usage
```python
# Install
pip install pythainlp

# Basic Word Segmentation
from pythainlp import word_tokenize
text = "ภาษาไทยไม่ยากอย่างที่คิด"
print(word_tokenize(text))
# Output: ['ภาษาไทย', 'ไม่', 'ยาก', 'อย่าง', 'ที่', 'คิด']
```

## How to Apply
For the **Captain Maid** project, PyThaiNLP can be utilized in the following ways:
1. **SEO Optimization**: Analyze Thai keywords and ensure correct segmentation for better search indexability.
2. **Content Generation**: Use `thai_strftime` for accurate Thai date display in blog posts and `bahttext` for promotional pricing.
3. **Sentiment Analysis**: Prepare Thai product reviews for processing by cleaning and segmenting text.
4. **Data Normalization**: Standardize user-generated content or scraped product descriptions from retail sites like HomePro.
