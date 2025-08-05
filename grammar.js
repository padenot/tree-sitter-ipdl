/**
 * @file Parser for Mozilla's IPDL (Inter-(thread|process) Protocol Definition Language
 * @author Paul Adenot <padenot@mozilla.com>
 * @license MPL-2
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ipdl",

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat(choice(
      $.include_statement,
      $.using_statement,
      $.namespace_declaration,
      $.struct_declaration,
      $.union_declaration,
      $.protocol_declaration,
      $.preprocessor_directive
    )),

    comment: $ => choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
    ),

    preprocessor_directive: $ => choice(
      /#[^\n]*/,
      seq('#ifdef', /[^\n]*/),
      seq('#ifndef', /[^\n]*/),  
      seq('#if', /[^\n]*/),
      seq('#elif', /[^\n]*/),
      seq('#else', /[^\n]*/),
      '#endif'
    ),

    include_statement: $ => choice(
      seq('include', 'protocol', $.identifier, ';'),
      seq('include', $.identifier, ';'),
      seq('include', $.string, ';'),
      // Old-style include syntax
      seq('include', '(', $.identifier, ')', ';')
    ),

    using_statement: $ => seq(
      optional($.attribute_list),
      'using',
      optional(choice('struct', 'class')),
      $.type_name,
      optional(seq('from', $.string)),
      ';'
    ),

    namespace_declaration: $ => seq(
      'namespace',
      $.identifier,
      '{',
      repeat(choice(
        $.namespace_declaration,
        $.protocol_declaration,
        $.struct_declaration,
        $.union_declaration,
        $.preprocessor_directive,
        $.using_statement
      )),
      '}',
      optional(';')
    ),

    struct_declaration: $ => seq(
      optional($.attribute_list),
      'struct',
      $.identifier,
      '{',
      repeat(choice(
        $.struct_field,
        $.preprocessor_directive
      )),
      '}',
      ';'
    ),

    struct_field: $ => seq(
      optional($.type_modifiers),
      $.type_name,
      optional($.array_suffix),
      optional($.nullable_suffix),
      $.identifier,
      ';'
    ),

    union_declaration: $ => seq(
      optional($.attribute_list),
      'union',
      $.identifier,
      '{',
      repeat(choice(
        $.union_member,
        $.preprocessor_directive
      )),
      '}',
      ';'
    ),

    union_member: $ => seq(
      optional($.type_modifiers),
      $.type_name,
      optional($.array_suffix),
      optional($.nullable_suffix),
      optional($.identifier),
      ';'
    ),

    protocol_declaration: $ => seq(
      optional($.attribute_list),
      optional(choice('sync', 'async', 'intr', 'refcounted', 'interrupt')),
      'protocol',
      $.identifier,
      '{',
      repeat($.protocol_body_item),
      '}',
      optional(';')
    ),

    protocol_body_item: $ => choice(
      $.manager_statement,
      $.manages_statement,
      $.message_direction_block,
      $.preprocessor_directive,
      $.message_declaration
    ),

    manager_statement: $ => seq(
      'manager',
      $.identifier,
      repeat(seq('or', $.identifier)),
      ';'
    ),

    manages_statement: $ => seq(
      'manages',
      $.identifier,
      ';'
    ),

    message_direction_block: $ => prec.left(seq(
      $.message_direction,
      ':',
      repeat(choice(
        $.message_declaration,
        $.preprocessor_directive
      ))
    )),

    message_direction: $ => choice(
      'parent',
      'child',
      'both'
    ),

    message_declaration: $ => seq(
      optional($.attribute_list),
      optional($.compress_annotation),
      $.message_type,
      $.identifier,
      '(',
      optional($.parameter_list),
      ')',
      optional($.returns_clause),
      ';'
    ),

    message_type: $ => choice(
      'async',
      'sync',
      'intr',
      'interrupt',
      'prio'
    ),

    compress_annotation: $ => choice(
      'compress',
      'compressall'
    ),

    returns_clause: $ => seq(
      'returns',
      '(',
      $.parameter_list,
      ')'
    ),

    parameter_list: $ => seq(
      $.parameter,
      repeat(seq(',', $.parameter))
    ),

    parameter: $ => seq(
      optional($.attribute_list),
      optional($.type_modifiers),
      $.type_name,
      optional($.array_suffix),
      optional($.nullable_suffix),
      optional($.identifier)
    ),

    type_modifiers: $ => repeat1(choice(
      'const',
      'RefCounted',
      'MoveOnly',
      'nullable'
    )),

    type_name: $ => choice(
      // Built-in types
      'int',
      'int8_t',
      'int16_t',
      'int32_t',
      'int64_t',
      'uint8_t',
      'uint16_t',
      'uint32_t',
      'uint64_t',
      'bool',
      'float',
      'double',
      'string',
      'nsString',
      'nsCString',
      'nsresult',
      'nsID',
      'ByteBuf',
      'Shmem',
      'FileDescriptor',
      // User-defined types with templates and namespaces
      seq(
        $.identifier,
        optional(seq(
          '<',
          $.type_name,
          repeat(seq(',', $.type_name)),
          '>'
        )),
        repeat(seq('::', $.identifier))
      ),
      // Endpoint type
      seq(
        'Endpoint',
        '<',
        $.identifier,
        '>'
      ),
      // ManagedEndpoint type
      seq(
        'ManagedEndpoint',
        '<',
        $.identifier,
        '>'
      ),
      // UniquePtr type
      seq(
        'UniquePtr',
        '<',
        $.type_name,
        '>'
      ),
      // Maybe type is handled via type_modifiers instead
    ),

    array_suffix: $ => repeat1(seq('[', ']')),

    nullable_suffix: $ => '?',

    attribute_list: $ => seq(
      '[',
      $.attribute,
      repeat(seq(',', $.attribute)),
      optional(','),
      ']'
    ),

    attribute: $ => seq(
      $.identifier,
      optional(seq('=', $.attribute_value))
    ),

    attribute_value: $ => choice(
      $.identifier,
      $.string,
      $.number,
      'virtual',
      'inside_sync',
      'inside_cpow',
      'not',
      'RacyUndeletedActors',
      'any',
      'main',
      'content',
      'socket',
      'gpu',
      'vr',
      'rdd',
      'gmplugin',
      'compositor',
      'normal',
      'high',
      'input',
      'mediumhigh',
      'control',
      'vsync',
      'passback',
      /[a-zA-Z_][a-zA-Z0-9_]*=[a-zA-Z_][a-zA-Z0-9_]*/
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*|__delete__|__die__|void_t|null_t|__ID/,

    string: $ => /"[^"]*"/,

    number: $ => /\d+/,
  }
});
