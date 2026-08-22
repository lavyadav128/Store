# Feature 1: Live AI-readable course catalog

The Study Copilot receives a live catalog every time it answers. It includes active regular batches and active note batches, their current price, category, learning outcomes, and safe destination path.

`GET /api/catalog/ai` is the same customer-safe data source for debugging and future agents. For signed-in students, batches they currently own are listed separately and excluded from the recommended products.

Admin changes to price or availability are read from MongoDB on the next agent request; no course data is hard-coded in the AI prompt.
