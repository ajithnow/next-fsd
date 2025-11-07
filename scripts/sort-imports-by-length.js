#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const recast = require('recast');
const parser = require('@babel/parser');

function parse(code) {
  return recast.parse(code, {
    parser: {
      parse(source) {
        return parser.parse(source, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy'],
        });
      },
    },
  });
}

const patterns = process.argv.slice(2);
if (patterns.length === 0) patterns.push('src/**/*.{ts,tsx,js,jsx}');

const files = patterns.flatMap((p) => glob.sync(p, { nodir: true, ignore: 'node_modules/**' }));

files.forEach((file) => {
  try {
    const code = fs.readFileSync(file, 'utf8');
    const ast = parse(code);
    const body = ast.program.body;
    const imports = [];
    const rest = [];
    for (const node of body) {
      if (node.type === 'ImportDeclaration') imports.push(node);
      else rest.push(node);
    }

    if (imports.length === 0) return;

    imports.sort((a, b) => (a.source.value?.length || 0) - (b.source.value?.length || 0));

    ast.program.body = [...imports, ...rest];

    const output = recast.print(ast).code;
    if (output !== code) {
      fs.writeFileSync(file, output, 'utf8');
      console.log('Sorted imports in', file);
    }
  } catch (err) {
    console.error('Failed to process', file, err.message);
  }
});
