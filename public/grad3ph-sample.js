window.grad3ph = {
  "nodes": [
    {
      "x": 281,
      "y": 171,
      "color": "#AB274F",
      "label": "name",
      "properties": [
        {
          "id": "ada91298",
          "key": "name",
          "type": "string",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        },
        {
          "id": "afb533af",
          "key": "age",
          "type": "number",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        },
        {
          "id": "a6a772a4",
          "key": "id",
          "type": "number",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        }
      ],
      "id": "a08c199c",
      "isSelected": false,
      "isNode": true
    },
    {
      "x": 320,
      "y": 405,
      "color": "#3B7A57",
      "label": "articles",
      "properties": [
        {
          "id": "ae8b9f87",
          "key": "title",
          "type": "string",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": false
        },
        {
          "id": "a4bcf0be",
          "key": "text",
          "type": "string",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        },
        {
          "id": "ad9465b2",
          "key": "created_on",
          "type": "date",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        }
      ],
      "id": "a880b3b9",
      "isSelected": false,
      "isNode": true
    }
  ],
  "edges": [
    {
      "startNodeId": "a08c199c",
      "endNodeId": "a880b3b9",
      "middlePointOffset": [0, 0],
      "properties": [],
      "label": "authored",
      "id": "aba7fd8f",
      "isSelected": false,
      "isEdge": true
    },
    {
      "startNodeId": "a08c199c",
      "endNodeId": "a08c199c",
      "middlePointOffset": [-50, 50],
      "properties": [
        {
          "id": "afbeb084",
          "key": "since",
          "type": "date",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": false
        }
      ],
      "label": "friends",
      "id": "aba2e296",
      "isSelected": false,
      "isEdge": true
    }
  ]
};