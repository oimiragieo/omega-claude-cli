> ## Documentation Index
>
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
>
> Use this file to discover all available pages before exploring further.

# Model configuration

> Configure which model Claude Code uses, effort levels, extended context, and the auto-compact window

**Offline snapshot:** Verified against https://code.claude.com/docs/en/model-config on **2026-08-13**. Prefer the live page if anything here disagrees.

## Available models

For the `model` setting in Claude Code, you can configure either:

* A **model alias**
* A **model name**
  * Anthropic API: a full **[model name](https://platform.claude.com/docs/en/about-claude/models/overview)**
  * Amazon Bedrock: an inference profile ARN
  * Microsoft Foundry: a deployment name
  * Google Cloud's Agent Platform: a version name

For guidance on which model and effort level fit different kinds of work, see [Choosing a Claude model and effort level in Claude Code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code) on the blog.

`ANTHROPIC_BASE_URL` changes where requests are sent, not which model answers them. To route Claude through an LLM gateway, see [LLM gateways](https://code.claude.com/docs/en/llm-gateway).

### Model aliases

Use a model alias to select model settings without remembering exact version numbers:

| Model alias | Behavior |
| --- | --- |
| **`default`** | Special value that clears any model override and reverts to the recommended model for your account type, or to the organization default model when an admin has set one. Not itself a model alias |
| **`best`** | Uses Fable 5 where your organization has access to it, otherwise the latest Opus model |
| **`fable`** | Uses Claude Fable 5 for your hardest and longest-running tasks |
| **`sonnet`** | Uses the latest Sonnet model for daily coding tasks |
| **`opus`** | Uses the latest Opus model for complex reasoning tasks |
| **`haiku`** | Uses the fast and efficient Haiku model for simple tasks |
| **`sonnet[1m]`** | Uses Sonnet with a 1 million token context window for long sessions. No effect when `sonnet` already resolves to Sonnet 5 with its native 1M window; behind an LLM gateway, selects the 1M window for Sonnet 5 |
| **`opus[1m]`** | Uses Opus with a 1 million token context window for long sessions |
| **`opusplan`** | Special mode that uses `opus` during plan mode, then switches to `sonnet` for execution |

The version that the `opus` and `sonnet` aliases resolve to depends on the provider:

| Provider | `opus` | `sonnet` |
| --- | --- | --- |
| Anthropic API | Opus 5 | Sonnet 5 |
| Claude Platform on AWS | Opus 5 | Sonnet 4.6 |
| Amazon Bedrock, Google Cloud's Agent Platform | Opus 5 | Sonnet 4.5 |
| Microsoft Foundry | Opus 4.6 | Sonnet 4.5 |

Where an alias resolves to an older model, newer models are available by selecting the full model name explicitly or setting `ANTHROPIC_DEFAULT_OPUS_MODEL` or `ANTHROPIC_DEFAULT_SONNET_MODEL`.

Before v2.1.219, `opus` resolved to Opus 4.8 on the Anthropic API from v2.1.154, and on Claude Platform on AWS, Amazon Bedrock, and Google Cloud's Agent Platform from v2.1.207. Before v2.1.207, `opus` resolved to Opus 4.7 on Claude Platform on AWS and to Opus 4.6 on Amazon Bedrock and Google Cloud's Agent Platform.

Aliases point to the recommended version for your provider and update over time. To pin to a specific version, use the full model name, for example `claude-opus-5`, or set the corresponding environment variable like `ANTHROPIC_DEFAULT_OPUS_MODEL`.

Opus 5 requires Claude Code v2.1.219 or later. Sonnet 5 requires v2.1.197 or later. Opus 4.8 requires v2.1.154 or later. Run `claude update` to upgrade.

### Work with Fable 5

[Claude Fable 5](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5) is the most capable model in Claude Code, suited to tasks larger than a single sitting. It sustains long autonomous sessions, investigates before acting, and verifies its work more often than smaller models.

Fable 5 is not the default model. Select it with `/model fable`. Requests that its safety classifiers flag, most often in cybersecurity and biology domains, trigger automatic model fallback.

Fable 5 requires Claude Code v2.1.170 or later. Older versions do not show Fable 5 in the model picker and cannot select it. Run `claude update` to upgrade. Fable 5 is not available under zero data retention, where the `/model` picker either omits it or shows it disabled.

On the Anthropic API, the `/model` picker lists Fable 5 only after the server reports it available for your organization. When you type `/model fable`, Claude Code checks availability with the server directly, so the selection can succeed before the picker lists the entry.

In [non-interactive mode](https://code.claude.com/docs/en/headless) with the `-p` flag and through the Agent SDK, Claude Code never shows the Fable usage-credits consent prompt. When a Fable 5 request there would bill to usage credits, Claude Code bills it without asking.

### Setting your model

You can configure your model in several ways, listed in order of priority:

1. **During session** — use `/model <alias|name>` to switch immediately, or run `/model` with no argument to open the picker
2. **At startup** — launch with `claude --model <alias|name>`
3. **Environment variable** — set `ANTHROPIC_MODEL=<alias|name>`
4. **Settings** — configure permanently in your settings file using the `model` field

Example usage:

```bash
# Start with Opus
claude --model opus

# Switch to Sonnet during session
/model sonnet
```

Example settings file:

```json
{
  "permissions": {},
  "model": "opus"
}
```

As of v2.1.153, `/model` saves your choice as the default for new sessions by writing the `model` field in your user settings. In the picker:

* `Enter`: switch model and save as your default
* `s`: switch model for this session only

A model set with `/model` in non-interactive mode (`-p`) applies to the current session only and isn't saved as your default.

### Restrict model selection

Enterprise administrators can use `availableModels` in managed or policy settings to restrict which models users can select. Entries match a model family such as `sonnet`, a version prefix such as `claude-sonnet-4-5`, or a full model ID such as `claude-sonnet-4-5-20250929`.

When `availableModels` is set, users cannot switch to models not in the list via `/model`, `--model` flag, Config tool, or `ANTHROPIC_MODEL` environment variable.

```json
{
  "availableModels": ["sonnet", "haiku"]
}
```

On the Anthropic API and Claude Platform on AWS, a model family alias (`opus`, `sonnet`, `haiku`, or `fable`) resolves to the newest version of its family that the allowlist permits.

### Environment variables for alias defaults

* `ANTHROPIC_DEFAULT_OPUS_MODEL`
* `ANTHROPIC_DEFAULT_SONNET_MODEL`
* `ANTHROPIC_DEFAULT_HAIKU_MODEL`
* `ANTHROPIC_DEFAULT_FABLE_MODEL`

These control what the Default option and the corresponding aliases resolve to (subject to `availableModels` allowlists).

## See also

* Live docs: https://code.claude.com/docs/en/model-config
* Models overview: https://platform.claude.com/docs/en/about-claude/models/overview
* Headless / Agent SDK: https://code.claude.com/docs/en/headless
