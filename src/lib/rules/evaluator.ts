// AICTE Sentinel Safe Rule Logic Expression Evaluator
// AST-based Lexer, Parser, and Sandboxed Evaluator (NO eval(), NO new Function())
// Problem Statement SIH26261 - Smart India Hackathon 2026

import type { Application, DocumentRecord, Institution } from '@/types';
import { getAsOfDate } from '../config/env';
import { getMinimumLandArea, computeRequiredFaculty, resolveProgrammeLevel, type LocationType, MIN_EXTRACTION_CONFIDENCE_THRESHOLD } from '../config/norms';

// ==========================================
// 1. TOKEN DEFINITIONS
// ==========================================
export type TokenType =
  | 'NUMBER'
  | 'STRING'
  | 'BOOLEAN'
  | 'NULL'
  | 'IDENTIFIER'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'BANG'
  | 'AND'
  | 'OR'
  | 'EQ'
  | 'NEQ'
  | 'LTE'
  | 'GTE'
  | 'LT'
  | 'GT'
  | 'PLUS'
  | 'MINUS'
  | 'MUL'
  | 'DIV'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string | number | boolean | null;
  position: number;
}

// ==========================================
// 2. TOKENIZER (LEXER)
// ==========================================
export class Lexer {
  private input: string;
  private pos: number = 0;

  constructor(input: string) {
    this.input = input.trim();
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];

      // Whitespace
      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }

      // Operators and Delimiters
      if (ch === '(') {
        tokens.push({ type: 'LPAREN', value: '(', position: this.pos++ });
      } else if (ch === ')') {
        tokens.push({ type: 'RPAREN', value: ')', position: this.pos++ });
      } else if (ch === ',') {
        tokens.push({ type: 'COMMA', value: ',', position: this.pos++ });
      } else if (ch === '&' && this.peek() === '&') {
        tokens.push({ type: 'AND', value: '&&', position: this.pos });
        this.pos += 2;
      } else if (ch === '|' && this.peek() === '|') {
        tokens.push({ type: 'OR', value: '||', position: this.pos });
        this.pos += 2;
      } else if (ch === '=' && this.peek() === '=') {
        tokens.push({ type: 'EQ', value: '==', position: this.pos });
        this.pos += 2;
      } else if (ch === '!' && this.peek() === '=') {
        tokens.push({ type: 'NEQ', value: '!=', position: this.pos });
        this.pos += 2;
      } else if (ch === '!') {
        tokens.push({ type: 'BANG', value: '!', position: this.pos++ });
      } else if (ch === '<' && this.peek() === '=') {
        tokens.push({ type: 'LTE', value: '<=', position: this.pos });
        this.pos += 2;
      } else if (ch === '>' && this.peek() === '=') {
        tokens.push({ type: 'GTE', value: '>=', position: this.pos });
        this.pos += 2;
      } else if (ch === '<') {
        tokens.push({ type: 'LT', value: '<', position: this.pos++ });
      } else if (ch === '>') {
        tokens.push({ type: 'GT', value: '>', position: this.pos++ });
      } else if (ch === '+') {
        tokens.push({ type: 'PLUS', value: '+', position: this.pos++ });
      } else if (ch === '-') {
        tokens.push({ type: 'MINUS', value: '-', position: this.pos++ });
      } else if (ch === '*') {
        tokens.push({ type: 'MUL', value: '*', position: this.pos++ });
      } else if (ch === '/') {
        tokens.push({ type: 'DIV', value: '/', position: this.pos++ });
      }
      // String Literals: single or double quote
      else if (ch === '\'' || ch === '"') {
        const quote = ch;
        const startPos = this.pos;
        this.pos++; // skip opening quote
        let str = '';
        while (this.pos < this.input.length && this.input[this.pos] !== quote) {
          str += this.input[this.pos++];
        }
        if (this.pos < this.input.length) this.pos++; // skip closing quote
        tokens.push({ type: 'STRING', value: str, position: startPos });
      }
      // Number Literals (including decimals)
      else if (/[0-9]/.test(ch)) {
        const startPos = this.pos;
        let numStr = '';
        while (this.pos < this.input.length && /[0-9.]/.test(this.input[this.pos])) {
          numStr += this.input[this.pos++];
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr), position: startPos });
      }
      // Identifiers, property paths, or keywords (true, false, null)
      else if (/[a-zA-Z_]/.test(ch)) {
        const startPos = this.pos;
        let ident = '';
        while (this.pos < this.input.length && /[a-zA-Z0-9_.]/.test(this.input[this.pos])) {
          ident += this.input[this.pos++];
        }

        if (ident === 'true') {
          tokens.push({ type: 'BOOLEAN', value: true, position: startPos });
        } else if (ident === 'false') {
          tokens.push({ type: 'BOOLEAN', value: false, position: startPos });
        } else if (ident === 'null') {
          tokens.push({ type: 'NULL', value: null, position: startPos });
        } else {
          tokens.push({ type: 'IDENTIFIER', value: ident, position: startPos });
        }
      } else {
        // Unknown character - skip safely
        this.pos++;
      }
    }

    tokens.push({ type: 'EOF', value: null, position: this.pos });
    return tokens;
  }

  private peek(): string | undefined {
    return this.input[this.pos + 1];
  }
}

// ==========================================
// 3. ABSTRACT SYNTAX TREE (AST) NODES
// ==========================================
export type ASTNode =
  | { type: 'Literal'; value: unknown }
  | { type: 'Identifier'; name: string }
  | { type: 'UnaryOp'; op: string; argument: ASTNode }
  | { type: 'BinaryOp'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'CallExpr'; callee: string; args: ASTNode[] };

// ==========================================
// 4. PARSER (RECURSIVE DESCENT)
// ==========================================
export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ASTNode {
    const expr = this.parseOr();
    return expr;
  }

  private parseOr(): ASTNode {
    let left = this.parseAnd();

    while (this.match('OR')) {
      const op = String(this.previous().value);
      const right = this.parseAnd();
      left = { type: 'BinaryOp', op, left, right };
    }

    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseEquality();

    while (this.match('AND')) {
      const op = String(this.previous().value);
      const right = this.parseEquality();
      left = { type: 'BinaryOp', op, left, right };
    }

    return left;
  }

  private parseEquality(): ASTNode {
    let left = this.parseRelational();

    while (this.match('EQ', 'NEQ')) {
      const op = String(this.previous().value);
      const right = this.parseRelational();
      left = { type: 'BinaryOp', op, left, right };
    }

    return left;
  }

  private parseRelational(): ASTNode {
    let left = this.parseAdditive();

    while (this.match('LT', 'LTE', 'GT', 'GTE')) {
      const op = String(this.previous().value);
      const right = this.parseAdditive();
      left = { type: 'BinaryOp', op, left, right };
    }

    return left;
  }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();

    while (this.match('PLUS', 'MINUS')) {
      const op = String(this.previous().value);
      const right = this.parseMultiplicative();
      left = { type: 'BinaryOp', op, left, right };
    }

    return left;
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parseUnary();

    while (this.match('MUL', 'DIV')) {
      const op = String(this.previous().value);
      const right = this.parseUnary();
      left = { type: 'BinaryOp', op, left, right };
    }

    return left;
  }

  private parseUnary(): ASTNode {
    if (this.match('BANG', 'MINUS')) {
      const op = String(this.previous().value);
      const argument = this.parseUnary();
      return { type: 'UnaryOp', op, argument };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    if (this.match('NUMBER', 'STRING', 'BOOLEAN', 'NULL')) {
      return { type: 'Literal', value: this.previous().value };
    }

    if (this.match('IDENTIFIER')) {
      const name = String(this.previous().value);

      // Check if it is a function call
      if (this.match('LPAREN')) {
        const args: ASTNode[] = [];
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

  private match(...types: TokenType[]): boolean {
    for (const t of types) {
      if (this.check(t)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: null, position: 0 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, _message: string): Token {
    if (this.check(type)) return this.advance();
    return this.peek();
  }
}

// ==========================================
// 5. EVALUATION CONTEXT & RUNTIME
// ==========================================
export interface EvaluationContext {
  app: Application;
  documents: DocumentRecord[];
  institution?: Institution;
  asOfDate?: Date;
  declaredFacultyCount?: number;
}

export class SafeLogicEvaluator {
  /**
   * Build the sandbox execution scope with helpers and state
   */
  static buildScope(ctx: EvaluationContext) {
    const asOf = ctx.asOfDate || getAsOfDate();

    const findDoc = (type: string) => ctx.documents.find(d => d.documentType === type);

    const getField = (docType: string, key: string): string | null => {
      const doc = findDoc(docType);
      if (!doc) return null;
      const field = doc.extractedFields.find(f => f.fieldKey === key);
      if (!field) return null;
      // Fail-closed protocol: low confidence fields (< 0.75) are untrusted unless manually corrected
      if (!field.isManuallyCorrected && field.confidence < MIN_EXTRACTION_CONFIDENCE_THRESHOLD) {
        return null;
      }
      return field.fieldValue;
    };

    const totalIntake = ctx.app.proposedIntake || ctx.app.currentIntake || 0;
    const reqFaculty = Math.ceil(totalIntake / 20);
    const declaredFac = ctx.declaredFacultyCount !== undefined
      ? ctx.declaredFacultyCount
      : (ctx.app.type === 'Intake_Increase' ? 22 : reqFaculty);

    return {
      // Data variables
      application: {
        institution_name: ctx.app.institutionName,
        current_intake: ctx.app.currentIntake,
        proposed_intake: ctx.app.proposedIntake,
        programmes: ctx.app.programmes,
        type: ctx.app.type
      },
      institution: {
        name: ctx.institution?.name || ctx.app.institutionName,
        trust_name: ctx.institution?.trustName || '',
        location_type: ctx.institution?.locationType || 'semi-urban'
      },
      approved_intake: totalIntake,
      proposed_intake: ctx.app.proposedIntake,
      current_intake: ctx.app.currentIntake,
      faculty_count: declaredFac,
      current_date: asOf.toISOString(),

      // Helper functions
      has_document: (type: string) => !!findDoc(type),
      extracted: (type: string, key: string) => getField(type, key),
      extracted_number: (type: string, key: string) => {
        const val = getField(type, key);
        return val !== null ? parseFloat(val) : null;
      },
      extracted_bool: (type: string, key: string) => {
        const val = getField(type, key);
        if (val === null) return false;
        return val.trim().toLowerCase() === 'true';
      },
      is_expired: (type: string) => {
        const doc = findDoc(type);
        if (!doc) return true;
        if (doc.verificationStatus === 'Expired') return true;
        const expStr = getField(type, 'expiry_date');
        if (expStr && new Date(expStr).getTime() < asOf.getTime()) return true;
        return false;
      },
      is_recent: (type: string, key: string, maxDays: number) => {
        const dateStr = getField(type, key);
        if (!dateStr) return false;
        const diffDays = (asOf.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= maxDays;
      },
      date_diff: (fieldPath: string, targetDateStr: string) => {
        // fieldPath e.g. "Affidavit.execution_date"
        const parts = fieldPath.split('.');
        const docType = parts[0];
        const key = parts[1] || 'execution_date';
        const dStr = getField(docType, key);
        if (!dStr) return 99999;
        const tDate = targetDateStr ? new Date(targetDateStr) : asOf;
        const diff = (tDate.getTime() - new Date(dStr).getTime()) / (1000 * 60 * 60 * 24);
        return Math.floor(diff);
      },
      min_land_area: (locationType?: string) => {
        return getMinimumLandArea((locationType as LocationType) || 'semi-urban');
      },
      required_faculty: (programmes?: string[], intake?: number) => {
        const resolvedIntake = intake || totalIntake;
        const progLevel = resolveProgrammeLevel(programmes || ctx.app.programmes);
        return computeRequiredFaculty(resolvedIntake, progLevel).requiredFaculty;
      },
      verification_status: (type: string) => {
        const doc = findDoc(type);
        return doc ? doc.verificationStatus : null;
      }
    };
  }

  /**
   * Evaluate a compiled AST in the given scope
   */
  static evaluateAST(node: ASTNode, scope: Record<string, unknown>): unknown {
    switch (node.type) {
      case 'Literal':
        return node.value;

      case 'Identifier': {
        const parts = node.name.split('.');
        let curr: unknown = scope;
        for (const p of parts) {
          if (curr === null || curr === undefined || typeof curr !== 'object') return null;
          curr = (curr as Record<string, unknown>)[p];
        }
        return curr;
      }

      case 'UnaryOp': {
        const val = this.evaluateAST(node.argument, scope);
        if (node.op === '!') return !val;
        if (node.op === '-') return -(Number(val));
        return val;
      }

      case 'BinaryOp': {
        // Short-circuit logical operators
        if (node.op === '&&') {
          const leftVal = this.evaluateAST(node.left, scope);
          if (!leftVal) return false;
          return !!this.evaluateAST(node.right, scope);
        }
        if (node.op === '||') {
          const leftVal = this.evaluateAST(node.left, scope);
          if (leftVal) return true;
          return !!this.evaluateAST(node.right, scope);
        }

        const left = this.evaluateAST(node.left, scope);
        const right = this.evaluateAST(node.right, scope);

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
          case '<=':
            return Number(left) <= Number(right);
          case '>=':
            return Number(left) >= Number(right);
          case '<':
            return Number(left) < Number(right);
          case '>':
            return Number(left) > Number(right);
          case '+':
            return typeof left === 'string' || typeof right === 'string'
              ? String(left) + String(right)
              : Number(left) + Number(right);
          case '-':
            return Number(left) - Number(right);
          case '*':
            return Number(left) * Number(right);
          case '/':
            return Number(right) !== 0 ? Number(left) / Number(right) : 0;
          default:
            return false;
        }
      }

      case 'CallExpr': {
        const fn = scope[node.callee];
        if (typeof fn !== 'function') {
          return false;
        }
        const evaluatedArgs = node.args.map(a => this.evaluateAST(a, scope));
        return (fn as (...args: unknown[]) => unknown)(...evaluatedArgs);
      }

      default:
        return false;
    }
  }

  /**
   * Safely evaluate a logic expression string against an application context.
   * Returns a boolean indicating whether the logic check passed.
   */
  static evaluate(logicExpression: string, context: EvaluationContext): { passed: boolean; error?: string } {
    try {
      if (!logicExpression || logicExpression.trim() === '') {
        return { passed: true };
      }
      const lexer = new Lexer(logicExpression);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();
      const scope = this.buildScope(context);
      const result = this.evaluateAST(ast, scope);
      return { passed: Boolean(result) };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Logic evaluation error';
      return { passed: false, error: errorMsg };
    }
  }
}
