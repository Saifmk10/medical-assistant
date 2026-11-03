from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmResponse

def track_cost(
    callback_context: CallbackContext,
    llm_response: LlmResponse
):
    usage = llm_response.usage_metadata

    if usage:
        print("Input tokens:", usage.prompt_token_count)
        print("Output tokens:", usage.candidates_token_count)
        print("Total tokens:", usage.total_token_count)
        print("Thoughts tokens:", usage.thoughts_token_count)

        total_tokens = usage.total_token_count
        # print("OUTPUT TOKENS:", total_tokens)

        # cost = (
        #         (usage.prompt_token_count / 1_000_000) * 0.30
        #         +
        #         ((usage.candidates_token_count + usage.thoughts_token_count) / 1_000_000) * 2.50
        #         )

        # print("Estimated cost: $", cost)

    return None