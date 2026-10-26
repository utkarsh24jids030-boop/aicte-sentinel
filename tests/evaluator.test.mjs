// AICTE Sentinel Safe Logic Expression Evaluator Test Suite
// Problem Statement SIH26261 - Smart India Hackathon 2026
// Run with: node tests/evaluator.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';

// Evaluator Core Implementation for Standalone Engine Testing
export class TestLexer {
  constructor(input) {
    this.input = (input || '').trim();
    this.pos = 0;
  }

  tokenize() {
    const tokens = [];
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }

      if (ch === '(') tokens.push({ type: 'LPAREN', value: '(', position: this.pos++ });
      else if (ch === ')') tokens.push({ type: 'RPAREN', value: ')', position: this.pos++ });
      else if (ch === ',') tokens.push({ type: 'COMMA', value: ',', position: this.pos++ });
      else if (ch === '&' && this.peek() === '&') { tokens.push({ type: 'AND', value: '&&', position: this.pos }); this.pos += 2; }
      else if (ch === '|' && this.peek() === '|') { tokens.push({ type: 'OR', value: '||', position: this.pos }); this.pos += 2; }
      else if (ch === '=' && this.peek() === '=') { tokens.push({ type: 'EQ', value: '==', position: this.pos }); this.pos += 2; }
      else if (ch === '!' && this.peek() === '=') { tokens.push({ type: 'NEQ', value: '!=', position: this.pos }); this.pos += 2; }
      else if (ch === '!') tokens.push({ type: 'BANG', value: '!', position: this.pos++ });
      else if (ch === '<' && this.peek() === '=') { tokens.push({ type: 'LTE', value: '<=', position: this.pos }); this.pos += 2; }
      else if (ch === '>' && this.peek() === '=') { tokens.push({ type: 'GTE', value: '>=', position: this.pos }); this.pos += 2; }
      else if (ch === '<') tokens.push({ type: 'LT', value: '<', position: this.pos++ });
      else if (ch === '>') tokens.push({ type: 'GT', value: '>', position: this.pos++ });
      else if (ch === '+') tokens.push({ type: 'PLUS', value: '+', position: this.pos++ });
      else if (ch === '-') tokens.push({ type: 'MINUS', value: '-', position: this.pos++ });
      else if (ch === '*') tokens.push({ type: 'MUL', value: '*', position: this.pos++ });
      else if (ch === '/') tokens.push({ type: 'DIV', value: '/', position: this.pos++ });
      else if (ch === '\'' || ch === '"') {
        const quote = ch;
        const startPos = this.pos;
        this.pos++;
        let str = '';
        while (this.pos < this.input.length && this.input[this.pos] !== quote) {
          str += this.input[this.pos++];
        }
        if (this.pos < this.input.length) this.pos++;
        tokens.push({ type: 'STRING', value: str, position: startPos });
      } else if (/[0-9]/.test(ch)) {
        const startPos = this.pos;
        let numStr = '';
        while (this.pos < this.input.length && /[0-9.]/.test(this.input[this.pos])) {
          numStr += this.input[this.pos++];
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr), position: startPos });
      } else if (/[a-zA-Z_]/.test(ch)) {
        const startPos = this.pos;
        let ident = '';
        while (this.pos < this.input.length && /[a-zA-Z0-9_.]/.test(this.input[this.pos])) {
          ident += this.input[this.pos++];
        }
        if (ident === 'true') tokens.push({ type: 'BOOLEAN', value: true, position: startPos });
        else if (ident === 'false') tokens.push({ type: 'BOOLEAN', value: false, position: startPos });
        else if (ident === 'null') tokens.push({ type: 'NULL', value: null, position: startPos });
        else tokens.push({ type: 'IDENTIFIER', value: ident, position: startPos });
      } else {
        this.pos++;
      }
    }
    tokens.push({ type: 'EOF', value: null, position: this.pos });
    return tokens;
  }

  peek() {
    return this.input[this.pos + 1];
  }
}

export class TestParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    return this.parseOr();
  }

  parseOr() {
    let left = this.parseAnd();
    while (this.match('OR')) {
      const op = String(this.previous().value);
      const right = this.parseAnd();
      left = { type: 'BinaryOp', op, left, right };
    }
    return left;
  }

  parseAnd() {
    let left = this.parseEquality();
    while (this.match('AND')) {
      const op = String(this.previous().value);
      const right = this.parseEquality();
      left = { type: 'BinaryOp', op, left, right };
    }
    return left;
  }

  parseEquality() {
    let left = this.parseRelational();
    while (this.match('EQ', 'NEQ')) {
      const op = String(this.previous().value);
      const right = this.parseRelational();
      left = { type: 'BinaryOp', op, left, right };
    }
    return left;
  }

  parseRelational() {
    let left = this.parseAdditive();
    while (this.match('LT', 'LTE', 'GT', 'GTE')) {
      const op = String(this.previous().value);
      const right = this.parseAdditive();
      left = { type: 'BinaryOp', op, left, right };
    }
    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    while (this.match('PLUS', 'MINUS')) {
      const op = String(this.previous().value);
      const right = this.parseMultiplicative();
      left = { type: 'BinaryOp', op, left, right };
    }
    return left;
  }

  parseMultiplicative() {
    let left = this.parseUnary();
    while (this.match('MUL', 'DIV')) {
      const op = String(this.previous().value);
      const right = this.parseUnary();
      left = { type: 'BinaryOp', op, left, right };
    }
    return left;
  }

  parseUnary() {
    if (this.match('BANG', 'MINUS')) {
      const op = String(this.previous().value);
      const argument = this.parseUnary();
      return { type: 'UnaryOp', op, argument };
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    if (this.match('NUMBER', 'STRING', 'BOOLEAN', 'NULL')) {
      return { type: 'Literal', value: this.previous().value };
    }
    if (this.match('IDENTIFIER')) {
      const name = String(this.previous().value);
      if (this.match('LPAREN')) {
        const args = [];
        if (!this.check('RPAREN')) {
          do {
            args.push(this.parseOr());
          } while (this.match('COMMA'));
        }
        this.consume('RPAREN', "Expected ')' after arguments.");
        return { type: 'CallExpr', callee: name, args };
      }
      return { type: 'Identifier', name };
    }
    if (this.match('LPAREN')) {
      const expr = this.parseOr();
      this.consume('RPAREN', "Expected ')' after expression.");
      return expr;
    }
    return { type: 'Literal', value: null };
  }

  match(...types) {
    for (const t of types) {
      if (this.check(t)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === 'EOF';
  }

  peek() {
    return this.tokens[this.current] || { type: 'EOF', value: null, position: 0 };
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(message || `Expected ${type}`);
  }
}

export function evaluateAST(node, scope) {
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'Identifier': {
      const parts = node.name.split('.');
      let curr = scope;
      for (const p of parts) {
        if (curr === null || curr === undefined) return null;
        curr = curr[p];
      }
      return curr;
    }
    case 'UnaryOp': {
      const val = evaluateAST(node.argument, scope);
      if (node.op === '!') return !val;
      if (node.op === '-') return -(Number(val));
      return val;
    }
    case 'BinaryOp': {
      if (node.op === '&&') {
        const leftVal = evaluateAST(node.left, scope);
        if (!leftVal) return false;
        return !!evaluateAST(node.right, scope);
      }
      if (node.op === '||') {
        const leftVal = evaluateAST(node.left, scope);
        if (leftVal) return true;
        return !!evaluateAST(node.right, scope);
      }
      const left = evaluateAST(node.left, scope);
      const right = evaluateAST(node.right, scope);
      switch (node.op) {
        case '==':
          if (typeof left === 'string' && typeof right === 'string') {
            return left.trim().toLowerCase() === right.trim().toLowerCase();
          }
          return left == right;
        case '!=':
          if (typeof left === 'string' && typeof right === 'string') {
            return left.trim().toLowerCase() !== right.trim().toLowerCase();
          }
          return left != right;
        case '<=': return Number(left) <= Number(right);
        case '>=': return Number(left) >= Number(right);
        case '<': return Number(left) < Number(right);
        case '>': return Number(left) > Number(right);
        case '+':
          return typeof left === 'string' || typeof right === 'string'
            ? String(left) + String(right)
            : Number(left) + Number(right);
        case '-': return Number(left) - Number(right);
        case '*': return Number(left) * Number(right);
        case '/': return Number(right) !== 0 ? Number(left) / Number(right) : 0;
        default: return false;
      }
    }
    case 'CallExpr': {
      const fn = scope[node.callee];
      if (typeof fn !== 'function') return false;
      const evaluatedArgs = node.args.map(a => evaluateAST(a, scope));
      return fn(...evaluatedArgs);
    }
    default:
      return false;
  }
}

export function evaluateExpression(expr, scope = {}) {
  try {
    if (!expr || expr.trim() === '') return { passed: true, value: true };
    const lexer = new TestLexer(expr);
    const tokens = lexer.tokenize();
    const parser = new TestParser(tokens);
    const ast = parser.parse();
    const result = evaluateAST(ast, scope);
    return { passed: Boolean(result), value: result };
  } catch (err) {
    return { passed: false, error: err.message };
  }
}

// ==========================================
// TEST SUITES
// ==========================================

test('Safe Evaluator: Arithmetic and Precedence', () => {
  assert.equal(evaluateExpression('2 + 3 * 4').value, 14, 'Precedence: multiplication before addition');
  assert.equal(evaluateExpression('(2 + 3) * 4').value, 20, 'Parentheses override default precedence');
  assert.equal(evaluateExpression('10 - 4 - 2').value, 4, 'Left-associative subtraction');
  assert.equal(evaluateExpression('20 / 4').value, 5, 'Division');
  assert.equal(evaluateExpression('10 / 0').value, 0, 'Safe division by zero returns 0');
  assert.equal(evaluateExpression('-5 + 10').value, 5, 'Unary minus');
  assert.equal(evaluateExpression('\'AICTE\' + \' \' + \'Sentinel\'').value, 'AICTE Sentinel', 'String concatenation');
});

test('Safe Evaluator: Relational Comparisons and Case-Insensitive String Equality', () => {
  assert.equal(evaluateExpression('4.85 >= 2.5').value, true, 'Greater than or equal');
  assert.equal(evaluateExpression('2.1 >= 2.5').value, false, 'Less than fails >=');
  assert.equal(evaluateExpression('100 < 200').value, true, 'Strictly less than');
  assert.equal(evaluateExpression('100 <= 100').value, true, 'Less than or equal at exact boundary');
  assert.equal(evaluateExpression('\'Pune\' == \'pune\'').value, true, 'Case-insensitive string comparison');
  assert.equal(evaluateExpression('\'  Mumbai \' == \'mumbai\'').value, true, 'Trimmed string comparison');
  assert.equal(evaluateExpression('\'289/1A\' != \'289/1B\'').value, true, 'String inequality');
  assert.equal(evaluateExpression('true == true').value, true, 'Boolean equality');
  assert.equal(evaluateExpression('null == null').value, true, 'Null equality');
});

test('Safe Evaluator: Logical Short-Circuiting and Negation', () => {
  assert.equal(evaluateExpression('true && true').value, true);
  assert.equal(evaluateExpression('true && false').value, false);
  assert.equal(evaluateExpression('false || true').value, true);
  assert.equal(evaluateExpression('false || false').value, false);
  assert.equal(evaluateExpression('!false').value, true);
  assert.equal(evaluateExpression('!true').value, false);

  // Short-circuit verification: right side not called if left determines result
  let called = false;
  const scope = { testFn: () => { called = true; return true; } };
  evaluateExpression('false && testFn()', scope);
  assert.equal(called, false, 'Short-circuit AND must not evaluate right operand when left is false');

  evaluateExpression('true || testFn()', scope);
  assert.equal(called, false, 'Short-circuit OR must not evaluate right operand when left is true');
});

test('Safe Evaluator: Context Variable Resolution and Helper Functions', () => {
  const scope = {
    institution: { location_type: 'semi-urban', name: 'Sunrise Institute' },
    application: { proposed_intake: 360, current_intake: 300 },
    has_document: (type) => type === 'Land Deed',
    extracted: (doc, key) => (doc === 'Land Deed' && key === 'survey_number' ? '144/2' : null),
    extracted_number: (doc, key) => (doc === 'Land Deed' && key === 'area_acres' ? 4.85 : 0),
    min_land_area: (loc) => (loc === 'semi-urban' ? 2.5 : 4.0),
    is_expired: (type) => type === 'Expired Fire NOC'
  };

  assert.equal(evaluateExpression('institution.location_type == \'semi-urban\'', scope).value, true);
  assert.equal(evaluateExpression('has_document(\'Land Deed\')', scope).value, true);
  assert.equal(evaluateExpression('has_document(\'Missing Doc\')', scope).value, false);
  assert.equal(evaluateExpression('extracted(\'Land Deed\', \'survey_number\') == \'144/2\'', scope).value, true);
  assert.equal(evaluateExpression('extracted_number(\'Land Deed\', \'area_acres\') >= min_land_area(institution.location_type)', scope).value, true);
  assert.equal(evaluateExpression('!is_expired(\'Expired Fire NOC\')', scope).value, false);
});

test('Safe Evaluator: Fail-Closed Low Confidence Field Handling (< 0.75)', () => {
  // Document with one normal field and one low-confidence field (0.62)
  const documents = [
    {
      documentType: 'Affidavit',
      extractedFields: [
        { fieldKey: 'execution_date', fieldValue: '2026-01-10', confidence: 0.94, isManuallyCorrected: false },
        { fieldKey: 'notary_registration_no', fieldValue: 'NOTARY-DL-98214', confidence: 0.62, isManuallyCorrected: false }
      ]
    }
  ];

  const getFieldFailClosed = (type, key) => {
    const doc = documents.find(d => d.documentType === type);
    if (!doc) return null;
    const f = doc.extractedFields.find(fld => fld.fieldKey === key);
    if (!f) return null;
    if (!f.isManuallyCorrected && f.confidence < 0.75) return null; // Fail-closed
    return f.fieldValue;
  };

  const scope = {
    has_document: (type) => documents.some(d => d.documentType === type),
    extracted: (type, key) => getFieldFailClosed(type, key)
  };

  // High confidence field returns value
  assert.equal(evaluateExpression('extracted(\'Affidavit\', \'execution_date\') != null', scope).value, true);
  // Low confidence field fails-closed to null
  assert.equal(evaluateExpression('extracted(\'Affidavit\', \'notary_registration_no\') != null', scope).value, false);
});

test('Safe Evaluator: Syntax Error Safety & Malformed Expressions', () => {
  // Must return passed: false with error message, NEVER crash runtime
  const res1 = evaluateExpression('has_document(');
  assert.equal(res1.passed, false);
  assert.ok(res1.error);

  const res2 = evaluateExpression('&& true');
  assert.equal(res2.passed, false);

  const res3 = evaluateExpression('(2 + 3');
  assert.equal(res3.passed, false);
});
