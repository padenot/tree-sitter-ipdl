import XCTest
import SwiftTreeSitter
import TreeSitterIpdl

final class TreeSitterIpdlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ipdl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading ipdl grammar")
    }
}
