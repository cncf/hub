import { isNull } from 'lodash';

import { TOCEntryItem } from '../types';

interface Node {
  children?: Node[];
  type: string;
  [key: string]: any;
}

export const transformer = (ast: Node) => {
  const headings = ast.children
    ? ast.children.filter((child: Node) => {
        return child.type === 'heading';
      })
    : [];
  let entries: TOCEntryItem[] = [];
  let processed: TOCEntryItem[] = [];

  const findParent = (entries: TOCEntryItem[], child: TOCEntryItem) => {
    const reversedEntries = entries.slice().reverse();
    for (let i = 0; i < reversedEntries.length; i++) {
      if (reversedEntries[i].depth < child.depth) {
        return reversedEntries[i];
      }
    }
    return null;
  };

  const getNodeValue = (node: Node) => {
    const allContentValues =
      node.children && node.children.length > 0
        ? node.children.map((n: Node) => {
            return n.value || '';
          })
        : [''];
    return allContentValues.join('');
  };

  for (let i = 0; i < headings.length; i++) {
    const value = getNodeValue(headings[i] as Node);

    if (value !== '') {
      const heading: TOCEntryItem = {
        depth: headings[i].depth,
        value: value,
        children: [],
      };

      const parent = findParent(processed, heading);

      if (!isNull(parent)) {
        parent.children = parent.children ? [...parent.children, heading] : [heading];
      } else {
        entries = [...entries, heading];
      }
      processed = [...processed, heading];
    }
  }

  return entries;
};

export function extractReadmeTOC() {
  return transformer;
}
