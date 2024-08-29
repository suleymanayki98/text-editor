// constants.js
export const COMPONENT_TYPES = {
    PARAGRAPH: 'paragraph',
    BUTTON: 'button',
    TWO_COLUMN: 'two-column',
    ONE_COLUMN: 'one-column',
    H1: 'h1',
    H2: 'h2',
  };

  export const elementConfig = {
    [COMPONENT_TYPES.PARAGRAPH]: {
      text: "I'm a text. Click here to add your own text and edit me. It's easy"
    },
    [COMPONENT_TYPES.H1]: { text: 'Heading1' },
    [COMPONENT_TYPES.H2]: { text: 'Heading2' },
    [COMPONENT_TYPES.TWO_COLUMN]: { columns: [[], []] },
    [COMPONENT_TYPES.ONE_COLUMN]: { content: [] }
  };