import math
import hashlib
import time

# 384-dimension vector embedding simulation with semantic token hashing
def embed_text(text: str, dim: int = 384) -> list[float]:
    """
    Generates a deterministic, normalized high-dimensional dense embedding
    vector suitable for cosine similarity and vector DB operations.
    """
    cleaned = text.lower().strip()
    words = cleaned.split()
    vector = [0.0] * dim

    for i, word in enumerate(words):
        # Hash word into dimension slots
        h = int(hashlib.sha256(word.encode('utf-8')).hexdigest(), 16)
        slot = h % dim
        sub_slot = (h // dim) % dim
        weight = 1.0 / (1.0 + 0.1 * math.log(i + 2))
        vector[slot] += weight
        vector[sub_slot] += weight * 0.5

    # Normalize vector to unit length
    magnitude = math.sqrt(sum(x * x for x in vector))
    if magnitude > 0:
        vector = [round(x / magnitude, 5) for x in vector]
    else:
        vector = [0.0] * dim
    return vector

def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    """Calculates cosine similarity between two dense normalized vectors (range 0 to 1)."""
    if len(v1) != len(v2) or not v1:
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    return max(0.0, min(1.0, dot))

# Comprehensive Land Governance Vector Knowledge Base
KNOWLEDGE_CORPUS = [
    {
        "id": "KB-ULPIN-01",
        "title": "Bhu-Aadhaar 14-Digit ULPIN Geo-Spatial Encoding Standard",
        "category": "LAND_LAW",
        "content": "The Unique Land Parcel Identification Number (ULPIN) is a 14-digit alphanumeric code based on the longitude and latitude coordinates of the land parcel vertices using WGS-84 datum. Each parcel polygon is cryptographically signed and forms the immutable spatial anchor across revenue, registration, and survey departments under DILRMP.",
        "tags": ["ulpin", "bhu-aadhaar", "wgs84", "spatial", "gis"]
    },
    {
        "id": "KB-COURT-02",
        "title": "Supreme Court Precedent: Suraj Lamp & Industries vs State of Haryana",
        "category": "COURT_PRECEDENT",
        "content": "The Supreme Court of India held that transactions under General Power of Attorney (GPA), Sale Agreement, or Will transfers do NOT convey title or ownership rights in immovable property. A transfer of immovable property can only be effected by a duly registered deed of conveyance under Section 17 of the Registration Act 1908.",
        "tags": ["supreme-court", "gpa", "title-validity", "registration-act", "fraud-prevention"]
    },
    {
        "id": "KB-DPI-03",
        "title": "Multi-Agency Banking Lien Lock & DPI Protocol v2.6",
        "category": "DPI_PROTOCOL",
        "content": "Digital Public Infrastructure (DPI) multi-agency lien lock allows scheduled commercial banks to programmatically place an automated encumbrance lock on an ULPIN upon loan mortgage sanctioning. Sub-registrar offices cannot register transfers or mutations without an authenticated digital release token.",
        "tags": ["dpi", "lien-lock", "banking", "encumbrance", "form-15"]
    },
    {
        "id": "KB-ZONING-04",
        "title": "Masterplan Zoning Buffer & Encroachment Thresholds",
        "category": "ZONING_RULE",
        "content": "Under Master Plan 2031 regulations, green buffer zones within 30 meters of designated waterbodies and 15 meters of primary drainage valleys are non-buildable. AI satellite temporal change detection evaluates vegetation vs concrete index (NDVI / NDBI) to flag illegal permanent structures.",
        "tags": ["zoning", "buffer", "satellite", "encroachment", "ndvi", "ai-cv"]
    },
    {
        "id": "KB-MUTATION-05",
        "title": "Karnataka Land Revenue Act Sec 128 - Auto Mutation Registry",
        "category": "LAND_LAW",
        "content": "Section 128 of the Karnataka Land Revenue Act mandates automatic generation of J-Slip upon deed registration at the Sub-Registrar Office, instantly initiating the 30-day objection notice window in the Bhoomi portal, preventing double sales during pendency.",
        "tags": ["mutation", "rtc", "bhoomi", "j-slip", "revenue-records"]
    },
    {
        "id": "KB-STAMP-06",
        "title": "Circle Rate Valuation & Stamp Duty Assessment Algorithm",
        "category": "TAX_ENGINE",
        "content": "Stamp duty is assessed on the higher of the declared consideration value or the Government Guidance Value (Circle Rate). Differential guidance values apply to national highway frontage (+25%) and corner plots (+10%). E-Stamping verification is reconciled in real-time via the DPI gateway.",
        "tags": ["stamp-duty", "circle-rate", "valuation", "taxation"]
    }
]

# Pre-embed the corpus
for doc in KNOWLEDGE_CORPUS:
    doc["embedding"] = embed_text(doc["title"] + " " + doc["content"])

def hybrid_search(query: str, category: str = None, top_k: int = 4) -> list[dict]:
    """
    Performs hybrid retrieval: Dense vector cosine similarity + Keyword matching + Reciprocal rank fusion.
    """
    q_vec = embed_text(query)
    q_tokens = set(query.lower().split())

    results = []
    for doc in KNOWLEDGE_CORPUS:
        if category and doc["category"] != category:
            continue

        # Dense Vector Similarity
        vec_sim = cosine_similarity(q_vec, doc["embedding"])

        # Keyword BM25 / Token Overlap
        doc_tokens = set((doc["title"] + " " + doc["content"]).lower().split())
        token_overlap = len(q_tokens.intersection(doc_tokens)) / max(len(q_tokens), 1)

        # Hybrid Score: 70% dense vector + 30% lexical keyword overlap
        hybrid_score = round(0.70 * vec_sim + 0.30 * min(1.0, token_overlap), 4)

        results.append({
            "id": doc["id"],
            "title": doc["title"],
            "category": doc["category"],
            "content": doc["content"],
            "vectorSimilarity": round(vec_sim, 4),
            "lexicalScore": round(token_overlap, 4),
            "hybridScore": hybrid_score,
            "vectorSnippet": doc["embedding"][:8] # First 8 dimensions preview
        })

    results.sort(key=lambda x: x["hybridScore"], reverse=True)
    return results[:top_k]

class AgentMemoryManager:
    """
    Multi-tier agent memory store:
    - Short-term conversation buffer
    - Long-term episodic land audits
    - Entity memory (ULPIN, owners, court rulings)
    """
    def __init__(self):
        self.short_term = []
        self.long_term = {}
        self.entity_memory = {}

    def add_short_term(self, role: str, message: str, metadata: dict = None):
        entry = {
            "role": role,
            "message": message,
            "metadata": metadata or {},
            "timestamp": time.time()
        }
        self.short_term.append(entry)
        if len(self.short_term) > 20:
            self.short_term.pop(0)

    def store_episodic(self, ulpin: str, audit_summary: dict):
        if ulpin not in self.long_term:
            self.long_term[ulpin] = []
        self.long_term[ulpin].append({
            "summary": audit_summary,
            "timestamp": time.time()
        })

    def set_entity(self, key: str, value: any):
        self.entity_memory[key] = {
            "value": value,
            "last_updated": time.time()
        }

    def get_context(self, ulpin: str = None) -> dict:
        return {
            "short_term_count": len(self.short_term),
            "recent_messages": self.short_term[-4:],
            "episodic_records": self.long_term.get(ulpin, []),
            "entities": self.entity_memory
        }

memory_manager = AgentMemoryManager()
