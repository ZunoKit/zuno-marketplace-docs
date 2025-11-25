import { parse } from 'yaml'

interface OptimizedMarkdown {
  content: string
  metadata: Record<string, any>
  tokenEstimate: number
}

export function useMarkdownOptimizer() {
  /**
   * Extract frontmatter from markdown
   */
  function extractFrontmatter(markdown: string) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/
    const match = markdown.match(frontmatterRegex)

    if (!match) {
      return { frontmatter: {}, body: markdown }
    }

    try {
      const frontmatter = parse(match[1])
      const body = markdown.slice(match[0].length)

      return { frontmatter, body }
    } catch (error) {
      console.warn('Failed to parse frontmatter:', error)
      return { frontmatter: {}, body: markdown }
    }
  }

  /**
   * Strip UI components while preserving semantic markdown
   */
  function stripUIElements(markdown: string): string {
    return markdown
      // Remove Vue component blocks (::card, ::callout, etc.)
      .replace(/::[\w-]+({[^}]*})?\n/g, '')
      .replace(/  ::/g, '')

      // Remove HTML tags
      .replace(/<[^>]+>/g, '')

      // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  /**
   * Estimate token count (rough approximation)
   * ~4 chars per token for English
   */
  function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }

  /**
   * Optimize markdown for LLM consumption
   */
  function optimizeForLLM(rawMarkdown: string): OptimizedMarkdown {
    const { frontmatter, body } = extractFrontmatter(rawMarkdown)
    const cleanedBody = stripUIElements(body)

    // Add LLM consumption hints as comments
    const hints = [
      '<!-- LLM-Optimized Documentation -->',
      `<!-- Package: ${frontmatter.package || 'unknown'} -->`,
      `<!-- Scope: ${frontmatter.scope || 'general'} -->`,
      `<!-- Complexity: ${frontmatter.complexity || 'intermediate'} -->`,
      ''
    ].join('\n')

    // Reconstruct frontmatter YAML
    const frontmatterYaml = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`
        }
        if (typeof value === 'object' && value !== null) {
          return `${key}: ${JSON.stringify(value)}`
        }
        return `${key}: ${value}`
      })
      .join('\n')

    const optimizedContent = [
      '---',
      frontmatterYaml,
      '---',
      '',
      hints,
      cleanedBody
    ].join('\n')

    return {
      content: optimizedContent,
      metadata: frontmatter,
      tokenEstimate: estimateTokens(optimizedContent)
    }
  }

  return {
    extractFrontmatter,
    stripUIElements,
    estimateTokens,
    optimizeForLLM
  }
}
