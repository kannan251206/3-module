# RAG (Retrieval-Augmented Generation) — architecture

Matches the brief's section 13. This is the pipeline behind the "Bureaucracy
AI Assistant" and the Service Recommendation System.

```
User Query
  -> Query Processing (src/rag/classify.ts — normalize, detect language)
  -> Embedding (src/rag/embed.ts — call an embedding model)
  -> Vector DB search (src/rag/vectorStore.ts — top-k nearest gov_services
     chunks: eligibility, documents, steps, fees, department, official URL)
  -> Government Service Knowledge Base (Postgres `gov_services` table today;
     move descriptive text into a vector index alongside it once the
     knowledge base grows past keyword matching)
  -> Retrieve Relevant Information (top-k chunks + their source metadata)
  -> LLM (src/rag/llm.ts — call Gemini/other provider with the retrieved
     chunks in context, plus a system prompt that forbids inventing facts
     not present in the retrieved chunks)
  -> Verified Response (LLM output + the source citation for each claim)
  -> Personalized Roadmap (src/routes/chat.routes.ts maps the matched
     service to its `steps` and returns both the chat reply and the
     roadmap so the frontend can render the mini service card)
```

## Current Phase-1 state

`src/rag/classify.ts` does keyword-overlap matching against `gov_services`
— no embeddings or LLM call yet, so it always returns instantly and
needs no API key. This keeps the frontend end-to-end functional while
Phase 5 (RAG) is implemented for real.

## Wiring a real LLM + vector DB

1. Pick an embedding + vector DB pair (e.g. OpenAI/Gemini embeddings +
   pgvector, since you're already on Postgres — `CREATE EXTENSION vector;`
   and an `embedding vector(1536)` column on `gov_services`).
2. Implement `embed.ts` to call the embedding API.
3. Implement `vectorStore.ts` with a `similaritySearch(queryEmbedding, k)`
   query against the new column.
4. Implement `llm.ts` to call your chosen LLM with retrieved chunks in the
   prompt, and to require the model cite which chunk supports each claim.
5. Replace the call in `chat.routes.ts` from `classify.ts` to this pipeline.

Keep `LLM_API_KEY` and `VECTOR_DB_URL` out of the frontend entirely — they
only ever live in the backend's `.env` (see `.env.example`).
