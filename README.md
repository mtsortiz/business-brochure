# 📑 Business Brochure Generator

**Automatically generate professional company brochures using AI**

Business Brochure Generator is an intelligent Jupyter-based tool that automatically scrapes company websites, extracts relevant information, and generates polished marketing brochures using Google Gemini 2.5 Flash.

---

## ✨ Features

- 🕷️ **Smart Web Scraping** - Automatically crawls and extracts content from company websites
- 🔗 **Intelligent Link Selection** - Uses AI to identify relevant pages (About, Careers, Products, etc.)
- 📝 **AI-Generated Brochures** - Creates professional, customizable brochures in Markdown
- 🎨 **Customizable Tone** - Generate serious, humorous, or brand-specific brochures
- ⚡ **Streaming Output** - Watch the brochure generate in real-time
- 🔍 **Content Analysis** - Extracts company culture, customers, and career information

---

## 📋 Requirements

- Python 3.11+
- Google Gemini API key
- [uv](https://github.com/astral-sh/uv) package manager (recommended)
- Internet connection for web scraping

---

## 🚀 Quick Start

### 1. Navigate to the project
```bash
cd business-brochure
```

### 2. Set up environment variables
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_api_key_here
```

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. Install dependencies
```bash
uv sync
```

### 4. Run the generator
```bash
jupyter notebook company-brochure.ipynb
```

---

## 📖 How to Use

### Basic Usage
1. **Run setup cells** - Load environment and initialize the Gemini client
2. **Enter company details** - Provide company name and website URL
3. **Generate brochure** - Run the `stream_brochure()` function to generate the marketing copy
4. **Customize** - Modify the system prompt to change tone and style

### Example
```python
stream_brochure("Company Name", "https://company-website.com")
```

### Available Functions

| Function | Purpose |
|----------|---------|
| `fetch_website_links(url)` | Extracts all links from a webpage |
| `fetch_website_contents(url)` | Scrapes and cleans page content |
| `select_relevant_links(url)` | AI-identifies relevant company pages |
| `fetch_page_and_all_relevant_links(url)` | Gathers content from landing page + relevant links |
| `create_brochure(name, url)` | Generates brochure (non-streaming) |
| `stream_brochure(name, url)` | Generates brochure with real-time streaming |

---

## 🛠️ Project Structure

```
business-brochure/
├── company-brochure.ipynb    # Main Jupyter notebook
├── scraper.py               # Web scraping utilities
├── pyproject.toml           # Project dependencies
├── .env                     # Environment variables (create this)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 📦 Dependencies

- **openai** - Google Gemini API integration
- **python-dotenv** - Environment variable management
- **beautifulsoup4** - HTML parsing and web scraping
- **requests** - HTTP client for fetching web pages
- **ipykernel** - Jupyter notebook support
- **ipywidgets** - Interactive notebook widgets

---

## ⚙️ Configuration

### Models Used
- **Gemini 2.5 Flash** - State-of-the-art fast LLM for brochure generation

### API Endpoint
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta/openai/`
- **OpenAI-Compatible**: Uses OpenAI SDK for easy integration

### System Prompts
The notebook includes different system prompts:
- **Professional**: Standard business brochure format
- **Humorous**: Fun, engaging marketing copy (uncomment to use)
- **Custom**: Create your own tone and style

---

## 🔒 Best Practices

- ✓ Store your API key in `.env` file (added to `.gitignore`)
- ✓ Test with small websites first before large sites
- ✓ Monitor API usage for cost control
- ✓ Be respectful of website robots.txt policies
- ✓ Handle exceptions when pages are unavailable

---

## ⚠️ Limitations

- Requires JavaScript rendering for dynamic sites (BeautifulSoup limitation)
- Some websites may block automated scraping
- Content limited to ~5,000 characters to manage API costs
- JSON response format required for link selection

---

## 🚨 Troubleshooting

### "Cannot fetch website"
- Check if the URL is valid and accessible
- Some sites may block automated requests
- Try a different website

### "API Key Error"
- Verify your `.env` file exists
- Check that `GEMINI_API_KEY` is correctly set
- Ensure the API key is valid in Google AI Studio

### "No relevant links found"
- The website may have limited navigation
- Try with a larger, more structured company site
- Check console output for debugging

---

## 📊 Example Output

The generator produces Markdown-formatted brochures including:
- Company Overview
- Key Products/Services
- Company Culture
- Team & Careers Information
- Customer Base (if available)
- Call-to-Action

---

## 📄 License

Open source

---

## 💡 Tips for Best Results

1. **Use established websites** - Companies with well-structured sites produce better brochures
2. **Review the output** - AI-generated content may need light editing
3. **Adjust the prompt** - Customize the system prompt for different industries
4. **Batch processing** - Generate multiple brochures for market analysis
5. **Combine with tools** - Export to PDF or integrate with other workflows

---

## 📓 About the Notebook

This application is built around the `company-brochure.ipynb` Jupyter notebook, which serves as both the development environment and the main interface for brochure generation.

### Notebook Structure

The notebook is organized into logical sections:

1. **Setup & Configuration** - Import libraries, load environment variables, and configure the Gemini API client
2. **Web Scraping Functions** - Extract links and content from company websites
3. **Link Selection** - Use AI to identify relevant pages (About, Careers, etc.) in JSON format
4. **Content Aggregation** - Combine landing page and relevant links into comprehensive input
5. **Brochure Generation** - Create professional brochures with customizable system prompts
6. **Streaming Output** - Real-time generation for interactive feedback

### Key Learning Points

The notebook demonstrates:
- **OpenAI SDK Compatibility** - Using Gemini API with OpenAI-compatible endpoints
- **Structured Outputs** - Leveraging JSON mode for reliable link selection
- **System Prompts** - Crafting effective instructions for tone and style
- **Streaming Responses** - Building real-time UIs with `update_display()`
- **Error Handling** - Gracefully managing failed web requests
- **Content Truncation** - Managing API costs with character limits

This makes the notebook not just a tool, but also a reference implementation for building AI-powered web scraping and content generation workflows.