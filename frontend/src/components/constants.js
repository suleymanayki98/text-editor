// constants.js
export const COMPONENT_TYPES = {
  PARAGRAPH: 'paragraph',
  H1: 'h1',
  H2: 'h2',
  BUTTON: 'button',
  TWO_COLUMN: 'two-column',
  ONE_COLUMN: 'one-column',
  IMAGE_TEXT: 'image-text',
};

export const elementConfig = {
  [COMPONENT_TYPES.PARAGRAPH]: { text: 'Enter your paragraph text here' },
  [COMPONENT_TYPES.H1]: { text: 'Enter your heading text here' },
  [COMPONENT_TYPES.H2]: { text: 'Enter your subheading text here' },
  [COMPONENT_TYPES.BUTTON]: { text: 'Click me' },
  [COMPONENT_TYPES.TWO_COLUMN]: { columns: [[], []] },
  [COMPONENT_TYPES.ONE_COLUMN]: { content: [] },
  [COMPONENT_TYPES.IMAGE_TEXT]: { imageUrl: '', paragraphs: ['Enter your text here'] },
};