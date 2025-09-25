# chat-plus-plus
More than just a chat app.


# Instructions

First, you must have [Hrfanar](https://github.com/openteams-ai/hrafnar) running in a docker image at `http://0.0.0.0:8751`.

```
docker run --rm --name hrafnar --pull always -v ./config.yml:/etc/hrafnar/config.yml -p 8751:8751 quay.io/reiemp/hrafnar:latest
```

You also need a Hrafnar `config.yml`. Here is a template:

```
server:
  hostname: 0.0.0.0
models:
  - cls_or_fn: hrafnar.models.PydanticAIModelWrapper
    params:
      model:
        cls_or_fn: pydantic_ai.models.openai.OpenAIModel
        params:
          model_name: anthropic/claude-sonnet-4
          provider: &openrouter-provider
            cls_or_fn: pydantic_ai.providers.openrouter.OpenRouterProvider
            params:
              api_key: "your openrouter api key goes here"
      display_name: Claude Sonnet 4
      supports_tool_calls: true
      supports_files: true
  - cls_or_fn: hrafnar.models.PydanticAIModelWrapper
    params:
      model:
        cls_or_fn: pydantic_ai.models.openai.OpenAIModel
        params:
          model_name: google/gemini-2.5-flash
          provider: *openrouter-provider
      supports_tool_calls: true
      supports_files: true
      display_name: Gemini 2.5 Flash
  - cls_or_fn: hrafnar.models.PydanticAIModelWrapper
    params:
      model:
        cls_or_fn: pydantic_ai.models.openai.OpenAIModel
        params:
          model_name: openai/gpt-5
          provider: *openrouter-provider
      supports_tool_calls: true
      supports_files: true
      display_name: GPT 5
  - cls_or_fn: hrafnar.models.PydanticAIModelWrapper
    params:
      model:
        cls_or_fn: pydantic_ai.models.openai.OpenAIModel
        params:
          model_name: openai/gpt-4.1
          provider: *openrouter-provider
      supports_tool_calls: true
      supports_files: true
      display_name: GPT 4.1
toolsets:
  - cls_or_fn: hrafnar.toolsets.PydanticAIToolsetWrapper
    params:
      toolset_factory:
        cls_or_fn: pydantic_ai.toolsets.FunctionToolset
        params:
          tools:
            - cls_or_fn: pydantic_ai.common_tools.duckduckgo.duckduckgo_search_tool
      name: duckduckgo-search
      display_name: DuckDuckGo Web Search
      description: Search the web using the DuckDuckGo search engine.
```


Once you have Hrafnar running, follow these instructions to run Chat++ locally:
- `git clone https://github.com/openteams-ai/chat-plus-plus.git`
- `cd chat-plus-plus`
- `npm install`
- `npm run dev`
- Open the `localhost` url in your browser of choice

