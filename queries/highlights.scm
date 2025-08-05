; Keywords
"namespace" @keyword
"protocol" @keyword
"struct" @keyword
"union" @keyword
"include" @keyword
"using" @keyword
"from" @keyword
"manager" @keyword
"manages" @keyword
"returns" @keyword

; Message keywords
"async" @keyword.function
"sync" @keyword.function
"intr" @keyword.function

; Directions
"parent" @keyword.directive
"child" @keyword.directive
"both" @keyword.directive

; Comments
(comment) @comment

; Preprocessor
(preprocessor_directive) @preproc

; Strings
(string) @string

; Numbers
(number) @number

; Type names
(type_name (identifier) @type)

; Built-in types and special identifiers
((identifier) @type.builtin
 (#match? @type.builtin "^(bool|int8_t|uint8_t|int16_t|uint16_t|int32_t|uint32_t|int64_t|uint64_t|float|double|nsString|nsCString|void_t|null_t|ByteBuf|Pref|Endpoint)$"))

((identifier) @function.special
 (#match? @function.special "^(__delete__|__die__)$"))

; Attributes
(attribute_list) @attribute
(attribute (identifier) @attribute)

; Operators and punctuation
";" @punctuation.delimiter
"," @punctuation.delimiter
":" @punctuation.delimiter
"{" @punctuation.bracket
"}" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket