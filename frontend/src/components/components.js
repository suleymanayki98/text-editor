// components.js

export const componentsData = {
    "components": [
      {
        "type": "PARAGRAPH",
        "text": "This is a paragraph.",
        "styles": {
          "className": "p-1 border-none shadow-none whitespace-pre-wrap"
        }
      },
      {
        "type": "H1",
        "text": "Heading 1",
        "styles": {
          "className": "text-4xl font-bold leading-normal m-0 p-1 border-none shadow-none whitespace-pre-wrap"
        }
      },
      {
        "type": "H2",
        "text": "Heading 2",
        "styles": {
          "className": "text-3xl font-bold leading-normal m-0 p-1 border-none shadow-none whitespace-pre-wrap"
        }
      },
      {
        "type": "BUTTON",
        "text": "Contact me",
        "href": "mailto:",
        "styles": {
          "className": "flex items-center text-black no-underline capitalize rounded-lg text-sm"
        },
        "icon": {
          "name": "mdi:plus",
          "width": 24,
          "height": 24
        }
      },
      {
        "type": "TWO_COLUMN",
        "columns": [
          [],
          []
        ],
        "styles": {
          "className": "flex justify-between min-h-[200px] border border-gray-300 rounded mb-2.5 relative"
        }
      },
      {
        "type": "ONE_COLUMN",
        "content": [],
        "styles": {
          "className": "border border-gray-300 rounded mb-2.5 p-2.5"
        }
      }
    ]
  };