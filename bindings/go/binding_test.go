package tree_sitter_ipdl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ipdl "github.com/padenot/tree-sitter-ipdl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ipdl.Language())
	if language == nil {
		t.Errorf("Error loading ipdl grammar")
	}
}
