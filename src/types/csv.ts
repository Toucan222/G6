export interface CSVCard {
  title: string
  image_url?: string
  quick_facts: string
  scoreboard: string
  text_block?: string
  link_block?: string
  audio_block?: string
}

export interface ParsedCard {
  title: string
  image_url?: string
  quick_facts: string[]
  scoreboard: Record<string, number>
  content_blocks: {
    text?: string
    link?: string
    audio_url?: string
  }[]
}
